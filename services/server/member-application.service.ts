import { prisma } from "@/lib/prisma";
import type {
  CreateMemberApplicationData,
  GetMemberApplicationsParams,
  SystemActor,
} from "@/types/member-application";

export class DuplicateApplicationError extends Error {
  constructor(message = "Registration with this email address is still being processed") {
    super(message);
    this.name = "DuplicateApplicationError";
  }
}

class MemberApplicationService {
  static async create(data: CreateMemberApplicationData, actor: SystemActor) {
    const existing = await prisma.memberApp.findFirst({
      where: {
        Email: data.email,
        Organization_Organization_id: actor.organizationId,
        Status: "PENDING",
      },
      select: {
        App_id: true,
      },
    });

    if (existing) {
      throw new DuplicateApplicationError();
    }

    return prisma.$transaction(async (tx) => {
      const last = await tx.memberApp.aggregate({
        _max: {
          App_id: true,
        },
      });

      const appId = (last._max.App_id ?? BigInt(0)) + BigInt(1);

      const application = await tx.memberApp.create({
        data: {
          App_id: appId,

          Full_Name: data.fullName,
          Email: data.email,
          Phone_Number: data.phoneNumber,

          Tempat_lahir: data.tempatLahir,
          Tanggal_lahir: data.tanggalLahir,
          Jenis_kelamin: data.jenisKelamin,
          Agama: data.agama,

          Jurusan: data.jurusan,
          Angkatan: data.angkatan,

          Akun_ig: data.akunIg ?? null,
          Hobi: data.hobi,

          Alamat_asal: data.alamatAsal,
          Alamat_malang: data.alamatMalang,

          Riwayat_pendidikan: data.riwayatPendidikan,
          Pengalaman_organisasi: data.pengalamanOrganisasi ?? null,

          Riwayat_penyakit: data.riwayatPenyakit ?? null,
          Minat_bakat: data.minatBakat,
          Motivasi: data.motivasi,

          Sumber_informasi: data.sumberInformasi,
          Siap_kader: data.siapKader,
          Foto_baju_url: data.fotoBajuUrl ?? null,

          Submitted_at: new Date(),
          Status: "PENDING",
          Organization_Organization_id: actor.organizationId,
          Admin_user_Admin_id: actor.adminId,
          Admin_user_Email: actor.email,
        },
        select: {
          App_id: true,
          Full_Name: true,
          Email: true,
          Phone_Number: true,
          Jurusan: true,
          Angkatan: true,
          Siap_kader: true,
          Submitted_at: true,
          Status: true,
        },
      });

      return application;
    });
  }

  static async getAll(params: GetMemberApplicationsParams) {
    const { page, limit, status, search, organizationId } = params;
    const skip = (page - 1) * limit;

    const where = {
      Organization_Organization_id: organizationId,
      ...(status ? { Status: status } : {}),
      ...(search
        ? {
            OR: [
              { Full_Name: { contains: search } },
              { Email: { contains: search } },
              { Jurusan: { contains: search } },
              { Angkatan: { contains: search } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.memberApp.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          App_id: "desc",
        },
      }),
      prisma.memberApp.count({ where }),
    ]);

    return { items, total };
  }
}

export default MemberApplicationService;