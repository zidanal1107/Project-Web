export type SessionPayload = {
  adminId: string; // BigInt tidak bisa masuk JWT, simpan sebagai string
  email: string;
  organizationId: string;
};