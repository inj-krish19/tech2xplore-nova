const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";

interface ShareResult {
  success: boolean;
  postUrn?: string;
  error?: string;
}

/**
 * Posts text (optionally with a link) to LinkedIn on the user's behalf.
 * Requires `w_member_social` scope and a still-valid access token —
 * LinkedIn's posting product token lasts ~60 days with NO refresh
 * token, so a 401 here almost always means "ask them to reconnect
 * LinkedIn," not a bug. Surface that distinction to the caller.
 */
export async function shareOnLinkedIn(
  accessToken: string,
  authorUrn: string,
  text: string,
  articleUrl?: string
): Promise<ShareResult> {
  const body = {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: articleUrl ? "ARTICLE" : "NONE",
        ...(articleUrl && {
          media: [{ status: "READY", originalUrl: articleUrl }],
        }),
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const res = await fetch(`${LINKEDIN_API_BASE}/ugcPosts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    return { success: false, error: "TOKEN_EXPIRED" };
  }

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    console.error("[LINKEDIN_SHARE_FAILED]", res.status, details);
    return { success: false, error: "SHARE_FAILED" };
  }

  const postUrn = res.headers.get("x-restli-id") ?? undefined;
  return { success: true, postUrn };
}

export interface FetchedLinkedInPost {
  title: string | null;
  content: string | null;
  coverImage: string | null;
}

/**
 * Best-effort content extraction from a public LinkedIn post URL via
 * Open Graph tags — NOT the official LinkedIn API (there's no public
 * "read arbitrary post content" endpoint without the Community
 * Management API product, which is a separate, harder approval process
 * than what you already have). This works for public posts but is
 * fragile: LinkedIn can change markup anytime, and posts requiring
 * login won't yield usable OG tags. Treat failures as expected, not
 * exceptional — log and skip rather than throwing.
 */
export async function fetchLinkedInPostContent(url: string): Promise<FetchedLinkedInPost | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Tech2XploreBot/1.0)" },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const getMeta = (property: string) => {
      const match = html.match(
        new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i")
      );
      return match?.[1] ?? null;
    };

    return {
      title: getMeta("og:title"),
      content: getMeta("og:description"),
      coverImage: getMeta("og:image"),
    };
  } catch (err) {
    console.error("[LINKEDIN_FETCH_FAILED]", url, err);
    return null;
  }
}