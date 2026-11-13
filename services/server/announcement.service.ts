import "server-only";
import { prisma } from "../../lib/prisma";
import type { GetAllFilter, CreateAnnouncementData, UpdateAnnouncementData } from "../../types/Announcement";
import type { Actor } from "../../types/common";

export class CategoryNotFoundError extends Error { }
export class AnnouncementNotFoundError extends Error { }

export default class AnnouncementService {
    // GET
    static async getAll(filter: GetAllFilter = {}) {
        return prisma.announcement.findMany({
            where: {
                ...(filter.status && { Status: filter.status }),
                ...(filter.category_id && {
                    Category_Category_id: BigInt(filter.category_id),
                })
            },
            include: {
                Category: { select: { Category_id: true, Name: true } },
                AdminUser: { select: { Admin_id: true, Email: true } },
            },
            orderBy: { Announcement_id: "desc" },
        });
    }

    static async getById(id: number) {
        return prisma.announcement.findUnique({
            where: { Announcement_id: BigInt(id) },
            include: {
                Category: { select: { Category_id: true, Name: true } },
                AdminUser: { select: { Admin_id: true, Email: true } },
            },
        });
    }

    // POST
    static async create(data: CreateAnnouncementData, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const category = await tx.category.findFirst({
                where: { Category_id: BigInt(data.categoryId) },
                select: { Category_id: true, Name: true },
            });
            if (!category) throw new CategoryNotFoundError();

            const lastAnn = await tx.announcement.aggregate({
                _max: { Announcement_id: true },
            });
            const announcementId = (lastAnn._max.Announcement_id ?? BigInt(0)) + BigInt(1);

            const announcement = await tx.announcement.create({
                data: {
                    Announcement_id: announcementId,
                    Tittle: data.title,
                    Content: data.content ?? null,
                    Status: data.status,
                    Created_at: new Date(),
                    Publish_at: data.publishAt ?? null,
                    Organization_Organization_id: actor.organizationId,
                    Category_Category_id: category.Category_id,
                    Category_Name: category.Name,
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            const lastAudit = await tx.auditLog.aggregate({
                _max: { Audit_id: true },
            });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "ANNOUNCEMENT_PUBLISHED",
                    Entity_type: "Announcement",
                    Entity_id: announcement.Announcement_id,
                    Created_at: new Date(),
                    Details: JSON.stringify({
                        title: data.title,
                        status: data.status,
                        categoryId: data.categoryId,
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return announcement;
        });
    }

    // PUT
    static async update(id: number, data: UpdateAnnouncementData, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.announcement.findUnique({
                where: { Announcement_id: BigInt(id) },
            });
            if (!existing) throw new AnnouncementNotFoundError();

            const category = await tx.category.findFirst({
                where: { Category_id: BigInt(data.categoryId) },
                select: { Category_id: true, Name: true },
            });
            if (!category) throw new CategoryNotFoundError();

            const updated = await tx.announcement.update({
                where: { Announcement_id: existing.Announcement_id },
                data: {
                    Tittle: data.title,
                    Content: data.content ?? null,
                    Status: data.status,
                    Publish_at: data.publishAt ?? null,
                    Category_Category_id: category.Category_id,
                    Category_Name: category.Name,
                },
            });

            const lastAudit = await tx.auditLog.aggregate({
                _max: { Audit_id: true },
            });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "ANNOUNCEMENT_UPDATED",
                    Entity_type: "Announcement",
                    Entity_id: updated.Announcement_id,
                    Created_at: new Date(),
                    Details: JSON.stringify({
                        before: {
                            title: existing.Tittle,
                            status: existing.Status,
                            categoryId: existing.Category_Category_id.toString(),
                        },
                        after: {
                            title: data.title,
                            status: data.status,
                            categoryId: data.categoryId,
                        },
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return updated;
        });
    }

    // DELETE
    static async delete(id: number, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.announcement.findUnique({
                where: { Announcement_id: BigInt(id) },
            });
            if (!existing) throw new AnnouncementNotFoundError();

            await tx.announcement.delete({
                where: { Announcement_id: existing.Announcement_id },
            });

            const lastAudit = await tx.auditLog.aggregate({
                _max: { Audit_id: true },
            });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "ANNOUNCEMENT_DELETED",
                    Entity_type: "Announcement",
                    Entity_id: existing.Announcement_id,
                    Created_at: new Date(),
                    // simpan snapshot, karena datanya sudah tidak ada setelah dihapus
                    Details: JSON.stringify({
                        title: existing.Tittle,
                        status: existing.Status,
                        categoryId: existing.Category_Category_id.toString(),
                        categoryName: existing.Category_Name,
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return existing;
        });
    }
}