import { reactToPost, removeReaction } from "@/lib/services/reaction-service";
import { reactSchema } from "@/lib/validations/reaction";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export const POST = withErrorHandling<Ctx>(async (req, { params }) => {
  const { id } = await params;
  const session = await requireSession();
  const body = await req.json();
  const { type } = reactSchema.parse(body);

  const counts = await reactToPost(BigInt(session.user.id), BigInt(id), type);
  return apiSuccess(counts);
});

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const session = await requireSession();

  const counts = await removeReaction(BigInt(session.user.id), BigInt(id));
  return apiSuccess(counts);
});