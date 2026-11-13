import { NextResponse } from "next/server";
import AuditLogService from "@../../../services/server/audit-log.service";
import { auditLogQuerySchema } from "@../../../validations/audit-log.validation";
import { serialize } from "@../../../lib/serialize";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = auditLogQuerySchema.safeParse(
            Object.fromEntries(searchParams)
        );

        if (!parsed.success) {
            console.error("ERROR in GET /audit-logs: ", parsed.error.flatten().fieldErrors);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const { items, total } = await AuditLogService.getAll(parsed.data);

        // Details disimpan sebagai string JSON, ubah jadi objek agar mudah dipakai frontend
        const data = items.map((item) => {
            let details: unknown = item.Details;
            if (typeof item.Details === "string") {
                try {
                    details = JSON.parse(item.Details);
                } catch {
                    details = item.Details; // bukan JSON valid, biarkan apa adanya
                }
            }
            return { ...item, Details: details };
        });

        return NextResponse.json({
            success: true,
            data: serialize(data),
            meta: {
                page: parsed.data.page,
                limit: parsed.data.limit,
                total,
                totalPages: Math.ceil(total / parsed.data.limit),
            },
        });
    } catch (error) {
        console.error("ERROR /audit-logs get all: ", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}