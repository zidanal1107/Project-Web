import { z } from "zod";
import { ANNOUNCEMENT_STATUSES } from "../types/Announcement";
import { emptyToUndefined } from "./common";

export const bodySchema = z.object({
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().nullish(),
    status: z.enum(ANNOUNCEMENT_STATUSES),
    category_id: z.coerce.number().int().positive(),
    publish_at: z.coerce.date().nullish(),
});

export const querySchema = z.object({
    category_id: z.preprocess(
        emptyToUndefined,
        z.string().regex(/^\d+$/, "category_id numbers only").optional()
    ),
    status: z.preprocess(
        emptyToUndefined,
        z.enum(["draft", "published", "archived"]).optional()
    ),
});

export const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});