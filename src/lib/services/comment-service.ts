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
  deleted: boolean;
}

function buildTree(
  flat: {
    postcommentid: bigint;
    comment: string;
    createdat: Date;
    parentcommentid: bigint | null;
    authorid: bigint;
    deletedat: Date | null;
    blogger: { username: string; name: string; profilepicture: string | null };
  }[]
): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const c of flat) {
    byId.set(c.postcommentid.toString(), {
      id: c.postcommentid.toString(),
      // Text is masked here, server-side, not left to the frontend to
      // hide — a deleted comment's real text never leaves this function.
      comment: c.deletedat ? "[deleted]" : c.comment,
      createdAt: c.createdat.toISOString(),
      authorId: c.authorid.toString(),
      author: c.blogger,
      replies: [],
      deleted: c.deletedat !== null,
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
      deletedat: true,
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
  if (existing.deletedat) {
    throw new ForbiddenError("Can't edit a deleted comment");
  }
  return db.postcomment.update({
    where: { postcommentid: commentId },
    data: { comment: newText },
  });
}

/**
 * Soft-delete: sets deletedat and masks the text going forward
 * (buildTree above renders it as "[deleted]"), but keeps the row —
 * `postcomment`'s self-referencing FK is onDelete: NoAction, so a hard
 * delete would still fail if the comment has replies. Soft-delete
 * sidesteps that FK constraint entirely rather than working around it,
 * which is why the old has_replies block this replaced no longer
 * exists — there's nothing left to block.
 *
 * commentscount is decremented once, guarded by the deletedat check
 * above (deleteComment on an already-deleted comment is a no-op, not a
 * double-decrement).
 */
export async function deleteComment(commentId: bigint, requesterId: bigint, isAdmin: boolean) {
  const existing = await db.postcomment.findUnique({ where: { postcommentid: commentId } });
  if (!existing) return { status: "not_found" as const };
  if (existing.authorid !== requesterId && !isAdmin) {
    throw new ForbiddenError("You can only delete your own comment");
  }
  if (existing.deletedat) {
    return { status: "already_deleted" as const };
  }

  await db.postcomment.update({
    where: { postcommentid: commentId },
    data: { deletedat: new Date() },
  });
  await db.post.update({
    where: { articleid: existing.articleid },
    data: { commentscount: { decrement: 1 } },
  });
  return { status: "deleted" as const };
}