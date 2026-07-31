import { adminListUsers } from "@/lib/services/user-service";
import { adminListUsersQuerySchema } from "@/lib/validations/user";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const query = adminListUsersQuerySchema.parse(Object.fromEntries(searchParams));
  const result = await adminListUsers(query.page, query.pageSize, query.search);

  return apiSuccess({
    ...result,
    items: result.items.map((u) => {
      const { _count, ...rest } = u;
      return {
        ...rest,
        authorid: rest.authorid.toString(),
        postCount: _count.post,
      };
    }),
  });
});