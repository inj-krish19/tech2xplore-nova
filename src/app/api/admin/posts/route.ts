import { listPosts } from "@/lib/services/post-service";
import { listPostsQuerySchema } from "@/lib/validations/post";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

/**
 * Reuses the public listPosts() query shape and service function — the
 * only differences from GET /api/posts are the requireAdmin() gate and
 * that no status filter is forced, so drafts/archived posts show up
 * here too when the `status` query param is omitted.
 */
export const GET = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const query = listPostsQuerySchema.parse(Object.fromEntries(searchParams));
  const result = await listPosts(query);

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