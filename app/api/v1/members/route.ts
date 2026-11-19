// app/api/v1/members/route.ts
import { NextResponse } from "next/server";
import MemberService from "@/services/server/member.service";
import { memberQuerySchema } from "@/validations/member.validation";
import { requireAdmin, UnauthorizedError } from "@/lib/Auth";
import { serialize } from "@/lib/serialize";

export async function GET(request: Request) {
    try {
        const actor = await requireAdmin();
        if (!actor) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const parsed = memberQuerySchema.safeParse(Object.fromEntries(searchParams));

        if (!parsed.success) {
            console.error("ERROR parsed in GET /members: ", parsed.error.flatten().fieldErrors);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const { items, total } = await MemberService.getAll({
            ...parsed.data,
            organizationId: actor.organizationId,
        });

        if (total === 0 || items.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Members is empty",
            }, { status: 404 });
        }

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
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        console.error("ERROR /members get all: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}