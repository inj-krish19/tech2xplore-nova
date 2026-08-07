import { deleteOrgPost } from "@/lib/services/orgpost-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  await requireAdmin();
  const { id } = await params;
  await deleteOrgPost(BigInt(id));
  return apiSuccess({ deleted: true });
});