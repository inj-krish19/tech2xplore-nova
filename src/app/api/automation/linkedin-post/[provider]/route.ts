import { apiError, apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireCronBasicAuth } from "@/lib/auth-guard";
import { runLinkedInOrgAutomation, type LinkedInProvider } from "@/lib/services/linkedin-automation-service";

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
});