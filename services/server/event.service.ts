// services/event.service.ts
import "server-only";
import { prisma } from "../../lib/prisma";
import type { GetAllFilter, CreateEventData, UpdateEventData } from "../../types/Event";
import type { Actor } from "../../types/common";

export class EventNotFoundError extends Error { }

export default class EventService {
    // GET
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

    // GET by ID
    static async getById(id: string) {
        return prisma.event.findUnique({
            where: { Event_id: BigInt(id) },
            include: {
                Organization: true,
                AdminUser: { select: { Admin_id: true, Email: true } },
            },
        });
    }

    // POST
    static async create(data: CreateEventData, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const lastEvent = await tx.event.aggregate({
                _max: { Event_id: true },
            });
            const eventId = (lastEvent._max.Event_id ?? BigInt(0)) + BigInt(1);

            const event = await tx.event.create({
                data: {
                    Event_id: eventId,
                    Tittle: data.title,
                    Description: data.description,
                    Location: data.location,
                    Start_at: data.startAt ?? null,
                    End_at: data.endAt,
                    Status: data.status,
                    Organization_Organization_id: actor.organizationId,
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
                    Action: "EVENT_CREATED",
                    Entity_type: "Event",
                    Entity_id: event.Event_id,
                    Created_at: new Date(),
                    Details: JSON.stringify({
                        title: data.title,
                        location: data.location,
                        status: data.status,
                        startAt: data.startAt ?? null,
                        endAt: data.endAt,
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });
            return event;
        });
    }

    // PUT
    static async update(id: string, data: UpdateEventData, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.event.findUnique({
                where: { Event_id: BigInt(id) },
            });
            if (!existing) throw new EventNotFoundError();

            const updated = await tx.event.update({
                where: { Event_id: existing.Event_id },
                data: {
                    Tittle: data.title,
                    Description: data.description,
                    Location: data.location,
                    Start_at: data.startAt ?? null,
                    End_at: data.endAt,
                    Status: data.status,
                },
            });

            const lastAudit = await tx.auditLog.aggregate({
                _max: { Audit_id: true },
            });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "EVENT_UPDATED",
                    Entity_type: "Event",
                    Entity_id: updated.Event_id,
                    Created_at: new Date(),
                    Details: JSON.stringify({
                        before: {
                            title: existing.Tittle,
                            location: existing.Location,
                            status: existing.Status,
                            startAt: existing.Start_at,
                            endAt: existing.End_at,
                        },
                        after: {
                            title: data.title,
                            location: data.location,
                            status: data.status,
                            startAt: data.startAt ?? null,
                            endAt: data.endAt,
                        },
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return updated;
        });
    }

    static async delete(id: string, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.event.findUnique({
                where: { Event_id: BigInt(id) },
            });
            if (!existing) throw new EventNotFoundError();

            await tx.event.delete({
                where: { Event_id: existing.Event_id },
            });

            const lastAudit = await tx.auditLog.aggregate({
                _max: { Audit_id: true },
            });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "EVENT_DELETED",
                    Entity_type: "Event",
                    Entity_id: existing.Event_id,
                    Created_at: new Date(),
                    // snapshot, karena baris aslinya sudah tidak ada setelah dihapus
                    Details: JSON.stringify({
                        title: existing.Tittle,
                        description: existing.Description,
                        location: existing.Location,
                        status: existing.Status,
                        startAt: existing.Start_at,
                        endAt: existing.End_at,
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return existing;
        });
    }
}