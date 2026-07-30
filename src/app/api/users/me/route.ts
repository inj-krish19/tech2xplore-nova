import { updateProfile, getBloggerByUsername } from "@/lib/services/user-service";
import { updateProfileSchema } from "@/lib/validations/user";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const username = (session.user as { username?: string }).username;
  if (!username) return apiError("Session has no username", 400);

  const blogger = await getBloggerByUsername(username);
  if (!blogger) return apiError("Blogger not found", 404);

  return apiSuccess({ ...blogger, authorid: blogger.authorid.toString() });
});

export const PATCH = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = updateProfileSchema.parse(body);

  const updated = await updateProfile(BigInt(session.user.id), input);
  return apiSuccess({ ...updated, authorid: updated.authorid.toString() });
});