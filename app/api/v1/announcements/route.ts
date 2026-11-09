// app/api/v1/announcements/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import AnnouncementService, { CategoryNotFoundError } from "@/services/announcement.service";
import { serialize } from "@/lib/serialize";
import { ANNOUNCEMENT_STATUSES } from "@/types/Announcement";

const emptyToUndefined = (v: unknown) =>
    typeof v === "string" && v.trim() === "" ? undefined : v;

const querySchema = z.object({
    category_id: z.preprocess(
        emptyToUndefined,
        z.string().regex(/^\d+$/, "category_id numbers only").optional()
    ),
    status: z.preprocess(
        emptyToUndefined,
        z.enum(["draft", "published", "archived"]).optional()
    ),
});

const bodySchema = z.object({
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().nullish(),
    status: z.enum(ANNOUNCEMENT_STATUSES),
    category_id: z.coerce.number().int().positive(),
    publish_at: z.coerce.date().nullish(),
});


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
// sementara ini untuk testing, nanti diganti dengan autentikasi
async function getCurrentAdmin() {
    return {
        adminId: BigInt(1),
        email: "admin@example.com",
        organizationId: BigInt(1),
    };
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