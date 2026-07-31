import { updatePost, deletePost } from "@/lib/services/post-service";
import { updatePostSchema } from "@/lib/validations/post";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

/** Admin override of PATCH /api/posts/[id] — skips the canEditPost ownership check the public route enforces, e.g. to archive a reported post regardless of author. */
export const PATCH = withErrorHandling<Ctx>(async (req, { params }) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();
  const input = updatePostSchema.parse(body);
  const post = await updatePost(BigInt(id), input);

  return apiSuccess({
    ...post,
    articleid: post.articleid.toString(),
    primaryauthor: post.primaryauthor.toString(),
  });
});

/** Admin takedown — skips the isPrimaryAuthor check the public route enforces. This is the "delete any post" action PostModerationTable's Delete button already calls; kept here too for a dedicated admin-only path. */
export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  await requireAdmin();
  const { id } = await params;
  await deletePost(BigInt(id));
  return apiSuccess({ deleted: true });
});