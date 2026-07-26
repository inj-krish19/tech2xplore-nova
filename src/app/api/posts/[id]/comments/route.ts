import { listCommentsForPost, createComment } from "@/lib/services/comment-service";
import { createCommentSchema } from "@/lib/validations/comment";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const comments = await listCommentsForPost(BigInt(id));
  return apiSuccess(comments);
});

export const POST = withErrorHandling<Ctx>(async (req, { params }) => {
  const { id } = await params;
  const session = await requireSession();
  const body = await req.json();
  const input = createCommentSchema.parse({ ...body, articleid: id });

  const comment = await createComment(BigInt(session.user.id), input);
  return apiSuccess(
    { ...comment, postcommentid: comment.postcommentid.toString(), articleid: comment.articleid.toString(), authorid: comment.authorid.toString() },
    201
  );
});