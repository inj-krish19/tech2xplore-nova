import { getFollowStatus } from "@/lib/services/connection-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";
import { db } from "@/lib/db";

export const GET = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username) return apiError("username query param is required", 400);

  const target = await db.blogger.findUnique({ where: { username }, select: { authorid: true } });
  if (!target) return apiError("User not found", 404);

  const status = await getFollowStatus(BigInt(session.user.id), target.authorid);
  return apiSuccess(status);
});