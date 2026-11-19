import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export class InvalidCredentialsError extends Error {}

// Hash palsu agar waktu respons sama saat email tidak ditemukan.
// Cost 12 harus sama dengan cost saat membuat hash admin.
const DUMMY_HASH = bcrypt.hashSync("bukan-password-asli", 12);

// ASUMSI: AdminUser tidak punya kolom organisasi, jadi pakai organisasi tunggal.
// Kalau ada (misal Organization_Organization_id), ganti dengan nilai dari admin.
async function resolveOrganizationId() {
  const org = await prisma.organization.findFirst({
    orderBy: { Organization_id: "asc" },
    select: { Organization_id: true },
  });
  if (!org) throw new Error("Organisasi belum ada di database");
  return org.Organization_id;
}

export default class AuthService {
  static async login(email: string, password: string) {
    // Primary key AdminUser composite (Admin_id + Email): cari dengan findFirst
    const admin = await prisma.adminUser.findFirst({
      where: { Email: email },
      select: {
        Admin_id: true,
        Email: true,
        Password_hash: true, // ASUMSI: nama kolom hash password
      },
    });

    // Selalu jalankan compare, supaya email yang terdaftar tidak bisa ditebak
    const valid = await bcrypt.compare(password, admin?.Password_hash ?? DUMMY_HASH);
    if (!admin || !valid) throw new InvalidCredentialsError();

    return {
      adminId: admin.Admin_id,
      email: admin.Email,
      organizationId: await resolveOrganizationId(),
    };
  }
}