import { z } from "zod";

export const reactSchema = z.object({
  type: z.enum(["like", "dislike"]),
});
export type ReactInput = z.infer<typeof reactSchema>;