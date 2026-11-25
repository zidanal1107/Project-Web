import { NextResponse } from "next/server";
import MemberApplicationService, {
  DuplicateApplicationError,
} from "@/services/server/member-application.service";
import {
  memberApplicationBodySchema,
  memberApplicationQuerySchema,
} from "@/validations/member-application.validation";
import { getSystemActor } from "@/lib/system-actor";
import { serialize } from "@/lib/serialize";
import { requireAdmin, UnauthorizedError } from "@/lib/Auth";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Body must be in JSON format" },
        { status: 400 }
      );
    }

    const parsed = memberApplicationBodySchema.safeParse(body);
    if (!parsed.success) {
      console.error(
        "ERROR parsed in POST /member-applications: ",
        parsed.error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    const actor = await getSystemActor();

    const created = await MemberApplicationService.create(
      {
        fullName: parsed.data.full_name,
        email: parsed.data.email,
        phoneNumber: parsed.data.phone_number,

        tempatLahir: parsed.data.tempat_lahir,
        tanggalLahir: parsed.data.tanggal_lahir,
        jenisKelamin: parsed.data.jenis_kelamin,
        agama: parsed.data.agama,

        jurusan: parsed.data.jurusan,
        angkatan: parsed.data.angkatan,

        akunIg: parsed.data.akun_ig || null,
        hobi: parsed.data.hobi,

        alamatAsal: parsed.data.alamat_asal,
        alamatMalang: parsed.data.alamat_malang,

        riwayatPendidikan: parsed.data.riwayat_pendidikan,
        pengalamanOrganisasi: parsed.data.pengalaman_organisasi || null,

        riwayatPenyakit: parsed.data.riwayat_penyakit || null,
        minatBakat: parsed.data.minat_bakat,
        motivasi: parsed.data.motivasi,

        sumberInformasi: parsed.data.sumber_informasi,
        siapKader: parsed.data.siap_kader,
        fotoBajuUrl: parsed.data.foto_baju_url || null,
      },
      actor
    );

    return NextResponse.json(
      { success: true, data: serialize(created) },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof DuplicateApplicationError) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration with this email address is still being processed",
        },
        { status: 409 }
      );
    }
    console.error("ERROR /member-applications post: ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const actor = await requireAdmin();
    if (!actor) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = memberApplicationQuerySchema.safeParse(
      Object.fromEntries(searchParams)
    );

    if (!parsed.success) {
      console.error(
        "ERROR parsed in GET /member-applications: ",
        parsed.error.flatten().fieldErrors
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { items, total } = await MemberApplicationService.getAll({
      ...parsed.data,
      organizationId: actor.organizationId,
    });

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Applications is empty",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serialize(items),
      meta: {
        page: parsed.data.page,
        limit: parsed.data.limit,
        total,
        totalPages: Math.ceil(total / parsed.data.limit),
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("ERROR /member-applications get all: ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}