import { auth } from "@/lib/auth";

export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}

/** Throws UnauthorizedError if no session — callers should catch via withErrorHandling's ZodError-style pattern, or just let it 500... use requireSessionOrError instead in routes. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError("Not signed in");
  return session;
}

function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return allowlist.includes(email.toLowerCase());
}

export async function requireAdmin() {
  const session = await requireSession();
  if (!isAdminEmail(session.user.email)) throw new ForbiddenError("Admin only");
  return session;
}

/**
 * Basic Auth against a single fixed identity from env — deliberately NOT
 * requireAdmin()/session-based, because this guards routes a cron job
 * calls directly (no browser, no NextAuth session to check). Mirrors the
 * legacy standalone automation script's auth model one-for-one.
 */
export async function requireCronBasicAuth(req: Request) {
  const header = req.headers.get("authorization");
  if (!header) throw new UnauthorizedError("Missing credentials");

  const encoded = header.split(" ")[1] ?? "";
  const decoded = Buffer.from(encoded, "base64").toString();
  const [username, password] = decoded.split(":");

  const expectedUsername = process.env.LINKEDIN_AUTOMATION_USERNAME ?? "";
  const expectedPassword = process.env.LINKEDIN_AUTOMATION_PASSWORD ?? "";

  // Both must match — not `!==` on the reject side, which is the bug
  // fixed in the standalone script's version of this same check.
  if (username !== expectedUsername || password !== expectedPassword) {
    throw new UnauthorizedError("Invalid credentials");
  }
}