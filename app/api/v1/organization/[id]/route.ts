import { NextResponse } from "next/server";
import OrganizationService, {
    OrganizationNotFoundError,
} from "@/services/organization.service";
import { idParamsSchema } from "@/validations/common";
import { organizationBodySchema } from "@/validations/organization.validation";
import type { UpdateOrganizationData } from "@/types/organization";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";
import { serialize } from "@/lib/serialize";

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

        const result = await OrganizationService.getById(parsed.data.id);
        if (!result) {
            return NextResponse.json(
                { success: false, message: "Organization not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: serialize(result) });
    } catch (error) {
        console.error("ERROR /organization get by id: ", error);
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

        // admin hanya boleh mengubah organisasinya sendiri
        if (BigInt(parsedParams.data.id) !== actor.organizationId) {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
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

        const parsedBody = organizationBodySchema.safeParse(body);
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

        const input: UpdateOrganizationData = {
            name: parsedBody.data.name,
            description: parsedBody.data.description,
            vision: parsedBody.data.vision,
            mission: parsedBody.data.mission,
            email: parsedBody.data.email,
            logoUrl: parsedBody.data.logo_url,
        };

        const updated = await OrganizationService.update(
            parsedParams.data.id,
            input,
            actor
        );

        return NextResponse.json({ success: true, data: serialize(updated) });
    } catch (error) {
        if (error instanceof OrganizationNotFoundError) {
            return NextResponse.json(
                { success: false, message: "Organization not found" },
                { status: 404 }
            );
        }
        console.error("ERROR /organization put: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}