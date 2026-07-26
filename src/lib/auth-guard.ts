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