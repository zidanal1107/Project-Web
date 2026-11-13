// app/api/v1/announcements/[id]/route.ts
import { NextResponse } from "next/server";
import AnnouncementService, {AnnouncementNotFoundError, CategoryNotFoundError} from "@../../../services/server/announcement.service";
import { serialize } from "@/../../lib/serialize";
import { UpdateAnnouncementData,  } from "@../../../types/Announcement";
import { paramsSchema, bodySchema } from "@../../../validations/announcement.validation";
import { getCurrentAdmin } from "@../../../lib/getCurrentAdmin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const parsed = paramsSchema.safeParse(await params);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 }
      );
    }

    const announcement = await AnnouncementService.getById(parsed.data.id);

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serialize(announcement), // helper BigInt dari sebelumnya
    });
  } catch (error) {
    console.error("ERROR /announcements/[id] get:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await getCurrentAdmin(); // sementara, nanti dari sesi login

    const parsedParams = paramsSchema.safeParse(await params);
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
        { success: false, message: "Body harus berupa JSON" },
        { status: 400 }
      );
    }

    const parsedBody = bodySchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
          errors: parsedBody.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input: UpdateAnnouncementData = {
      title: parsedBody.data.title,
      content: parsedBody.data.content,
      status: parsedBody.data.status,
      categoryId: parsedBody.data.category_id,
      publishAt: parsedBody.data.publish_at,
    };

    const updated = await AnnouncementService.update(
      parsedParams.data.id,
      input,
      actor
    );

    return NextResponse.json({ success: true, data: serialize(updated) });
  } catch (error) {
    if (error instanceof AnnouncementNotFoundError) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }
    if (error instanceof CategoryNotFoundError) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }
    console.error("ERROR /announcements put: ", error);
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
    const actor = await getCurrentAdmin(); // sementara, nanti dari sesi login

    const parsed = paramsSchema.safeParse(await params);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request parameters" },
        { status: 400 }
      );
    }

    await AnnouncementService.delete(parsed.data.id, actor);

    return NextResponse.json({
      success: true,
      message: "Announcement deleted",
    });
  } catch (error) {
    if (error instanceof AnnouncementNotFoundError) {
      return NextResponse.json(
        { success: false, message: "Announcement not found" },
        { status: 404 }
      );
    }
    console.error("ERROR /announcements delete: ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}