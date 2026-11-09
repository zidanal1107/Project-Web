import { NextResponse } from "next/server";
import OrganizationService from "@/services/organization.service";
import { organizationQuerySchema } from "@/validations/organization.validation";
import { serialize } from "@/lib/serialize";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = organizationQuerySchema.safeParse(
            Object.fromEntries(searchParams)
        );

        if (!parsed.success) {
            console.error("ERROR in GET /organization: ", parsed.error.flatten().fieldErrors);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const organization = await OrganizationService.get(parsed.data);

        if (!organization) {
            return NextResponse.json(
                { success: false, message: "Organization not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: serialize(organization),
        });
    } catch (error) {
        console.error("ERROR /organization get: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}