import { db } from "@/lib/db";

export type ReactionType = "like" | "dislike";

/**
 * `postinteraction` has no unique constraint on (articleid, authorid) —
 * nothing in the DB itself stops a user from reacting twice. Uniqueness
 * is enforced here at the app layer instead (find-then-write). Under
 * true concurrent double-clicks this has a small race window; a real
 * fix is a DB unique constraint, which needs the production-team
 * sign-off the standing instruction requires — not added here.
 *
 * Also intentionally NOT wrapped in db.$transaction — batch/interactive
 * transactions have already caused "unable to start a transaction"
 * failures on this project's pooled connection (see the earlier
 * listPosts fix). Sequential calls avoid that at the cost of a
 * theoretical inconsistency window between the interaction write and
 * the post counter update.
 */
export async function reactToPost(authorId: bigint, articleId: bigint, type: ReactionType) {
  const existing = await db.postinteraction.findFirst({
    where: { articleid: articleId, authorid: authorId },
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
  const existing = await db.postinteraction.findFirst({
    where: { articleid: articleId, authorid: authorId },
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