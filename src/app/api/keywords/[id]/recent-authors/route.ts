import { recentAuthorsByKeyword } from "@/lib/services/keyword-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";

export const GET = withErrorHandling<{ params: Promise<{ id: string }> }>(async (_req, { params }) => {
  const { id } = await params;
  const authors = await recentAuthorsByKeyword(BigInt(id));
  return apiSuccess(authors.map((a) => ({ ...a, authorid: a.authorid.toString() })));
});