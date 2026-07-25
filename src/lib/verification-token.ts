import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.EMAIL_VERIFICATION_SECRET ?? process.env.NEXTAUTH_SECRET
);

export interface PendingRegistration {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
}

const TOKEN_TTL = "10m";

export async function signVerificationToken(payload: PendingRegistration) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secret);
}

/** Returns null on invalid signature OR expiry — caller treats both as "token expired, resend". */
export async function verifyVerificationToken(
  token: string
): Promise<PendingRegistration | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const { name, username, email, passwordHash } = payload as Record<string, unknown>;
    if (
      typeof name !== "string" ||
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof passwordHash !== "string"
    ) {
      return null;
    }
    return { name, username, email, passwordHash };
  } catch {
    return null; // expired or tampered
  }
}