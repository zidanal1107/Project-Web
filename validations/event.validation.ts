import { z } from "zod";
import { emptyToUndefined } from "./common";
import { EVENT_STATUSES } from "@/types/Event";

export const querySchema = z.object({
    location: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
    status: z.preprocess(emptyToUndefined, z.string().max(20).optional()),
    page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).default(1)),
    limit: z.preprocess(
        emptyToUndefined,
        z.coerce.number().int().min(1).max(50).default(10)
    ),
});

export const eventBodySchema = z.object({
        title: z.string().trim().min(1).max(200),
        description: z.string().trim().min(1),
        location: z.string().trim().min(1).max(200),
        start_at: z.coerce.date().nullish(),
        end_at: z.coerce.date(),
        status: z.enum(EVENT_STATUSES),
    })
    .refine((d) => !d.start_at || d.start_at <= d.end_at, {
        message: "start_at tidak boleh setelah end_at",
        path: ["start_at"],
    });