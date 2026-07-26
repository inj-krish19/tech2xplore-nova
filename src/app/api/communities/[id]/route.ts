import { getCommunityById, updateCommunity, isCommunityAdmin } from "@/lib/services/community-service";
import { updateCommunitySchema } from "@/lib/validations/community";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession, ForbiddenError } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const community = await getCommunityById(BigInt(id));
  if (!community) return apiError("Community not found", 404);

  return apiSuccess({
    ...community,
    communityid: community.communityid.toString(),
    createdby: community.createdby.toString(),
    memberCount: community._count.membership,
  });
});

export const PATCH = withErrorHandling<Ctx>(async (req, { params }) => {
  const { id } = await params;
  const communityId = BigInt(id);
  const session = await requireSession();

  const allowed = await isCommunityAdmin(communityId, BigInt(session.user.id));
  if (!allowed) throw new ForbiddenError("Only a community admin can update this community");

  const body = await req.json();
  const input = updateCommunitySchema.parse(body);
  const community = await updateCommunity(communityId, input);

  return apiSuccess({ ...community, communityid: community.communityid.toString(), createdby: community.createdby.toString() });
});