/**
 * In-memory sliding-window rate limiter.
 *
 * Fine for a single Vercel serverless instance under light load, but each
 * cold-started function gets its own memory — this does NOT coordinate
 * across instances. Swap for Upstash Redis (`@upstash/ratelimit`) before
 * this endpoint sees real traffic in production; the interface below is
 * shaped to make that swap a drop-in replacement.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}