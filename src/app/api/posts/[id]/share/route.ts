import { getPostById } from "@/lib/services/post-service";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

/**
 * No DB write here — just resolves and returns the canonical post URL
 * for the frontend to hand to the Web Share API or copy to clipboard.
 * Confirms the post exists and is published so nothing draft/private
 * gets a shareable link handed out. If share counts end up wanted
 * later, this is the route that'd need a write added to it.
 */
export const POST = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const post = await getPostById(BigInt(id));
  if (!post) return apiError("Post not found", 404);
  if (post.poststatus !== "published") return apiError("This post isn't published yet", 403);

  const baseUrl = process.env.NEXTAUTH_URL ?? "";
  return apiSuccess({ url: `${baseUrl}/post/${id}`, title: post.title });
});