import { getAvatarOptions } from "@/lib/services/avatar-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const options = await getAvatarOptions(BigInt(session.user.id));
  return apiSuccess(options);
});