// app/api/v1/categories/route.ts
import { NextResponse } from "next/server";
import CategoryService from "@/services/category.service";
import { categoryQuerySchema } from "@/validations/category.validation";
import { serialize } from "@/lib/serialize";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = categoryQuerySchema.safeParse(
            Object.fromEntries(searchParams)
        );

        if (!parsed.success) {
            console.error("ERROR in GET /categories: ", parsed.error.flatten().fieldErrors);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const result = await CategoryService.getAll(parsed.data);

        if (!result || result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No categories found",
                },
                { status: 404 }
            );
        }
        return NextResponse.json({
            success: true,
            data: serialize(result),
        });
    } catch (error) {
        console.error("ERROR /categories get all: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}