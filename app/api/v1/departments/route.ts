import { NextResponse } from "next/server";
import DepartmentService from "@/services/department.service";
import { departmentQuerySchema } from "@/validations/department.validation";
import { serialize } from "@/lib/serialize";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = departmentQuerySchema.safeParse(
            Object.fromEntries(searchParams)
        );

        if (!parsed.success) {
            console.error("ERROR in GET /departments: ", parsed.error.flatten().fieldErrors);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const { items, total } = await DepartmentService.getAll(parsed.data);
        if (total === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No departments found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: serialize(items),
            meta: {
                page: parsed.data.page,
                limit: parsed.data.limit,
                total,
                totalPages: Math.ceil(total / parsed.data.limit),
            },
        });
    } catch (error) {
        console.error("ERROR /departments get all: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}