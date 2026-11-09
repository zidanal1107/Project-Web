import { z } from "zod";
import { emptyToUndefined, paginationSchema } from "./common";

export const departmentQuerySchema = paginationSchema.extend({
    name: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
});