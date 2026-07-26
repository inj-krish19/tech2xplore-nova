import { listCollaborators, addCollaborator } from "@/lib/services/collaboration-service";
import { isPrimaryAuthor } from "@/lib/services/post-service";
import { addCollaboratorSchema } from "@/lib/validations/collaboration";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession, ForbiddenError } from "@/lib/auth-guard";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const collaborators = await listCollaborators(BigInt(id));
  return apiSuccess(
    collaborators.map((c) => ({
      ...c,
      collaborationid: c.collaborationid.toString(),
      articleid: c.articleid.toString(),
      authorid: c.authorid.toString(),
      blogger: { ...c.blogger, authorid: c.blogger.authorid.toString() },
    }))
  );
});

export const POST = withErrorHandling<Ctx>(async (req, { params }) => {
  const { id } = await params;
  const articleId = BigInt(id);
  const session = await requireSession();

  const allowed = await isPrimaryAuthor(articleId, BigInt(session.user.id));
  if (!allowed) throw new ForbiddenError("Only the primary author can add collaborators");

  const body = await req.json();
  const { username, role } = addCollaboratorSchema.parse(body);

  const target = await db.blogger.findUnique({ where: { username }, select: { authorid: true } });
  if (!target) return apiError("User not found", 404);

  const collab = await addCollaborator(articleId, target.authorid, role);
  return apiSuccess(
    { ...collab, collaborationid: collab.collaborationid.toString(), articleid: collab.articleid.toString(), authorid: collab.authorid.toString() },
    201
  );
});