import "server-only";
import { prisma } from "../../lib/prisma";
import type { GetFilter, UpdateOrganizationData, Actor } from "../../types/organization";

export class OrganizationNotFoundError extends Error { }

export default class OrganizationService {
    // GET
    static async getById(id: string) {
        return prisma.organization.findUnique({
            where: { Organization_id: BigInt(id) },
            select: {
                Organization_id: true,
                Name: true,
                Description: true,
                Vision: true,
                Mission: true,
                Email: true,
                Logo_url: true,
                Dapartemens: {
                    select: {
                        Departemin_id: true,
                        Name: true,
                        Description: true,
                        Contact_email: true,
                    },
                    orderBy: { Departemin_id: "asc" },
                },
            },
        });
    }

    static async get(filter: GetFilter = {}) {
        return prisma.organization.findFirst({
            where: {
                ...(filter.name && { Name: { contains: filter.name } }),
            },
            orderBy: { Organization_id: "asc" },
            select: {
                Organization_id: true,
                Name: true,
                Description: true,
                Vision: true,
                Mission: true,
                Email: true,
                Logo_url: true,
                Dapartemens: {
                    select: {
                        Departemin_id: true,
                        Name: true,
                        Description: true,
                        Contact_email: true,
                    },
                    orderBy: { Departemin_id: "asc" },
                },
            },
        });
    }

    // PUT
    static async update(id: string, data: UpdateOrganizationData, actor: Actor) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.organization.findUnique({
                where: { Organization_id: BigInt(id) },
            });
            if (!existing) throw new OrganizationNotFoundError();

            const updated = await tx.organization.update({
                where: { Organization_id: existing.Organization_id },
                data: {
                    Name: data.name,
                    Description: data.description,
                    Vision: data.vision ?? null,
                    Mission: data.mission ?? null,
                    Email: data.email,
                    Logo_url: data.logoUrl,
                },
                select: {
                    Organization_id: true,
                    Name: true,
                    Description: true,
                    Vision: true,
                    Mission: true,
                    Email: true,
                    Logo_url: true,
                },
            });

            const lastAudit = await tx.auditLog.aggregate({
                _max: { Audit_id: true },
            });
            const auditId = (lastAudit._max.Audit_id ?? BigInt(0)) + BigInt(1);

            await tx.auditLog.create({
                data: {
                    Audit_id: auditId,
                    Action: "ORGANIZATION_UPDATED",
                    Entity_type: "Organization",
                    Entity_id: existing.Organization_id,
                    Created_at: new Date(),
                    Details: JSON.stringify({
                        before: {
                            name: existing.Name,
                            description: existing.Description,
                            vision: existing.Vision,
                            mission: existing.Mission,
                            email: existing.Email,
                            logoUrl: existing.Logo_url,
                        },
                        after: {
                            name: data.name,
                            description: data.description,
                            vision: data.vision ?? null,
                            mission: data.mission ?? null,
                            email: data.email,
                            logoUrl: data.logoUrl,
                        },
                    }),
                    Admin_user_Admin_id: actor.adminId,
                    Admin_user_Email: actor.email,
                },
            });

            return updated;
        });
    }
}