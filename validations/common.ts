import { z } from "zod";

export const emptyToUndefined = (v: unknown) =>
    typeof v === "string" && v.trim() === "" ? undefined : v;

export const idParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "id harus angka"),
});

export const paginationSchema = z.object({
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).default(1)),
  limit: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(50).default(10)
  ),
});