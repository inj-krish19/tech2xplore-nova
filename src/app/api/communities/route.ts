import { listCommunities, createCommunity } from "@/lib/services/community-service";
import { createCommunitySchema, listCommunitiesQuerySchema } from "@/lib/validations/community";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

export const GET = withErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const { page, pageSize } = listCommunitiesQuerySchema.parse(Object.fromEntries(searchParams));
  const result = await listCommunities(page, pageSize);

  return apiSuccess({
    ...result,
    items: result.items.map((c) => ({
      ...c,
      communityid: c.communityid.toString(),
      createdby: c.createdby.toString(),
      memberCount: c._count.membership,
    })),
  });
});

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = createCommunitySchema.parse(body);

  const community = await createCommunity(BigInt(session.user.id), input);
  return apiSuccess({ ...community, communityid: community.communityid.toString(), createdby: community.createdby.toString() }, 201);
});