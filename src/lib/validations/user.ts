import { z } from "zod";

/** Bounds match blogger.name (VarChar(30)) and blogger.bio (VarChar(250)) in schema.prisma. */
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(30).optional(),
  bio: z.string().trim().max(250).optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const adminListUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().max(255).optional(),
});
export type AdminListUsersQuery = z.infer<typeof adminListUsersQuerySchema>;

/** Matches blogger_status_enum in schema.prisma (active/inactive/banned). */
export const setBloggerStatusSchema = z.object({
  status: z.enum(["active", "inactive", "banned"]),
});
export type SetBloggerStatusInput = z.infer<typeof setBloggerStatusSchema>;