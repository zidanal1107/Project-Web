// app/api/v1/events/route.ts
import { NextResponse } from "next/server";
import EventService from "@/services/event.service";
import { serialize } from "@/lib/serialize";
import { querySchema } from "@/validations/event.validation";

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