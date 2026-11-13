import "server-only";
import { prisma } from "../../lib/prisma";

type GetAllFilter = {
    name?: string;
    page: number;
    limit: number;
};

export default class DepartmentService {
    static async getAll(filter: GetAllFilter) {
        const where = {
            ...(filter.name && { Name: { contains: filter.name } }),
        };

        const [items, total] = await Promise.all([
            prisma.dapartemen.findMany({
                where,
                select: {
                    Departemin_id: true,
                    Name: true,
                    Description: true,
                    Contact_email: true,
                    Organization_Organization_id: true,
                },
                orderBy: { Departemin_id: "asc" },
                skip: (filter.page - 1) * filter.limit,
                take: filter.limit,
            }),
            prisma.dapartemen.count({ where }),
        ]);

        return { items, total };
    }
}