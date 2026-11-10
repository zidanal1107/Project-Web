import { NextResponse } from "next/server";
import MemberApplicationService, {
    ApplicationNotFoundError,
    ApplicationNotPendingError,
} from "@/services/member-application.service";
import { idParamsSchema } from "@/validations/common";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";
import { serialize } from "@/lib/serialize";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const actor = await getCurrentAdmin();
        if (!actor) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const parsed = idParamsSchema.safeParse(await params);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, message: "Invalid request parameters" },
                { status: 400 }
            );
        }

        const result = await MemberApplicationService.approve(parsed.data.id, actor);

        return NextResponse.json({
            success: true,
            message: "Application approved",
            data: serialize(result),
        });
    } catch (error) {
        if (error instanceof ApplicationNotFoundError) {
            return NextResponse.json(
                { success: false, message: "Application not found" },
                { status: 404 }
            );
        }
        if (error instanceof ApplicationNotPendingError) {
            return NextResponse.json(
                { success: false, message: "Application is not pending" },
                { status: 409 }
            );
        }
        console.error("ERROR /member-applications approve: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

