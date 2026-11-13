// app/api/v1/announcements/route.ts
import { NextResponse } from "next/server";
import AnnouncementService, { CategoryNotFoundError } from "@../../../services/server/announcement.service";
import { serialize } from "@../../../lib/serialize";
import { querySchema, bodySchema } from "@../../../validations/announcement.validation";
import { getCurrentAdmin } from "@../../../lib/getCurrentAdmin";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = querySchema.safeParse(Object.fromEntries(searchParams));

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid query parameters",
                    errors: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const result = await AnnouncementService.getAll(
            parsed.data.category_id ? {
                category_id: Number(parsed.data.category_id),
                status: parsed.data.status
            } : { status: parsed.data.status }
        );

        return NextResponse.json({
            success: true,
            data: serialize(result),
        });
    } catch (error) {
        console.error("ERROR /announcements get all: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const actor = await getCurrentAdmin();
        if (!actor) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, message: "Body must be in JSON format" },
                { status: 400 }
            );
        }

        const parsed = bodySchema.safeParse(body);
        if (!parsed.success) {
            console.error("ERROR parsed in POST /announcements: ", parsed.error.flatten().fieldErrors);

            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request body",
                },
                { status: 400 }
            );
        }

        const { title, content, status, category_id, publish_at } = parsed.data;

        const created = await AnnouncementService.create(
            { title, content, status, categoryId: category_id, publishAt: publish_at },
            actor
        );

        return NextResponse.json(
            { success: true, data: serialize(created) },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof CategoryNotFoundError) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }
        console.error("ERROR /announcements post: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}