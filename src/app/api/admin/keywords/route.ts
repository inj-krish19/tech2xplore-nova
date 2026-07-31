import { adminListKeywords } from "@/lib/services/keyword-service";
import { adminListKeywordsQuerySchema } from "@/lib/validations/keyword";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const query = adminListKeywordsQuerySchema.parse(Object.fromEntries(searchParams));
  const result = await adminListKeywords(query.page, query.pageSize, query.search);

  return apiSuccess({
    ...result,
    items: result.items.map((k) => {
      const { _count, ...rest } = k;
      return {
        ...rest,
        keywordid: rest.keywordid.toString(),
        postCount: _count.keywordassignment,
      };
    }),
  });
});