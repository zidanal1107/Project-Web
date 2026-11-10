// app/api/v1/members/route.ts
import { NextResponse } from "next/server";
import MemberService from "@/services/member.service";
import { memberQuerySchema } from "@/validations/member.validation";
import { getCurrentAdmin } from "@/lib/getCurrentAdmin";
import { serialize } from "@/lib/serialize";
import { error } from "console";

export async function GET(request: Request) {
    try {
        const actor = await getCurrentAdmin();
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
        console.error("ERROR /members get all: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}