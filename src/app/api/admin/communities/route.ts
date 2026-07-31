import { adminListCommunities } from "@/lib/services/community-service";
import { adminListCommunitiesQuerySchema } from "@/lib/validations/community";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

export const GET = withErrorHandling(async (req: Request) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const query = adminListCommunitiesQuerySchema.parse(Object.fromEntries(searchParams));
  const result = await adminListCommunities(query.page, query.pageSize, query.search);

  return apiSuccess({
    ...result,
    items: result.items.map((c) => {
      const { _count, ...rest } = c;
      return {
        ...rest,
        communityid: rest.communityid.toString(),
        createdby: rest.createdby.toString(),
        memberCount: _count.membership,
      };
    }),
  });
});