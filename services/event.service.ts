// services/event.service.ts
import "server-only";
import { prisma } from "@/lib/prisma";
import type { GetAllFilter } from "@/types/Event";

export default class EventService {
    static async getAll(filter: GetAllFilter) {
        const where = {
            ...(filter.status && { Status: filter.status }),
            ...(filter.location && { Location: { contains: filter.location } }),
        };

        const [items, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    Organization: true,
                    AdminUser: { select: { Admin_id: true, Email: true } },
                },
                orderBy: { Event_id: "desc" },
                skip: (filter.page - 1) * filter.limit,
                take: filter.limit,
            }),
            prisma.event.count({ where }),
        ]);

        return { items, total };
    }



    static async getById(id: string) {
        return prisma.event.findUnique({
            where: { Event_id: BigInt(id) },
            include: {
                Organization: true,
                AdminUser: { select: { Admin_id: true, Email: true } },
            },
        });
    }
}