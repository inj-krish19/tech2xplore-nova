import {
  getPostById,
  updatePost,
  deletePost,
  isPrimaryAuthor,
  canEditPost,
} from "@/lib/services/post-service";
import { updatePostSchema } from "@/lib/validations/post";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession, ForbiddenError } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const post = await getPostById(BigInt(id));
  if (!post) return apiError("Post not found", 404);

  return apiSuccess({
    ...post,
    articleid: post.articleid.toString(),
    primaryauthor: post.primaryauthor.toString(),
    blogger: { ...post.blogger, authorid: post.blogger.authorid.toString() },
  });
});

export const PATCH = withErrorHandling<Ctx>(async (req, { params }) => {
  const { id } = await params;
  const articleId = BigInt(id);
  const session = await requireSession();

  const allowed = await canEditPost(articleId, BigInt(session.user.id));
  if (!allowed) throw new ForbiddenError("You don't have edit access to this post");

  const body = await req.json();
  const input = updatePostSchema.parse(body);
  const post = await updatePost(articleId, input);

  return apiSuccess({ ...post, articleid: post.articleid.toString(), primaryauthor: post.primaryauthor.toString() });
});

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const articleId = BigInt(id);
  const session = await requireSession();

  // Assumption, not yet confirmed: primary-author-only delete. See
  // API_ENDPOINTS.md's flagged open item.
  const allowed = await isPrimaryAuthor(articleId, BigInt(session.user.id));
  if (!allowed) throw new ForbiddenError("Only the primary author can delete this post");

  await deletePost(articleId);
  return apiSuccess({ deleted: true });
});