import { deleteKeyword } from "@/lib/services/keyword-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  await requireAdmin();
  const { id } = await params;
  const result = await deleteKeyword(BigInt(id));

  if (result.status === "in_use") {
    return apiError(`Keyword is still used by ${result.postCount} post(s)`, 409, result);
  }
  return apiSuccess({ deleted: true });
});