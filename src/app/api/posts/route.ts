import { listPosts, createPost } from "@/lib/services/post-service";
import { createPostSchema, listPostsQuerySchema } from "@/lib/validations/post";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

export const GET = withErrorHandling(async (req: Request) => {
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

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = createPostSchema.parse(body);

  const post = await createPost(BigInt(session.user.id), input);
  return apiSuccess({ ...post, articleid: post.articleid.toString(), primaryauthor: post.primaryauthor.toString() }, 201);
});