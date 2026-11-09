// app/api/v1/events/route.ts
import { NextResponse } from "next/server";
import EventService from "@/services/event.service";
import { serialize } from "@/lib/serialize";
import { querySchema, eventBodySchema } from "@/validations/event.validation";
import type { CreateEventData } from "@/types/Event";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = querySchema.safeParse(Object.fromEntries(searchParams));

        if (!parsed.success) {
            console.error("ERROR parsed in GET /events: ", parsed.error.flatten().fieldErrors);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const { items, total } = await EventService.getAll(parsed.data);

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
        console.error("ERROR /events get all: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const actor = await getCurrentAdmin();

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, message: "Body must be in JSON format" },
                { status: 400 }
            );
        }

        const parsed = eventBodySchema.safeParse(body);
        if (!parsed.success) {
            console.error("ERROR parsed in POST /events: ", parsed.error.flatten().fieldErrors);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request body",
                },
                { status: 400 }
            );
        }

        const input: CreateEventData = {
            title: parsed.data.title,
            description: parsed.data.description,
            location: parsed.data.location,
            startAt: parsed.data.start_at,
            endAt: parsed.data.end_at,
            status: parsed.data.status,
        };

        const created = await EventService.create(input, actor);

        return NextResponse.json(
            { success: true, data: serialize(created) },
            { status: 201 }
        );
    } catch (error) {
        console.error("ERROR /events post: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}