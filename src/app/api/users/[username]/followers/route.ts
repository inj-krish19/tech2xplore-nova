import { listFollowers } from "@/lib/services/connection-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ username: string }> };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { username } = await params;
  const target = await db.blogger.findUnique({ where: { username }, select: { authorid: true } });
  if (!target) return apiError("User not found", 404);

  const followers = await listFollowers(target.authorid);
  return apiSuccess(followers.map((f) => ({ ...f, authorid: f.authorid.toString() })));
});