import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z.string().min(1).max(255),
  communitydescription: z.string().min(1).max(1000),
  communityicon: z.url().max(255).optional(),
});
export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;

export const updateCommunitySchema = createCommunitySchema.partial();
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;

export const listCommunitiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

export const adminListCommunitiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().max(255).optional(),
});
export type AdminListCommunitiesQuery = z.infer<typeof adminListCommunitiesQuerySchema>;