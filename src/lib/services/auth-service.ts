import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const BCRYPT_ROUNDS = 10;

export interface EmailStatus {
  exists: boolean;
  hasPassword: boolean;
}

/**
 * Step 1 of the email-first legacy login flow. Frontend uses this to
 * decide: unknown email -> /register, known email with a password ->
 * /login/password, known email with NO password (OAuth-only account)
 * -> /set-password.
 */
export async function checkEmailStatus(email: string): Promise<EmailStatus> {
  const blogger = await db.blogger.findUnique({
    where: { email },
    select: { password: true },
  });

  if (!blogger) return { exists: false, hasPassword: false };
  return { exists: true, hasPassword: blogger.password !== null };
}

/**
 * Lets a Google/LinkedIn-only user add a password so they can also log
 * in with credentials going forward. Does not touch `authprovider` —
 * that stays as their original signup method for reference; adding a
 * password just means `authorize()` can now succeed for this email too.
 */
export async function setPasswordForUser(authorId: bigint, password: string) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await db.blogger.update({
    where: { authorid: authorId },
    data: { password: passwordHash },
  });
}