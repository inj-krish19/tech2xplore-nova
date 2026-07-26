import { getRelatedPosts } from "@/lib/services/post-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const related = await getRelatedPosts(BigInt(id));

  return apiSuccess(
    related.map((p) => ({
      ...p,
      articleid: p.articleid.toString(),
      primaryauthor: p.primaryauthor.toString(),
      blogger: { ...p.blogger, authorid: p.blogger.authorid.toString() },
    }))
  );
});