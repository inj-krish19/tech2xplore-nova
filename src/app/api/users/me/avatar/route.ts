import { setAvatar } from "@/lib/services/avatar-service";
import { setAvatarSchema } from "@/lib/validations/avatar";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

export const PATCH = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const { url } = setAvatarSchema.parse(body);

  try {
    const updated = await setAvatar(BigInt(session.user.id), url);
    return apiSuccess({ ...updated, authorid: updated.authorid.toString() });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_AVATAR_URL") {
      return apiError("That's not one of the available avatar options", 400);
    }
    throw err;
  }
});