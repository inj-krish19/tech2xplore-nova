import { adminListCategories } from "@/lib/services/category-service";
import { adminListCategoriesQuerySchema } from "@/lib/validations/category";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const query = adminListCategoriesQuerySchema.parse(Object.fromEntries(searchParams));
  const result = await adminListCategories(query.page, query.pageSize, query.search);

  return apiSuccess({
    ...result,
    items: result.items.map((c) => {
      const { _count, ...rest } = c;
      return {
        ...rest,
        categoryid: rest.categoryid.toString(),
        createdby: rest.createdby.toString(),
        postCount: _count.postcategoryassignment,
      };
    }),
  });
});