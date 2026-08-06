import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { requireSession, ForbiddenError } from "@/lib/auth-guard";
import { isPrimaryAuthor } from "@/lib/services/post-service";
import {
  shareUserPostToLinkedIn,
  LinkedInNotConnectedError,
  LinkedInTokenExpiredError,
} from "@/lib/services/linkedin-share-service";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Only the post's primary author can share it — not a secondary
 * collaborator, since this posts under the primary author's own
 * LinkedIn identity, not the post's collaborative ownership. Flagging
 * this as a deliberate choice, not an oversight, in case a collaborator
 * being able to share too turns out to be wanted.
 */
export const POST = withErrorHandling<Ctx>(async (req, { params }) => {
  const session = await requireSession();
  const { id } = await params;
  const articleId = BigInt(id);

  const isOwner = await isPrimaryAuthor(articleId, BigInt(session.user.id));
  if (!isOwner) {
    throw new ForbiddenError("Only the post's primary author can share it to LinkedIn");
  }

  try {
    const result = await shareUserPostToLinkedIn(BigInt(session.user.id), articleId);
    return apiSuccess(result);
  } catch (err) {
    if (err instanceof LinkedInNotConnectedError || err instanceof LinkedInTokenExpiredError) {
      return apiError(err.message, 400);
    }
    throw err;
  }
});