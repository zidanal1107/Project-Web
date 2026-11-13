import "server-only";
import { prisma } from "../../lib/prisma";
import { GetAllFilter } from "../../types/Audit";

export default class AuditLogService {
    static async getAll(filter: GetAllFilter) {
        const where = {
            ...(filter.action && { Action: filter.action }),
            ...(filter.entity_type && { Entity_type: filter.entity_type }),
            ...(filter.entity_id && { Entity_id: BigInt(filter.entity_id) }),
        };

        const [items, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                include: {
                    AdminUser: { select: { Admin_id: true, Email: true } },
                },
                orderBy: { Audit_id: "desc" },
                skip: (filter.page - 1) * filter.limit,
                take: filter.limit,
            }),
            prisma.auditLog.count({ where }),
        ]);

        return { items, total };
    }
}