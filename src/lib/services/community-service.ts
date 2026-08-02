import { db } from "@/lib/db";
import type { CreateCommunityInput, UpdateCommunityInput } from "@/lib/validations/community";

export async function listCommunities(page: number, pageSize: number) {
  const [items, total] = await Promise.all([
    db.community.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdat: "desc" },
      include: { _count: { select: { membership: true } } },
    }),
    db.community.count(),
  ]);
  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function createCommunity(creatorId: bigint, input: CreateCommunityInput) {
  const community = await db.community.create({
    data: { ...input, createdby: creatorId },
  });
  // Creator automatically joins as admin of their own community.
  await db.membership.create({
    data: {
      authorid: creatorId,
      communityid: community.communityid,
      membershiprole: "admin",
      joinedat: new Date(),
    },
  });
  return community;
}

export async function getCommunityById(communityId: bigint) {
  return db.community.findUnique({
    where: { communityid: communityId },
    include: { _count: { select: { membership: true } } },
  });
}

export async function updateCommunity(communityId: bigint, input: UpdateCommunityInput) {
  return db.community.update({ where: { communityid: communityId }, data: input });
}

export async function isCommunityAdmin(communityId: bigint, authorId: bigint) {
  const membership = await db.membership.findFirst({
    where: { communityid: communityId, authorid: authorId },
  });
  return membership?.membershiprole === "admin";
}

export async function joinCommunity(authorId: bigint, communityId: bigint) {
  const existing = await db.membership.findFirst({ where: { authorid: authorId, communityid: communityId } });
  if (existing) return existing; // already a member, no-op

  return db.membership.create({
    data: { authorid: authorId, communityid: communityId, membershiprole: "member", joinedat: new Date() },
  });
}

export async function leaveCommunity(authorId: bigint, communityId: bigint) {
  const existing = await db.membership.findFirst({ where: { authorid: authorId, communityid: communityId } });
  if (!existing) return null;
  await db.membership.delete({ where: { membershipid: existing.membershipid } });
  return existing;
}

export async function listCommunityMembers(communityId: bigint) {
  return db.membership.findMany({
    where: { communityid: communityId },
    include: { blogger: { select: { authorid: true, name: true, username: true, profilepicture: true } } },
    orderBy: { joinedat: "asc" },
  });
}

/** Admin panel listing — paginated, optional name search, on top of the existing member-count include. */
export async function adminListCommunities(page: number, pageSize: number, search?: string) {
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {};

  const [items, total] = await Promise.all([
    db.community.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdat: "desc" },
      include: { _count: { select: { membership: true } } },
    }),
    db.community.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/**
 * Admin takedown. Assumption (flagging, not confirmed): blocks with an
 * `in_use` status if the community still has members, same pattern as
 * category/keyword deletion, rather than cascade-deleting memberships.
 * If you'd rather admin takedown force-remove members too, say so and
 * this becomes a `$transaction` that clears `membership` rows first.
 */
export async function deleteCommunity(
  communityId: bigint
): Promise<{ status: "deleted" } | { status: "in_use"; memberCount: number }> {
  const memberCount = await db.membership.count({ where: { communityid: communityId } });
  if (memberCount > 0) return { status: "in_use", memberCount };

  await db.community.delete({ where: { communityid: communityId } });
  return { status: "deleted" };
}
/**
 * Public community search — name/description match. Same output shape
 * as listCommunities (includes _count.membership) so the search page's
 * community results can reuse the communities page's card markup.
 */
export async function searchCommunities(query: string, page: number, pageSize: number) {
  const where = {
    OR: [
      { name: { contains: query, mode: "insensitive" as const } },
      { communitydescription: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const [items, total] = await Promise.all([
    db.community.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdat: "desc" },
      include: { _count: { select: { membership: true } } },
    }),
    db.community.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}