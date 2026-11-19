import "server-only";
import { readSession } from "@/lib/session";
import type { Actor } from "@/types/common";

export class UnauthorizedError extends Error {}

export async function getCurrentAdmin(): Promise<Actor | null> {
  const session = await readSession();
  if (!session) return null;

  return {
    adminId: BigInt(session.adminId),
    email: session.email,
    organizationId: BigInt(session.organizationId),
  };
}

// Dipakai di route admin: melempar UnauthorizedError kalau belum login
export async function requireAdmin(): Promise<Actor> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}