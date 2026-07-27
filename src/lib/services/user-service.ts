import { db } from "@/lib/db";

const BLOGGER_CARD_SELECT = {
  authorid: true,
  name: true,
  username: true,
  profilepicture: true,
} as const;

export async function getBloggerByUsername(username: string) {
  return db.blogger.findUnique({
    where: { username },
    select: { authorid: true, name: true, username: true, profilepicture: true, bio: true },
  });
}

/**
 * Follow lives on the `connection` model, not a dedicated follow table —
 * followerid/followingid + connectionstatus enum (pending/accepted/rejected).
 * README §7 describes follow as instant/Instagram-style with no request
 * step, so this always writes connectionstatus: "accepted" directly and
 * never touches "pending" — if a request/approval flow gets added later,
 * this is the function that needs to change.
 */
export async function getProfileByUsername(username: string, viewerId?: bigint) {
  const blogger = await getBloggerByUsername(username);
  if (!blogger) return null;

  const [followersCount, isFollowing] = await Promise.all([
    db.connection.count({
      where: { followingid: blogger.authorid, connectionstatus: "accepted" },
    }),
    viewerId
      ? db.connection
          .findFirst({
            where: { followerid: viewerId, followingid: blogger.authorid, connectionstatus: "accepted" },
          })
          .then(Boolean)
      : Promise.resolve(false),
  ]);

  return {
    ...blogger,
    followersCount,
    isFollowing,
    isOwnProfile: viewerId === blogger.authorid,
  };
}

/** Toggles follow state — caller must already have the viewer's authorid from the session. */
export async function toggleFollow(followerId: bigint, targetUsername: string) {
  const target = await db.blogger.findUnique({ where: { username: targetUsername }, select: { authorid: true } });
  if (!target) throw new Error("Blogger not found");

  const existing = await db.connection.findFirst({
    where: { followerid: followerId, followingid: target.authorid },
  });

  if (existing) {
    await db.connection.delete({ where: { connectionid: existing.connectionid } });
  } else {
    await db.connection.create({
      data: {
        followerid: followerId,
        followingid: target.authorid,
        connectionstatus: "accepted",
        createdat: new Date(),
      },
    });
  }

  const followersCount = await db.connection.count({
    where: { followingid: target.authorid, connectionstatus: "accepted" },
  });
  return { following: !existing, followersCount };
}

/**
 * "People you might follow" — recently active bloggers excluding the
 * profile owner and anyone the viewer already follows. No relevance
 * ranking (shared categories/keywords) yet — just recency, same caveat as
 * getRelatedPosts in post-service.ts.
 */
export async function listRelatedUsers(username: string, viewerId: bigint | undefined, limit = 6) {
  const target = await db.blogger.findUnique({ where: { username }, select: { authorid: true } });
  if (!target) return [];

  const alreadyFollowing = viewerId
    ? await db.connection.findMany({
        where: { followerid: viewerId, connectionstatus: "accepted" },
        select: { followingid: true },
      })
    : [];
  const excludeIds = [target.authorid, ...alreadyFollowing.map((c) => c.followingid)];

  return db.blogger.findMany({
    where: { authorid: { notIn: excludeIds } },
    select: BLOGGER_CARD_SELECT,
    orderBy: { createdat: "desc" },
    take: limit,
  });
}