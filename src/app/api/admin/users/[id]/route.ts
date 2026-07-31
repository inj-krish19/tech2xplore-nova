import { setBloggerStatus } from "@/lib/services/user-service";
import { setBloggerStatusSchema } from "@/lib/validations/user";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

/** Body: { "status": "active" | "inactive" | "banned" } — same route handles ban and unban/reinstate. */
export const PATCH = withErrorHandling<Ctx>(async (req, { params }) => {
  await requireAdmin();
  const { id } = await params;
  const body = await req.json();
  const { status } = setBloggerStatusSchema.parse(body);

  const blogger = await setBloggerStatus(BigInt(id), status);
  return apiSuccess({ ...blogger, authorid: blogger.authorid.toString() });
});