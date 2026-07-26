import { listCategories, createCategory } from "@/lib/services/category-service";
import { createCategorySchema } from "@/lib/validations/category";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = withErrorHandling(async () => {
  const categories = await listCategories();
  return apiSuccess(
    categories.map((c) => ({ ...c, categoryid: c.categoryid.toString(), createdby: c.createdby.toString() }))
  );
});

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireAdmin(); // category taxonomy is admin-managed
  const body = await req.json();
  const input = createCategorySchema.parse(body);
  const category = await createCategory(BigInt(session.user.id), input);
  return apiSuccess({ ...category, categoryid: category.categoryid.toString(), createdby: category.createdby.toString() }, 201);
});