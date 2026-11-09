import "server-only";
import { prisma } from "@/lib/prisma";

type GetAllFilter = {
    name?: string;
};

export default class CategoryService {
    static async getAll(filter: GetAllFilter = {}) {
        return prisma.category.findMany({
            where: {
                ...(filter.name && { Name: { contains: filter.name } }),
            },
            select: {
                Category_id: true,
                Name: true,
                Description: true,
            },
            orderBy: { Name: "asc" },
        });
    }
}