import nodemailer from "nodemailer";

/**
 * Gmail requires an "app password" (not your normal login password) —
 * generate one at https://myaccount.google.com/apppasswords with 2FA
 * enabled on the account. Set GMAIL_USER + GMAIL_APP_PASSWORD in env.
 *
 * When you move to Resend later, only this file needs to change — the
 * `sendVerificationEmail` signature below can stay identical.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  await transporter.sendMail({
    from: `Tech2Xplore <${process.env.GMAIL_USER}>`,
    to,
    subject: "Verify your Tech2Xplore account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Confirm your email</h2>
        <p>Click the link below to activate your account. This link expires in 10 minutes.</p>
        <p><a href="${verifyUrl}" style="background:#111;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;">Verify Email</a></p>
        <p>If this wasn't you, you can safely ignore this email — no account was created.</p>
      </div>
    `,
  });
}