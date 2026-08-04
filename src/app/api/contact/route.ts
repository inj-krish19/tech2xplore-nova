import { contactInquirySchema } from "@/lib/validations/contact";
import { sendContactInquiryEmail } from "@/lib/mail";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Public, unauthenticated form — a real spam/abuse target, unlike the
 * rest of the API which sits behind a session or Basic Auth. Rate
 * limited by IP: 3 submissions per 10 minutes. Uses the same in-memory
 * rateLimit() as everything else, so see rate-limit.ts's own header
 * comment about swapping to Upstash before this sees real traffic.
 */
export const POST = withErrorHandling(async (req: Request) => {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 10 * 60 * 1000 });
  if (!allowed) {
    return apiError("Too many submissions — please try again in a few minutes.", 429);
  }

  const body = await req.json();
  const input = contactInquirySchema.parse(body);

  await sendContactInquiryEmail(input);

  return apiSuccess({ sent: true });
});