import { checkEmailSchema } from "@/lib/validations/auth";
import { checkEmailStatus } from "@/lib/services/auth-service";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const POST = withErrorHandling(async (req: Request) => {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`check-email:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!allowed) {
    return apiSuccess({ exists: false, hasPassword: false }, 200); // fail open, quietly, no info leak on rate limit
  }

  const body = await req.json();
  const { email } = checkEmailSchema.parse(body);
  const status = await checkEmailStatus(email);

  return apiSuccess(status);
});