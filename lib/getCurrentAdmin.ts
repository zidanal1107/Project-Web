// sementara ini untuk testing, nanti diganti dengan autentikasi
export async function getCurrentAdmin() {
    return {
        adminId: BigInt(1),
        email: "admin@example.com",
        organizationId: BigInt(1),
    };
}