import { z } from "zod";

export const setAvatarSchema = z.object({
  url: z.url(),
});
export type SetAvatarInput = z.infer<typeof setAvatarSchema>;