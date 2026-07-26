import { db } from "@/lib/db";

/** Every row is created "accepted" directly — no request/notification flow, per the confirmed decision. */
export async function followUser(followerId: bigint, followingId: bigint) {
  if (followerId === followingId) {
    throw new Error("Can't follow yourself");
  }

  const existing = await db.connection.findFirst({
    where: { followerid: followerId, followingid: followingId },
  });
  if (existing) return existing; // already following, no-op

  return db.connection.create({
    data: {
      followerid: followerId,
      followingid: followingId,
      connectionstatus: "accepted",
      createdat: new Date(),
    },
  });
}

export async function unfollowUser(followerId: bigint, followingId: bigint) {
  const existing = await db.connection.findFirst({
    where: { followerid: followerId, followingid: followingId },
  });
  if (!existing) return null;
  await db.connection.delete({ where: { connectionid: existing.connectionid } });
  return existing;
}

export async function listFollowers(authorId: bigint) {
  const rows = await db.connection.findMany({
    where: { followingid: authorId, connectionstatus: "accepted" },
    include: {
      blogger_connection_followeridToblogger: {
        select: { authorid: true, name: true, username: true, profilepicture: true },
      },
    },
    orderBy: { createdat: "desc" },
  });
  return rows.map((r) => r.blogger_connection_followeridToblogger);
}

export async function listFollowing(authorId: bigint) {
  const rows = await db.connection.findMany({
    where: { followerid: authorId, connectionstatus: "accepted" },
    include: {
      blogger_connection_followingidToblogger: {
        select: { authorid: true, name: true, username: true, profilepicture: true },
      },
    },
    orderBy: { createdat: "desc" },
  });
  return rows.map((r) => r.blogger_connection_followingidToblogger);
}

export async function getFollowStatus(followerId: bigint, followingId: bigint) {
  const existing = await db.connection.findFirst({
    where: { followerid: followerId, followingid: followingId },
  });
  return { following: existing !== null };
}

/**
 * "People you might follow" — based on shared categories the given
 * user posts in, excluding themselves and anyone they already follow.
 * Simple overlap count, not a real recommendation ranking.
 */
export async function getRelatedUsers(authorId: bigint, limit = 6) {
  const myCategories = await db.postcategoryassignment.findMany({
    where: { post: { primaryauthor: authorId } },
    select: { categoryid: true },
    distinct: ["categoryid"],
  });
  if (myCategories.length === 0) return [];

  const alreadyFollowing = await db.connection.findMany({
    where: { followerid: authorId },
    select: { followingid: true },
  });
  const excludeIds = [authorId, ...alreadyFollowing.map((f) => f.followingid)];

  const candidates = await db.postcategoryassignment.findMany({
    where: {
      categoryid: { in: myCategories.map((c) => c.categoryid) },
      post: { primaryauthor: { notIn: excludeIds } },
    },
    select: {
      post: {
        select: {
          blogger: { select: { authorid: true, name: true, username: true, profilepicture: true } },
        },
      },
    },
    take: limit * 4,
  });

  const seen = new Set<string>();
  const users = [];
  for (const c of candidates) {
    const key = c.post.blogger.authorid.toString();
    if (seen.has(key)) continue;
    seen.add(key);
    users.push(c.post.blogger);
    if (users.length >= limit) break;
  }
  return users;
}