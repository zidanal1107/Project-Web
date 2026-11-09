// app/api/v1/events/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import EventService from "@/services/event.service";
import { serialize } from "@/lib/serialize";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const querySchema = z.object({
  location: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  status: z.preprocess(emptyToUndefined, z.string().max(20).optional()),
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).default(1)),
  limit: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(50).default(10)
  ),
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