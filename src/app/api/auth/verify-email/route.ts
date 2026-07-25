import { db } from "@/lib/db";
import { verifyVerificationToken } from "@/lib/verification-token";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const appUrl = process.env.NEXTAUTH_URL ?? "";

  if (!token) {
    return NextResponse.redirect(`${appUrl}/register?error=missing_token`);
  }

  const payload = await verifyVerificationToken(token);
  if (!payload) {
    // Expired or tampered — by design we do NOT create an account here.
    // User needs to resubmit the register form to get a fresh link.
    return NextResponse.redirect(`${appUrl}/register?error=link_expired`);
  }

  const { name, username, email, passwordHash } = payload;

  // Re-check uniqueness at verification time too — someone else could have
  // taken the email/username in the 10-minute window between request and click.
  const existing = await db.blogger.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { authorid: true },
  });
  if (existing) {
    return NextResponse.redirect(`${appUrl}/login?info=already_registered`);
  }

  await db.blogger.create({
    data: { name, username, email, password: passwordHash },
  });

  return NextResponse.redirect(`${appUrl}/login?verified=true`);
}