import { listCommunityMembers } from "@/lib/services/community-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const members = await listCommunityMembers(BigInt(id));

  return apiSuccess(
    members.map((m) => ({
      ...m,
      membershipid: m.membershipid.toString(),
      authorid: m.authorid.toString(),
      communityid: m.communityid.toString(),
      blogger: { ...m.blogger, authorid: m.blogger.authorid.toString() },
    }))
  );
});