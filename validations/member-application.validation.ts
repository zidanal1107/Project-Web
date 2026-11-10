import { z } from "zod";
import { APPLICATION_STATUSES } from "@/types/member-application";
import { emptyToUndefined, paginationSchema } from "./common";

export const memberApplicationBodySchema = z.object({
    full_name: z.string().trim().min(2).max(150),
    email: z.string().trim().toLowerCase().email().max(150),
    phone_number: z
        .string()
        .trim()
        .regex(/^\+?[0-9][0-9\s-]{7,28}$/, "Invalid phone number")
        .max(30),
});

export const memberApplicationQuerySchema = paginationSchema.extend({
    status: z.preprocess(
        (v) => {
            const value = emptyToUndefined(v);
            return typeof value === "string" ? value.toUpperCase() : value;
        },
        z.enum(APPLICATION_STATUSES).optional()
    ),
    search: z.preprocess(emptyToUndefined, z.string().trim().max(150).optional()),
});

export const rejectBodySchema = z.object({
    reason: z.string().trim().max(500).nullish(),
});