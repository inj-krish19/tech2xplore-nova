import { z } from "zod";

export const addCollaboratorSchema = z.object({
  username: z.string().min(1),
  role: z.enum(["author", "editor", "contributor"]).default("contributor"),
});
export type AddCollaboratorInput = z.infer<typeof addCollaboratorSchema>;