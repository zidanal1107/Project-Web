// app/api/v1/events/[id]/route.ts
import { NextResponse } from "next/server";
import EventService, { EventNotFoundError } from "@/services/event.service";
import { serialize } from "@/lib/serialize";
import { idParamsSchema } from "@/validations/common";
import { UpdateEventData } from "@/types/Event";
import { eventBodySchema } from "@/validations/event.validation";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const parsed = idParamsSchema.safeParse(await params);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: "Invalid request parameters" },
                { status: 400 }
            );
        }

        const result = await EventService.getById(parsed.data.id);
        if (!result) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: serialize(result) });
    } catch (error) {
        console.error("ERROR /events get by id: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const actor = await getCurrentAdmin();

        const parsedParams = idParamsSchema.safeParse(await params);
        if (!parsedParams.success) {
            return NextResponse.json(
                { success: false, message: "Invalid request parameters" },
                { status: 400 }
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

        const parsedBody = eventBodySchema.safeParse(body);
        console.error("ERROR parsed in PUT /events: ", parsedBody.error?.flatten().fieldErrors);
        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request body",
                },
                { status: 400 }
            );
        }

        const input: UpdateEventData = {
            title: parsedBody.data.title,
            description: parsedBody.data.description,
            location: parsedBody.data.location,
            startAt: parsedBody.data.start_at,
            endAt: parsedBody.data.end_at,
            status: parsedBody.data.status,
        };

        const updated = await EventService.update(
            parsedParams.data.id,
            input,
            actor
        );

        return NextResponse.json({ success: true, data: serialize(updated) });
    } catch (error) {
        if (error instanceof EventNotFoundError) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }
        console.error("ERROR /events put: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const actor = await getCurrentAdmin();

        const parsed = idParamsSchema.safeParse(await params);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: "Invalid request parameters" },
                { status: 400 }
            );
        }

        await EventService.delete(parsed.data.id, actor);

        return NextResponse.json({
            success: true,
            message: "Event deleted",
        });
    } catch (error) {
        if (error instanceof EventNotFoundError) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }
        console.error("ERROR /events delete: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}