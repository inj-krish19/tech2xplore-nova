import { db } from "@/lib/db";
import { getPostById } from "@/lib/services/post-service";

export class LinkedInNotConnectedError extends Error {}
export class LinkedInTokenExpiredError extends Error {}

/**
 * Same documented-but-unconfirmed URN pattern used by the org automation
 * pipeline's buildLinkedInPostUrl — not re-verified against a real
 * response here either.
 */
function buildLinkedInPostUrl(postId: string | null): string | null {
  if (!postId) return null;
  return `https://www.linkedin.com/feed/update/${postId}/`;
}

/**
 * Distinct from linkedin-automation-service.ts's org-level pipeline:
 * that one posts as the organization with a fixed token and an uploaded
 * image asset. This posts as the individual blogger, using their own
 * linkedinaccesstoken/linkedinurn (persisted in auth.ts's signIn
 * callback), and — since `post.postmedia` is always "" by product
 * decision, there's no image to upload — shares as a link/article post
 * instead of an image post.
 *
 * ASSUMPTION, flagged rather than guessed silently: LinkedIn's
 * content.article shape below (source/title/description, for an
 * auto-unfurled link preview) is not verified against a real response
 * from this app's LinkedIn integration — test against one real share
 * before trusting the preview renders as expected.
 */
export async function shareUserPostToLinkedIn(authorId: bigint, articleId: bigint) {
  const [blogger, post] = await Promise.all([
    db.blogger.findUnique({
      where: { authorid: authorId },
      select: { linkedinaccesstoken: true, linkedinurn: true, linkedintokenexpiresat: true },
    }),
    getPostById(articleId),
  ]);

  if (!post) {
    throw new Error("Post not found");
  }
  if (!blogger?.linkedinaccesstoken || !blogger.linkedinurn) {
    throw new LinkedInNotConnectedError("Connect LinkedIn from your profile settings before sharing.");
  }
  if (blogger.linkedintokenexpiresat && blogger.linkedintokenexpiresat < new Date()) {
    // LinkedIn's standard OAuth flow (as used here) doesn't issue a
    // refresh token, so there's nothing to silently refresh with —
    // signing in with LinkedIn again is what re-persists a fresh token
    // via auth.ts's signIn callback.
    throw new LinkedInTokenExpiredError("Your LinkedIn connection expired — sign in with LinkedIn again to reconnect.");
  }

  const postUrl = `${process.env.NEXTAUTH_URL}/post/${articleId}`;

  const body = {
    author: blogger.linkedinurn,
    commentary: post.title,
    visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    content: {
      article: {
        source: postUrl,
        title: post.title,
        description: post.description ? post.description.slice(0, 200) : "",
      },
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": process.env.LINKEDIN_API_VERSION ?? "",
      Authorization: `Bearer ${blogger.linkedinaccesstoken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errorBody: unknown;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text().catch(() => null);
    }
    throw new Error(`LinkedIn share failed (${res.status}): ${JSON.stringify(errorBody)}`);
  }

  const linkedinPostId = res.headers.get("x-restli-id");
  return { linkedinPostUrl: buildLinkedInPostUrl(linkedinPostId) };
}