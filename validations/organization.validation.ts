import { z } from "zod";
import { emptyToUndefined } from "./common";

export const organizationQuerySchema = z.object({
    name: z.preprocess(emptyToUndefined, z.string().trim().max(150).optional()),
});

export const organizationBodySchema = z.object({
    name: z.string().trim().min(1).max(150),
    description: z.string().trim().min(1),
    vision: z.string().trim().nullish(),
    mission: z.string().trim().nullish(),
    email: z.string().trim().email().max(150),
    logo_url: z.string().trim().url().max(255),
});