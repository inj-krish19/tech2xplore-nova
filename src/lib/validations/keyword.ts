import { z } from "zod";

export const createKeywordSchema = z.object({
  name: z.string().min(1).max(255),
  keyworddescription: z.string().min(1).max(1000),
  keywordicon: z.url().max(255),
});
export type CreateKeywordInput = z.infer<typeof createKeywordSchema>;

export const listKeywordPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});