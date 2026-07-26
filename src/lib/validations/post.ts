import { z } from "zod";

export const postStatusSchema = z.enum(["draft", "published", "archived"]);

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Content is required").max(3000),
  poststatus: postStatusSchema.default("draft"),
  categoryIds: z.array(z.string()).optional(), // -> postcategoryassignment, many-to-many
  keywordIds: z.array(z.string()).optional(), // -> keywordassignment, optional per post
});
export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial();
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const listPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  status: postStatusSchema.optional(),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().max(255).optional(),
});
export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;

/**
 * NOTE: the `post` model has no `slug` column — only `articleid`
 * (BigInt) and `title`. Routes are written to look up by articleid for
 * now (`/post/[id]`, not `/post/[slug]`). Adding a slug column is a
 * schema change, so flagging rather than doing it — say the word and
 * I'll add it in the next migration pass alongside anything else
 * pending.
 */