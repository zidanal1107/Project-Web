import { NextResponse } from "next/server";
import MemberApplicationService, {
    ApplicationNotFoundError,
    ApplicationNotPendingError,
} from "@/services/member-application.service";
import { idParamsSchema } from "@/validations/common";
import { rejectBodySchema } from "@/validations/member-application.validation";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";
import { serialize } from "@/lib/serialize";

export async function POST(
    request: Request,
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

        const parsedParams = idParamsSchema.safeParse(await params);
        if (!parsedParams.success) {
            return NextResponse.json(
                { success: false, message: "Invalid request parameters" },
                { status: 400 }
            );
        }

        // Body opsional: kosong atau bukan JSON dianggap tanpa alasan
        let body: unknown = {};
        try {
            body = await request.json();
        } catch {
            body = {};
        }

        const parsedBody = rejectBodySchema.safeParse(body);
        console.error("ERROR in POST /member-applications reject: ", parsedBody.error?.flatten().fieldErrors);
        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request body",
                },
                { status: 400 }
            );
        }

        const result = await MemberApplicationService.reject(
            parsedParams.data.id,
            parsedBody.data.reason ?? null,
            actor
        );

        return NextResponse.json({
            success: true,
            message: "Application rejected",
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
        console.error("ERROR /member-applications reject: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}