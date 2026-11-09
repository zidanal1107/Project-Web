// app/api/v1/events/[id]/route.ts
import { NextResponse } from "next/server";
import EventService from "@/services/event.service";
import { serialize } from "@/lib/serialize";
import { idParamsSchema } from "@/validations/common";

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