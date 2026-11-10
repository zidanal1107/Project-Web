import "server-only";
import { prisma } from "@/lib/prisma";
import type { GetAllFilter } from "@/types/member";

export default class MemberService {
    static async getAll(filter: GetAllFilter) {
        const where = {
            Status: "ACTIVE",
            MemberApp: {
                Organization_Organization_id: filter.organizationId,
            },
            ...(filter.search && {
                OR: [
                    { Member_No: { contains: filter.search } },
                    { MemberApp: { Full_Name: { contains: filter.search } } },
                ],
            }),
        };

        const [items, total] = await Promise.all([
            prisma.member.findMany({
                where,
                select: {
                    Member_Id: true,
                    Member_No: true,
                    Joined_at: true,
                    Status: true,
                    MemberApp: {
                        select: {
                            Full_Name: true,
                            Email: true,
                        },
                    },
                },
                orderBy: { Member_No: "asc" },
                skip: (filter.page - 1) * filter.limit,
                take: filter.limit,
            }),
            prisma.member.count({ where }),
        ]);

        return { items, total };
    }
}