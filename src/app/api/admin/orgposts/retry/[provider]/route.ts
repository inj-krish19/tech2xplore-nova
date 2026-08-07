import { apiError, apiSuccess, withErrorHandling } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth-guard";
import { runLinkedInOrgAutomation, type LinkedInProvider } from "@/lib/services/linkedin-automation-service";

type Ctx = { params: Promise<{ provider: string }> };

const VALID_PROVIDERS: LinkedInProvider[] = ["gnews", "newsapi", "nytimes", "mediastack"];

/**
 * Manual retry from the admin panel — session-gated (requireAdmin), a
 * deliberately separate route from the cron-triggered
 * /api/automation/linkedin-post/[provider], which uses Basic Auth
 * instead. Same underlying pipeline either way; only the auth model
 * and who's allowed to trigger it differ.
 *
 * "Retry" here means re-running the pipeline for this provider at
 * index 0, not literally re-attempting the exact article/error that
 * failed — the rotation math (day-of-month % weight) means a retry on
 * the same day picks the same article bucket the original run would
 * have, but this isn't a stored "retry this specific failed job"
 * queue. If that granularity turns out to matter, this needs an actual
 * job/attempt record, not just a re-trigger.
 */
export const POST = withErrorHandling<Ctx>(async (_req, { params }) => {
  await requireAdmin();

  const { provider } = await params;
  if (!VALID_PROVIDERS.includes(provider as LinkedInProvider)) {
    return apiError(`Unknown provider "${provider}"`, 404);
  }

  const result = await runLinkedInOrgAutomation(provider as LinkedInProvider, 0);

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