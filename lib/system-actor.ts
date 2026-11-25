import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSystemActor() {
  const [admin, organization] = await Promise.all([
    prisma.adminUser.findFirst({
      orderBy: {
        Admin_id: "asc",
      },
      select: {
        Admin_id: true,
        Email: true,
      },
    }),
    prisma.organization.findFirst({
      orderBy: {
        Organization_id: "asc",
      },
      select: {
        Organization_id: true,
      },
    }),
  ]);

  if (!admin) {
    throw new Error("Data admin tidak ditemukan di tabel AdminUser");
  }

  if (!organization) {
    throw new Error("Data organisasi tidak ditemukan di tabel Organization");
  }

  return {
    adminId: BigInt(admin.Admin_id),
    email: admin.Email,
    organizationId: BigInt(organization.Organization_id),
  };
}