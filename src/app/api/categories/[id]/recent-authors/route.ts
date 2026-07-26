import { recentAuthorsByCategory } from "@/lib/services/category-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";

export const GET = withErrorHandling<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const { id } = await params;
  const authors = await recentAuthorsByCategory(BigInt(id));
  return apiSuccess(authors.map((a) => ({ ...a, authorid: a.authorid.toString() })));
});