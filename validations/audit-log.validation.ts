import { z } from "zod";
import { emptyToUndefined, paginationSchema } from "./common";

export const auditLogQuerySchema = paginationSchema.extend({
    action: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
    entity_type: z.preprocess(
        emptyToUndefined,
        z.enum(["Announcement", "Event"]).optional()
    ),
    entity_id: z.preprocess(
        emptyToUndefined,
        z.string().regex(/^\d+$/, "entity_id harus angka").optional()
    ),
});