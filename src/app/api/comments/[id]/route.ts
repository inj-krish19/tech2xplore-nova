import { updateComment, deleteComment } from "@/lib/services/comment-service";
import { updateCommentSchema } from "@/lib/validations/comment";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowlist.includes(email.toLowerCase());
}

export const PATCH = withErrorHandling<Ctx>(async (req, { params }) => {
  const { id } = await params;
  const session = await requireSession();
  const body = await req.json();
  const { comment: newText } = updateCommentSchema.parse(body);

  const updated = await updateComment(BigInt(id), BigInt(session.user.id), newText);
  if (!updated) return apiError("Comment not found", 404);

  return apiSuccess({ ...updated, postcommentid: updated.postcommentid.toString(), articleid: updated.articleid.toString(), authorid: updated.authorid.toString() });
});

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const session = await requireSession();
  const isAdmin = isAdminEmail(session.user.email);

  const result = await deleteComment(BigInt(id), BigInt(session.user.id), isAdmin);

  if (result.status === "not_found") return apiError("Comment not found", 404);
  if (result.status === "has_replies") {
    return apiError("This comment has replies and can't be deleted", 409);
  }
  return apiSuccess({ deleted: true });
});