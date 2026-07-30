import { z } from "zod";

/** Bounds match blogger.name (VarChar(30)) and blogger.bio (VarChar(250)) in schema.prisma. */
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(30).optional(),
  bio: z.string().trim().max(250).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;