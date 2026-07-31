import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  categorydescription: z.string().min(1).max(1000),
  categoryicon: z.url().max(255).optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const listCategoryPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

export const adminListCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().max(255).optional(),
});
export type AdminListCategoriesQuery = z.infer<typeof adminListCategoriesQuerySchema>;