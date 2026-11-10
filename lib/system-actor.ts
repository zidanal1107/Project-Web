import "server-only";

export function getSystemActor() {
  const adminId = process.env.SYSTEM_ADMIN_ID;
  const email = process.env.SYSTEM_ADMIN_EMAIL;
  const organizationId = process.env.DEFAULT_ORGANIZATION_ID;

  if (!adminId || !email || !organizationId) {
    throw new Error("SYSTEM_ADMIN_ID, SYSTEM_ADMIN_EMAIL, DEFAULT_ORGANIZATION_ID belum diset");
  }

  return {
    adminId: BigInt(adminId),
    email,
    organizationId: BigInt(organizationId),
  };
}