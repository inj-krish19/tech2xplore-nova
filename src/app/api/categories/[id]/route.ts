import { getCategoryById } from "@/lib/services/category-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";

export const GET = withErrorHandling<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const { id } = await params;
  const category = await getCategoryById(BigInt(id));
  if (!category) return apiError("Category not found", 404);
  return apiSuccess({ ...category, categoryid: category.categoryid.toString(), createdby: category.createdby.toString() });
});