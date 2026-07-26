import { followUser, unfollowUser } from "@/lib/services/connection-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ username: string }> };

async function resolveTarget(username: string) {
  return db.blogger.findUnique({ where: { username }, select: { authorid: true } });
}

export const POST = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { username } = await params;
  const session = await requireSession();

  const target = await resolveTarget(username);
  if (!target) return apiError("User not found", 404);

  try {
    const connection = await followUser(BigInt(session.user.id), target.authorid);
    return apiSuccess({ ...connection, connectionid: connection.connectionid.toString(), followerid: connection.followerid.toString(), followingid: connection.followingid.toString() }, 201);
  } catch (err) {
    if (err instanceof Error && err.message === "Can't follow yourself") {
      return apiError(err.message, 400);
    }
    throw err;
  }
});

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { username } = await params;
  const session = await requireSession();

  const target = await resolveTarget(username);
  if (!target) return apiError("User not found", 404);

  await unfollowUser(BigInt(session.user.id), target.authorid);
  return apiSuccess({ unfollowed: true });
});