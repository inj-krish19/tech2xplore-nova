import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireSession } from "@/lib/auth-guard";
import { getBloggerAnalytics } from "@/lib/services/analytics-service";

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const analytics = await getBloggerAnalytics(BigInt(session.user.id));
  return apiSuccess(analytics);
});