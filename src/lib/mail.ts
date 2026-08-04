import nodemailer from "nodemailer";

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

export interface ContactInquiry {
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  message: string;
}

/** Sends the contact/quote-request form to the team inbox (GMAIL_USER) — the visitor never receives this, it's an internal notification, not a confirmation email. */
export async function sendContactInquiryEmail(inquiry: ContactInquiry) {
  await transporter.sendMail({
    from: `Tech2Xplore Website <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: inquiry.email,
    subject: `New inquiry: ${inquiry.projectType} — ${inquiry.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Project type:</strong> ${inquiry.projectType}</p>
        <p><strong>Budget range:</strong> ${inquiry.budgetRange}</p>
        <p><strong>Timeline:</strong> ${inquiry.timeline}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${inquiry.message}</p>
      </div>
    `,
  });
}