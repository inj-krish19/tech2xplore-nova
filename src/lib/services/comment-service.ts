import { db } from "@/lib/db";
import { ForbiddenError } from "@/lib/auth-guard";
import type { CreateCommentInput } from "@/lib/validations/comment";

export interface CommentNode {
  id: string;
  comment: string;
  createdAt: string;
  authorId: string;
  author: { username: string; name: string; profilepicture: string | null };
  replies: CommentNode[];
}

function buildTree(
  flat: {
    postcommentid: bigint;
    comment: string;
    createdat: Date;
    parentcommentid: bigint | null;
    authorid: bigint;
    blogger: { username: string; name: string; profilepicture: string | null };
  }[]
): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const c of flat) {
    byId.set(c.postcommentid.toString(), {
      id: c.postcommentid.toString(),
      comment: c.comment,
      createdAt: c.createdat.toISOString(),
      authorId: c.authorid.toString(),
      author: c.blogger,
      replies: [],
    });
  }
  for (const c of flat) {
    const node = byId.get(c.postcommentid.toString())!;
    if (c.parentcommentid) {
      byId.get(c.parentcommentid.toString())?.replies.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export async function listCommentsForPost(articleId: bigint): Promise<CommentNode[]> {
  const flat = await db.postcomment.findMany({
    where: { articleid: articleId },
    orderBy: { createdat: "asc" },
    select: {
      postcommentid: true,
      comment: true,
      createdat: true,
      parentcommentid: true,
      authorid: true,
      blogger: { select: { username: true, name: true, profilepicture: true } },
    },
  });
  return buildTree(flat);
}

export async function createComment(authorId: bigint, input: CreateCommentInput) {
  const articleId = BigInt(input.articleid);
  const parentId = input.parentcommentid ? BigInt(input.parentcommentid) : null;

  const comment = await db.postcomment.create({
    data: {
      articleid: articleId,
      authorid: authorId,
      comment: input.comment,
      parentcommentid: parentId,
      commenttype: parentId ? "reply" : "comment",
      createdat: new Date(),
    },
  });

  await db.post.update({
    where: { articleid: articleId },
    data: { commentscount: { increment: 1 } },
  });

  return comment;
}

export async function updateComment(commentId: bigint, requesterId: bigint, newText: string) {
  const existing = await db.postcomment.findUnique({ where: { postcommentid: commentId } });
  if (!existing) return null;
  if (existing.authorid !== requesterId) {
    throw new ForbiddenError("You can only edit your own comment");
  }
  return db.postcomment.update({
    where: { postcommentid: commentId },
    data: { comment: newText },
  });
}

/**
 * `postcomment`'s self-referencing FK is onDelete: NoAction — deleting a
 * comment that has replies will fail at the DB level. Rather than let
 * that surface as a raw 500, block it up front with a clear message.
 * A real "soft delete" (mark text as [deleted], keep the row) would
 * avoid this entirely but that's a schema addition — not doing that
 * without the production-team sign-off the standing instruction asks for.
 */
export async function deleteComment(commentId: bigint, requesterId: bigint, isAdmin: boolean) {
  const existing = await db.postcomment.findUnique({
    where: { postcommentid: commentId },
    include: { other_postcomment: { select: { postcommentid: true } } },
  });
  if (!existing) return { status: "not_found" as const };
  if (existing.authorid !== requesterId && !isAdmin) {
    throw new ForbiddenError("You can only delete your own comment");
  }
  if (existing.other_postcomment.length > 0) {
    return { status: "has_replies" as const };
  }

  await db.postcomment.delete({ where: { postcommentid: commentId } });
  await db.post.update({
    where: { articleid: existing.articleid },
    data: { commentscount: { decrement: 1 } },
  });
  return { status: "deleted" as const };
}