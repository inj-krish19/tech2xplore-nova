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

/** Backs PATCH /api/users/me — caller must already have the viewer's authorid from the session. */
export async function updateProfile(authorId: bigint, input: { name?: string; bio?: string }) {
  return db.blogger.update({
    where: { authorid: authorId },
    data: input,
    select: { authorid: true, name: true, username: true, bio: true, profilepicture: true },
  });
}

/**
 * Whether this blogger has a connected LinkedIn account — gates the
 * "Post to LinkedIn" button on their own posts. Doesn't check token
 * expiry (linkedintokenexpiresat) since refreshing an expired token is a
 * server-side concern for whatever actually calls LinkedIn's API, not
 * this read.
 */
export async function hasLinkedInConnected(authorId: bigint): Promise<boolean> {
  const blogger = await db.blogger.findUnique({ where: { authorid: authorId }, select: { linkedinurn: true } });
  return Boolean(blogger?.linkedinurn);
}

/**
 * Powers the "discover people" page — every blogger except the viewer,
 * with post count / total likes received / follow status per card.
 * likesReceived sums post.likes across all of that blogger's posts —
 * a raw aggregate, not weighted by recency or anything fancier.
 */
export async function listDiscoverableUsers(viewerId: bigint | undefined, page: number, pageSize: number) {
  const where = viewerId ? { authorid: { not: viewerId } } : {};

  const [bloggers, total] = await Promise.all([
    db.blogger.findMany({
      where,
      select: {
        authorid: true,
        name: true,
        username: true,
        profilepicture: true,
        bio: true,
        post: { select: { likes: true } },
        _count: { select: { post: true } },
      },
      orderBy: { createdat: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.blogger.count({ where }),
  ]);

  const followingIds = viewerId
    ? new Set(
        (
          await db.connection.findMany({
            where: { followerid: viewerId, connectionstatus: "accepted" },
            select: { followingid: true },
          })
        ).map((c) => c.followingid.toString())
      )
    : new Set<string>();

  const items = bloggers.map((b) => ({
    authorid: b.authorid,
    name: b.name,
    username: b.username,
    profilepicture: b.profilepicture,
    bio: b.bio,
    postsCount: b._count.post,
    likesReceived: b.post.reduce((sum, p) => sum + p.likes, 0),
    isFollowing: followingIds.has(b.authorid.toString()),
  }));

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/** Everyone following this blogger — public, per the "everyone can see followers" decision. */
export async function listFollowers(authorId: bigint) {
  const connections = await db.connection.findMany({
    where: { followingid: authorId, connectionstatus: "accepted" },
    include: {
      blogger_connection_followeridToblogger: {
        select: { authorid: true, name: true, username: true, profilepicture: true, bio: true },
      },
    },
    orderBy: { createdat: "desc" },
  });
  return connections.map((c) => c.blogger_connection_followeridToblogger);
}

/** Everyone this blogger follows — public, same visibility as listFollowers. */
export async function listFollowing(authorId: bigint) {
  const connections = await db.connection.findMany({
    where: { followerid: authorId, connectionstatus: "accepted" },
    include: {
      blogger_connection_followingidToblogger: {
        select: { authorid: true, name: true, username: true, profilepicture: true, bio: true },
      },
    },
    orderBy: { createdat: "desc" },
  });
  return connections.map((c) => c.blogger_connection_followingidToblogger);
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