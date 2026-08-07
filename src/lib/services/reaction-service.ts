import { db } from "@/lib/db";

export type ReactionType = "like" | "dislike";

/**
 * `postinteraction` now has a real DB unique constraint on
 * (articleid, authorid) — findFirst()-then-write is replaced with
 * findUnique() against that constraint's compound key
 * (articleid_authorid, Prisma's default name for it), closing the small
 * race window a concurrent double-click could hit before. The
 * migration that added it also deduped any rows the old race window may
 * have already produced — see migrate-reactions-comments.sql.
 *
 * Still intentionally NOT wrapped in db.$transaction — batch/interactive
 * transactions have already caused "unable to start a transaction"
 * failures on this project's pooled connection (see the earlier
 * listPosts fix). Sequential calls avoid that at the cost of a
 * theoretical inconsistency window between the interaction write and
 * the post counter update — smaller and different from the race this
 * migration closes, and not fixed by it.
 */
export async function reactToPost(authorId: bigint, articleId: bigint, type: ReactionType) {
  const existing = await db.postinteraction.findUnique({
    where: { articleid_authorid: { articleid: articleId, authorid: authorId } },
  });

  if (existing && existing.reactiontype === type) {
    // Already reacted this way — no-op, return current post counts.
    return db.post.findUnique({
      where: { articleid: articleId },
      select: { likes: true, dislikes: true },
    });
  }

  if (existing) {
    // Switching like <-> dislike: update the row, shift both counters.
    await db.postinteraction.update({
      where: { postreactionid: existing.postreactionid },
      data: { reactiontype: type },
    });
    const oldField = existing.reactiontype === "like" ? "likes" : "dislikes";
    const newField = type === "like" ? "likes" : "dislikes";
    await db.post.update({
      where: { articleid: articleId },
      data: { [oldField]: { decrement: 1 }, [newField]: { increment: 1 } },
    });
  } else {
    await db.postinteraction.create({
      data: { articleid: articleId, authorid: authorId, reactiontype: type, createdat: new Date() },
    });
    const field = type === "like" ? "likes" : "dislikes";
    await db.post.update({
      where: { articleid: articleId },
      data: { [field]: { increment: 1 } },
    });
  }

  return db.post.findUnique({
    where: { articleid: articleId },
    select: { likes: true, dislikes: true },
  });
}

export async function removeReaction(authorId: bigint, articleId: bigint) {
  const existing = await db.postinteraction.findUnique({
    where: { articleid_authorid: { articleid: articleId, authorid: authorId } },
  });
  if (!existing) {
    return db.post.findUnique({ where: { articleid: articleId }, select: { likes: true, dislikes: true } });
  }

  await db.postinteraction.delete({ where: { postreactionid: existing.postreactionid } });
  const field = existing.reactiontype === "like" ? "likes" : "dislikes";
  await db.post.update({
    where: { articleid: articleId },
    data: { [field]: { decrement: 1 } },
  });

  return db.post.findUnique({ where: { articleid: articleId }, select: { likes: true, dislikes: true } });
}

/**
 * ADDED — not in your original file. The post detail page needs to know
 * the viewer's existing reaction on first render (to highlight the right
 * button), and nothing in reactToPost/removeReaction exposes that read on
 * its own. Pure read, no counter interaction — safe to add alongside the
 * two functions above.
 */
export async function getUserReaction(authorId: bigint, articleId: bigint): Promise<ReactionType | null> {
  const existing = await db.postinteraction.findUnique({
    where: { articleid_authorid: { articleid: articleId, authorid: authorId } },
    select: { reactiontype: true },
  });
  return existing?.reactiontype ?? null;
}