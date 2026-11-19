// lib/session.ts
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "@/types/SessionPayload";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24; // 1 hari (detik)

function getKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET belum diset atau kurang dari 32 karakter");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({
    email: payload.email,
    org: payload.organizationId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.adminId)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getKey());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.org !== "string"
    ) {
      return null;
    }
    return {
      adminId: payload.sub,
      email: payload.email,
      organizationId: payload.org,
    };
  } catch {
    return null; // token rusak, dipalsukan, atau kedaluwarsa
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}