import { z } from "zod";
import { emptyToUndefined } from "./common";

export const categoryQuerySchema = z.object({
    name: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
});