import { apiError, apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireCronBasicAuth } from "@/lib/auth-guard";
import { runLinkedInOrgAutomation, type LinkedInProvider } from "@/lib/services/linkedin-automation-service";
import { sendAutomationFailureEmail } from "@/lib/mail";

type Ctx = { params: Promise<{ provider: string }> };

const VALID_PROVIDERS: LinkedInProvider[] = ["gnews", "newsapi", "nytimes", "mediastack"];

/**
 * POST /api/automation/linkedin-post/[provider]?index=0
 *
 * One route for all four providers instead of four near-identical route
 * files — cron just varies the URL segment:
 *   /api/automation/linkedin-post/gnews?index=0
 *   /api/automation/linkedin-post/newsapi?index=0
 *   /api/automation/linkedin-post/nytimes?index=0
 *   /api/automation/linkedin-post/mediastack?index=0
 *
 * Basic Auth (requireCronBasicAuth), not session-based requireAdmin —
 * this is called by a cron job, not a signed-in browser.
 */
export const POST = withErrorHandling<Ctx>(async (req, { params }) => {
  await requireCronBasicAuth(req);

  const { provider } = await params;
  if (!VALID_PROVIDERS.includes(provider as LinkedInProvider)) {
    return apiError(`Unknown provider "${provider}"`, 404);
  }

  const { searchParams } = new URL(req.url);
  const index = Number(searchParams.get("index")) || 0;

  // Cron only sees a non-2xx HTTP response, nothing more — this is the
  // one place a failure can actually reach a human before someone
  // notices the LinkedIn page went quiet. The email send itself is
  // best-effort: a failing mail send shouldn't mask or replace the
  // real automation error being re-thrown below.
  try {
    const result = await runLinkedInOrgAutomation(provider as LinkedInProvider, index);

    return apiSuccess({
      article: result.article,
      post: result.post,
      postId: result.publishResult.postId,
      orgPost: {
        ...result.orgPost,
        orgpostid: result.orgPost.orgpostid.toString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sendAutomationFailureEmail({ provider, index, error: message }).catch(() => {
      // Swallow — losing the alert email is bad, but not as bad as
      // masking the original automation error with a mail-send error.
    });
    throw err;
  }
});