import { getKeywordById } from "@/lib/services/keyword-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";

export const GET = withErrorHandling<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const { id } = await params;
  const keyword = await getKeywordById(BigInt(id));
  if (!keyword) return apiError("Keyword not found", 404);
  return apiSuccess({ ...keyword, keywordid: keyword.keywordid.toString() });
});