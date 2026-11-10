import { z } from "zod";
import { emptyToUndefined, paginationSchema } from "./common";

export const memberQuerySchema = paginationSchema.extend({
  search: z.preprocess(emptyToUndefined, z.string().trim().max(150).optional()),
});