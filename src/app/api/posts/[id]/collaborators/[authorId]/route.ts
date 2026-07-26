import { removeCollaborator } from "@/lib/services/collaboration-service";
import { isPrimaryAuthor } from "@/lib/services/post-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession, ForbiddenError } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string; authorId: string }> };

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id, authorId } = await params;
  const articleId = BigInt(id);
  const session = await requireSession();

  const allowed = await isPrimaryAuthor(articleId, BigInt(session.user.id));
  if (!allowed) throw new ForbiddenError("Only the primary author can remove collaborators");

  const removed = await removeCollaborator(articleId, BigInt(authorId));
  if (!removed) return apiError("That collaborator wasn't found on this post", 404);

  return apiSuccess({ removed: true });
});