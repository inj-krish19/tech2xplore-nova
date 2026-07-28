import { db } from "@/lib/db";

/**
 * Depends on the `shares` column added to `post` per
 * prisma/SCHEMA_CHANGES_share_count.md — run that migration before this
 * function is called, or the increment will fail against a column that
 * doesn't exist yet.
 *
 * Unlike reactToPost, there's no per-user uniqueness question here — every
 * share click counts, since there's nothing to "unshare." Straight
 * increment, no findFirst-then-write race to worry about.
 */
export async function recordShare(articleId: bigint, baseUrl: string) {
  const post = await db.post.update({
    where: { articleid: articleId },
    data: { shares: { increment: 1 } },
    select: { shares: true },
  });

  return { url: `${baseUrl}/post/${articleId}`, shares: post.shares };
}