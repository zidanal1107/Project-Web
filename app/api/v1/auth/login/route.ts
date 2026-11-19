// app/api/v1/auth/login/route.ts
import { NextResponse } from "next/server";
import AuthService, { InvalidCredentialsError } from "@/services/server/auth.service";
import { loginBodySchema } from "@/validations/auth.validation";
import { createSession } from "@/lib/session";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const limit = await checkRateLimit(getClientIp(request));
    if (!limit.success) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak percobaan, coba lagi dalam 1 menit" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Body harus berupa JSON" },
        { status: 400 }
      );
    }

    const parsed = loginBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const admin = await AuthService.login(parsed.data.email, parsed.data.password);

    await createSession({
      adminId: admin.adminId.toString(),
      email: admin.email,
      organizationId: admin.organizationId.toString(),
    });

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: { adminId: admin.adminId.toString(), email: admin.email },
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      );
    }
    console.error("ERROR /auth/login: ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}