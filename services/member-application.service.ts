import "server-only";
import { prisma } from "@/lib/prisma";
import type { CreateMemberApplicationData, GetAllFilter } from "@/types/member-application";

type Actor = { adminId: bigint; email: string; organizationId: bigint };

export class DuplicateApplicationError extends Error { }
export class ApplicationNotFoundError extends Error { }
export class ApplicationNotPendingError extends Error { }

export default class MemberApplicationService {
    static async create(data: CreateMemberApplicationData, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            // cegah pendaftaran ganda yang masih menunggu
            const duplicate = await tx.memberApp.findFirst({
                where: {
                    Email: data.email,
                    Organization_Organization_id: actor.organizationId,
                    Status: "PENDING",
                },
                select: { App_id: true },
            });
            if (duplicate) throw new DuplicateApplicationError();

            const last = await tx.memberApp.aggregate({ _max: { App_id: true } });
            const appId = (last._max.App_id ?? BigInt(0)) + BigInt(1);

            const application = await tx.memberApp.create({
                data: {
                    App_id: appId,
                    Full_Name: data.fullName,
                    Email: data.email,
                    Phone_Number: data.phoneNumber,
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
                    Status: true,
                    Submitted_at: true,
                },
            });

            const lastAudit = await tx.auditLog.aggregate({ _max: { Audit_id: true } });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "APPLICATION_SUBMITTED",
                    Entity_type: "MemberApplication",
                    Entity_id: application.App_id,
                    Created_at: new Date(),
                    Details: JSON.stringify({
                        fullName: data.fullName,
                        email: data.email,
                        source: "public",
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return application;
        });
    }

    static async getAll(filter: GetAllFilter) {
        const where = {
            Organization_Organization_id: filter.organizationId,
            ...(filter.status && { Status: filter.status }),
            ...(filter.search && {
                OR: [
                    { Full_Name: { contains: filter.search } },
                    { Email: { contains: filter.search } },
                ],
            }),
        };

        const [items, total] = await Promise.all([
            prisma.memberApp.findMany({
                where,
                select: {
                    App_id: true,
                    Full_Name: true,
                    Email: true,
                    Phone_Number: true,
                    Submitted_at: true,
                    Status: true,
                    AdminUser: { select: { Admin_id: true, Email: true } }, // admin yang memproses
                    Member: { select: { Member_Id: true, Member_No: true } }, // ada jika sudah jadi anggota
                },
                orderBy: { App_id: "desc" }, // terbaru di atas
                skip: (filter.page - 1) * filter.limit,
                take: filter.limit,
            }),
            prisma.memberApp.count({ where }),
        ]);

        return { items, total };
    }

    static async approve(id: string, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const application = await tx.memberApp.findFirst({
                where: {
                    App_id: BigInt(id),
                    Organization_Organization_id: actor.organizationId,
                },
            });
            if (!application) throw new ApplicationNotPendingError();

            // Penjaga atomik: hanya berhasil kalau status masih PENDING.
            // Dua admin yang menekan "setujui" bersamaan, hanya satu yang lolos.
            const updated = await tx.memberApp.updateMany({
                where: {
                    App_id: application.App_id,
                    Email: application.Email,
                    Status: "PENDING",
                },
                data: {
                    Status: "APPROVED",
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });
            if (updated.count === 0) throw new ApplicationNotPendingError();

            const now = new Date();
            const memberNo = await generateMemberNo(tx, now.getFullYear());

            const lastMember = await tx.member.aggregate({
                _max: { Member_Id: true },
            });
            const memberId = (lastMember._max.Member_Id ?? BigInt(0)) + BigInt(1);

            const member = await tx.member.create({
                data: {
                    Member_Id: memberId,
                    Member_No: memberNo,
                    Joined_at: now,
                    Status: "ACTIVE",
                    Member_app_App_id: application.App_id,
                    Member_app_Email: application.Email,
                },
                select: {
                    Member_Id: true,
                    Member_No: true,
                    Joined_at: true,
                    Status: true,
                },
            });

            const lastAudit = await tx.auditLog.aggregate({
                _max: { Audit_id: true },
            });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "APPLICATION_APPROVED",
                    Entity_type: "MemberApplication",
                    Entity_id: application.App_id,
                    Created_at: now,
                    Details: JSON.stringify({
                        fullName: application.Full_Name,
                        email: application.Email,
                        memberId: member.Member_Id.toString(),
                        memberNo: member.Member_No,
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return {
                application: {
                    App_id: application.App_id,
                    Full_Name: application.Full_Name,
                    Email: application.Email,
                    Status: "APPROVED",
                },
                member,
            };
        });
    }

    static async reject(id: string, reason: string | null, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const application = await tx.memberApp.findFirst({
                where: {
                    App_id: BigInt(id),
                    Organization_Organization_id: actor.organizationId,
                },
            });
            if (!application) throw new ApplicationNotFoundError();

            // Penjaga atomik: hanya berhasil kalau status masih PENDING
            const updated = await tx.memberApp.updateMany({
                where: {
                    App_id: application.App_id,
                    Email: application.Email,
                    Status: "PENDING",
                },
                data: {
                    Status: "REJECTED",
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });
            if (updated.count === 0) throw new ApplicationNotPendingError();

            const lastAudit = await tx.auditLog.aggregate({
                _max: { Audit_id: true },
            });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "APPLICATION_REJECTED",
                    Entity_type: "MemberApplication",
                    Entity_id: application.App_id,
                    Created_at: new Date(),
                    Details: JSON.stringify({
                        fullName: application.Full_Name,
                        email: application.Email,
                        reason,
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return {
                App_id: application.App_id,
                Full_Name: application.Full_Name,
                Email: application.Email,
                Status: "REJECTED",
            };
        });
    }
}

async function generateMemberNo(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    year: number
) {
    const prefix = `M-${year}-`;
    const last = await tx.member.findFirst({
        where: { Member_No: { startsWith: prefix } },
        orderBy: { Member_No: "desc" },
        select: { Member_No: true },
    });
    const lastSeq = last ? parseInt(last.Member_No.slice(prefix.length), 10) : 0;
    return `${prefix}${String(lastSeq + 1).padStart(4, "0")}`;
}