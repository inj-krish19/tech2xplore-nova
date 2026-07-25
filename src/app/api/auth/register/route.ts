import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { signVerificationToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/mail";

const BCRYPT_ROUNDS = 12;

export const POST = withErrorHandling(async (req: Request) => {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`register:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!allowed) {
    return apiError("Too many signup attempts — try again in a minute", 429);
  }

  const body = await req.json();
  const { name, username, email, password } = registerSchema.parse(body);

  // No account exists yet at this point by design — this just guards
  // against re-registering an email/username that's already active.
  const existing = await db.blogger.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });
  if (existing) {
    const field = existing.email === email ? "email" : "username";
    return apiError(`That ${field} is already taken`, 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const token = await signVerificationToken({ name, username, email, passwordHash });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  await sendVerificationEmail(email, verifyUrl);

  // Nothing written to `blogger` yet — the row is only created when the
  // link is clicked and the token verifies. If it expires unused, this
  // endpoint is simply called again for a fresh 10-minute token.
  return apiSuccess(
    { message: "Check your email to verify your account. The link expires in 10 minutes." },
    200
  );
});