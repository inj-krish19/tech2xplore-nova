import { z } from "zod";

export const createCommentSchema = z.object({
  articleid: z.string(), // BigInt-as-string over the wire
  comment: z.string().min(1, "Comment can't be empty").max(750),
  parentcommentid: z.string().optional(), // present -> this is a reply
});
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  comment: z.string().min(1).max(750),
});
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

export const listCommentsQuerySchema = z.object({
  articleid: z.string(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});
export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;