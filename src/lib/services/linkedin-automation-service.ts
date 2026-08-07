import { upsertOrgPostFromAutomation } from "@/lib/services/orgpost-service";

export type LinkedInProvider = "gnews" | "newsapi" | "nytimes" | "mediastack";

interface NormalizedArticle {
  title: string | null;
  description: string;
  imageUrl: string;
  sourceUrl: string;
}

// ---------------------------------------------------------------------------
// Step 1 — fetch raw articles per provider (technology category)
// ---------------------------------------------------------------------------

const MAX_NEWS_PER_SOURCE = Number(process.env.LINKEDIN_AUTOMATION_MAX_NEWS) || 3;
const MAX_WEIGHT_DAYS = Number(process.env.LINKEDIN_AUTOMATION_MAX_WEIGHT_DAYS) || 3;

async function fetchGNewsArticles(): Promise<unknown[]> {
  const fetchCount = (MAX_NEWS_PER_SOURCE + 1) * MAX_WEIGHT_DAYS;
  const res = await fetch(
    `https://gnews.io/api/v4/top-headlines?apikey=${process.env.GNEWS_API_KEY}&category=technology&lang=en&country=us&max=${fetchCount}`
  );
  const json = await res.json();
  return json.articles ?? [];
}

async function fetchNewsAPIArticles(): Promise<unknown[]> {
  const fetchCount = (MAX_NEWS_PER_SOURCE + 1) * MAX_WEIGHT_DAYS;
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?apiKey=${process.env.NEWSAPI_API_KEY}&category=technology&page=0&pageSize=${fetchCount}`
  );
  const json = await res.json();
  return json.articles ?? [];
}

async function fetchNYTimesArticles(): Promise<unknown[]> {
  const res = await fetch(
    `https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=${process.env.NYTIMES_API_KEY}`
  );
  const json = await res.json();
  return json.results ?? [];
}

async function fetchMediastackArticles(): Promise<unknown[]> {
  const res = await fetch(
    `https://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_API_KEY}&categories=technology&languages=en`
  );
  const json = await res.json();
  return json.data ?? [];
}

// ---------------------------------------------------------------------------
// Step 2 — normalize each provider's article into one common shape.
// description/imageUrl/sourceUrl are required; an article missing any of
// them is dropped here, before anything downstream depends on it.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeGNewsArticle(a: any): NormalizedArticle | null {
  const description = a?.description ?? a?.content ?? null;
  const imageUrl = a?.image ?? null;
  const sourceUrl = a?.url ?? null;
  if (!description || !imageUrl || !sourceUrl) return null;
  return { title: a.title ?? null, description, imageUrl, sourceUrl };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNewsAPIArticle(a: any): NormalizedArticle | null {
  const description = a?.description ?? null;
  const imageUrl = a?.urlToImage ?? null;
  const sourceUrl = a?.url ?? null;
  if (!description || !imageUrl || !sourceUrl) return null;
  return { title: a.title ?? null, description, imageUrl, sourceUrl };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNYTimesArticle(a: any): NormalizedArticle | null {
  const description = a?.abstract ?? null;
  const imageUrl = a?.multimedia?.[0]?.url ?? null;
  const sourceUrl = a?.url ?? null;
  if (!description || !imageUrl || !sourceUrl) return null;
  return { title: a.title ?? null, description, imageUrl, sourceUrl };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMediastackArticle(a: any): NormalizedArticle | null {
  const description = a?.description ?? null;
  const imageUrl = a?.image ?? null;
  const sourceUrl = a?.url ?? null;
  if (!description || !imageUrl || !sourceUrl) return null;
  return { title: a.title ?? null, description, imageUrl, sourceUrl };
}

const PROVIDERS: Record<
  LinkedInProvider,
  {
    fetchArticles: () => Promise<unknown[]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normalize: (a: any) => NormalizedArticle | null;
  }
> = {
  gnews: { fetchArticles: fetchGNewsArticles, normalize: normalizeGNewsArticle },
  newsapi: { fetchArticles: fetchNewsAPIArticles, normalize: normalizeNewsAPIArticle },
  nytimes: { fetchArticles: fetchNYTimesArticles, normalize: normalizeNYTimesArticle },
  mediastack: { fetchArticles: fetchMediastackArticles, normalize: normalizeMediastackArticle },
};

// ---------------------------------------------------------------------------
// Step 3 — download the chosen article's image as bytes
// ---------------------------------------------------------------------------

async function fetchImageBytes(imageUrl: string): Promise<Buffer> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to download image (${res.status}): ${imageUrl}`);
  return Buffer.from(await res.arrayBuffer());
}

// ---------------------------------------------------------------------------
// Step 4 — register + upload the image on LinkedIn
// ---------------------------------------------------------------------------

async function registerLinkedInImage(): Promise<{ uploadUrl: string; assetId: string }> {
  const headers = {
    Authorization: `Bearer ${process.env.LINKEDIN_ORG_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    "X-Restli-Protocol-Version": "2.0.0",
    "LinkedIn-Version": process.env.LINKEDIN_API_VERSION ?? "",
  };
  const body = {
    initializeUploadRequest: { owner: `urn:li:organization:${process.env.LINKEDIN_ORG_ID}` },
  };

  const res = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const json = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        `LinkedIn org token appears expired or invalid (401) — check LINKEDIN_ORG_ACCESS_TOKEN. Response: ${JSON.stringify(json)}`
      );
    }
    throw new Error(`LinkedIn image registration failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return { uploadUrl: json.value.uploadUrl, assetId: json.value.image };
}

async function uploadLinkedInImageBytes(uploadUrl: string, imageBytes: Buffer): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.LINKEDIN_ORG_ACCESS_TOKEN}`,
      "Content-Type": "application/octet-stream",
    },
    body: imageBytes,
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  if (res.status !== 201) {
    throw new Error(`LinkedIn image upload failed with status ${res.status}`);
  }
}

// ---------------------------------------------------------------------------
// Step 5 — ask Gemini for LinkedIn-style post text
// ---------------------------------------------------------------------------

// LinkedIn's documented commentary limit for /rest/posts. Not re-verified
// against current docs at the moment this was added — if LinkedIn ever
// changes it, the symptom will be the same 400 this function exists to
// prevent, just at a different length.
const LINKEDIN_MAX_COMMENTARY_LENGTH = 3000;

/**
 * LinkedIn's commentary field is plain text — Markdown bold/headers pass
 * through as literal asterisks/hashes, not formatting. Observed in
 * practice: a loosely-prompted Gemini call returned three full "Option
 * 1/2/3" post variants in one response (each with its own headline,
 * hashtags, and a closing tips section) instead of a single post,
 * totaling well over LinkedIn's ~3000-char commentary limit — that's
 * what actually caused a 400 here, not anything wrong with the request
 * shape itself. This is a safety net independent of prompt wording:
 * keep only the first option/section, strip Markdown emphasis/heading
 * syntax, and hard-cap length, so a prompt regression doesn't silently
 * fail publishing again the same way.
 */
function sanitizeForLinkedIn(rawText: string): string {
  let text = rawText;

  // If Gemini returned multiple options separated by a "---" rule,
  // keep only the first section.
  const firstSectionEnd = text.indexOf("\n---");
  if (firstSectionEnd !== -1) {
    text = text.slice(0, firstSectionEnd);
  }

  text = text
    .replace(/^#{1,6}\s*/gm, "") // markdown headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italic
    .replace(/^Option \d+.*$/gim, "") // leftover "Option 1: ..." labels
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (text.length > LINKEDIN_MAX_COMMENTARY_LENGTH) {
    text = text.slice(0, LINKEDIN_MAX_COMMENTARY_LENGTH - 1).trimEnd() + "…";
  }

  return text;
}

async function generateLinkedInPostText(article: NormalizedArticle): Promise<{ title: string | null; content: string }> {
  const prompt = `${process.env.GEMINI_PROMPT}\nContent: ${article.description}\nArticle Source: ${article.sourceUrl}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error(`Gemini returned no usable text: ${JSON.stringify(json)}`);

  // Same delimiter convention as the standalone script: only the part
  // after "*****" (if present) is the actual post body.
  const parts = text.split("*****");
  const rawContent = parts.length > 1 ? parts.slice(1).join("*****").trim() : text.trim();
  const content = sanitizeForLinkedIn(rawContent);

  return { title: article.title, content };
}

// ---------------------------------------------------------------------------
// Step 6 — publish to the LinkedIn organization page
// ---------------------------------------------------------------------------

async function publishToLinkedInOrg(
  title: string | null,
  content: string,
  assetId: string
): Promise<{ status: number; postId: string | null; errorBody?: unknown }> {
  const headers = {
    "Content-Type": "application/json",
    "X-Restli-Protocol-Version": "2.0.0",
    "LinkedIn-Version": process.env.LINKEDIN_API_VERSION ?? "",
    Authorization: `Bearer ${process.env.LINKEDIN_ORG_ACCESS_TOKEN}`,
  };
  const body = {
    author: `urn:li:organization:${process.env.LINKEDIN_ORG_ID}`,
    commentary: content,
    visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    content: { media: { title: title ?? "", id: assetId } },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errorBody: unknown;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text().catch(() => null);
    }
    return { status: res.status, postId: null, errorBody };
  }

  return { status: res.status, postId: res.headers.get("x-restli-id") };
}

/**
 * Assumption, flagging rather than guessing silently: LinkedIn's REST
 * API doesn't return a browsable post URL directly, only the x-restli-id
 * urn (e.g. "urn:li:share:...") in publishToLinkedInOrg's response.
 * `/feed/update/{urn}/` is LinkedIn's documented public-post URL pattern
 * for that urn — not verified against a real response from this specific
 * organization, so double-check the first live post's link actually
 * resolves before relying on it elsewhere (e.g. an org-posts detail page).
 */
function buildLinkedInPostUrl(postId: string | null): string | null {
  if (!postId) return null;
  return `https://www.linkedin.com/feed/update/${postId}/`;
}

// ---------------------------------------------------------------------------
// Full pipeline — fetch, normalize, image, Gemini, publish, persist.
// Every intermediate value (raw description, provider, generated content,
// LinkedIn post id/url) is written to orgpost, not discarded after publish.
// ---------------------------------------------------------------------------

export async function runLinkedInOrgAutomation(provider: LinkedInProvider, index: number) {
  const providerConfig = PROVIDERS[provider];

  const rawArticles = await providerConfig.fetchArticles();
  const articles = rawArticles.map(providerConfig.normalize).filter((a): a is NormalizedArticle => a !== null);

  const weight = new Date().getDate() % MAX_WEIGHT_DAYS;
  const pickedIndex = weight * MAX_NEWS_PER_SOURCE + index;
  const article = articles[pickedIndex];

  if (!article) {
    throw new Error(
      `No usable article at index ${pickedIndex} for provider "${provider}" (${articles.length} candidates after normalization)`
    );
  }

  const imageBytes = await fetchImageBytes(article.imageUrl);
  const { uploadUrl, assetId } = await registerLinkedInImage();
  await uploadLinkedInImageBytes(uploadUrl, imageBytes);
  const post = await generateLinkedInPostText(article);
  const publishResult = await publishToLinkedInOrg(post.title, post.content, assetId);

  if (publishResult.status !== 201) {
    if (publishResult.status === 401) {
      throw new Error(
        `LinkedIn org token appears expired or invalid (401) — check LINKEDIN_ORG_ACCESS_TOKEN. Response: ${JSON.stringify(publishResult.errorBody)}`
      );
    }
    throw new Error(
      `LinkedIn publish failed with status ${publishResult.status}: ${JSON.stringify(publishResult.errorBody)}`
    );
  }

  const linkedinUrl = buildLinkedInPostUrl(publishResult.postId);

  const orgPost = await upsertOrgPostFromAutomation({
    sourceurl: article.sourceUrl,
    provider,
    title: post.title,
    description: article.description,
    content: post.content,
    coverimage: article.imageUrl,
    linkedinpostid: publishResult.postId,
    linkedinurl: linkedinUrl,
    publishedat: new Date(),
  });

  return { article, post, publishResult, orgPost };
}