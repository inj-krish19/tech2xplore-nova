import { listPostsByCategory } from "@/lib/services/category-service";
import { listCategoryPostsQuerySchema } from "@/lib/validations/category";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";

export const GET = withErrorHandling<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const { page, pageSize } = listCategoryPostsQuerySchema.parse(Object.fromEntries(searchParams));

  const result = await listPostsByCategory(BigInt(id), page, pageSize);
  return apiSuccess({
    ...result,
    items: result.items.map((p) => ({
      ...p,
      articleid: p.articleid.toString(),
      primaryauthor: p.primaryauthor.toString(),
      blogger: { ...p.blogger, authorid: p.blogger.authorid.toString() },
    })),
  });
});