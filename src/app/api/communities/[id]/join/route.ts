import { joinCommunity, leaveCommunity } from "@/lib/services/community-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export const POST = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const session = await requireSession();

  const membership = await joinCommunity(BigInt(session.user.id), BigInt(id));
  return apiSuccess(
    { ...membership, membershipid: membership.membershipid.toString(), authorid: membership.authorid.toString(), communityid: membership.communityid.toString() },
    201
  );
});

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  const { id } = await params;
  const session = await requireSession();

  await leaveCommunity(BigInt(session.user.id), BigInt(id));
  return apiSuccess({ left: true });
});