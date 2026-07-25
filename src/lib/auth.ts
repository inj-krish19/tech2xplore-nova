import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { generateUniqueUsername } from "@/lib/generate-username";

/**
 * JWT session strategy throughout — no PrismaAdapter, no account/session
 * tables. OAuth account creation/linking is handled manually in the
 * `signIn` callback below, matched by email.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const blogger = await db.blogger.findUnique({ where: { email } });
        if (!blogger || !blogger.password) return null; // no password = OAuth-only account

        const passwordMatches = await bcrypt.compare(password, blogger.password);
        if (!passwordMatches) return null;
        if (blogger.bloggerstatus === "banned") return null;

        return {
          id: blogger.authorid.toString(),
          name: blogger.name,
          email: blogger.email,
          username: blogger.username,
          image: blogger.profilepicture ?? undefined,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Credentials flow already fully resolved a real blogger in `authorize`.
      if (account?.provider === "credentials") return true;

      if (!user.email) return false; // can't match/create without an email

      const existing = await db.blogger.findUnique({ where: { email: user.email } });

      if (existing) {
        if (existing.bloggerstatus === "banned") return false;
        // Existing account (whether it originally signed up via credentials
        // or another provider) — email match is enough to let this through.
        user.id = existing.authorid.toString();
        (user as { username?: string }).username = existing.username;
        return true;
      }

      // First time we've seen this email — provision a blogger row.
      const username = await generateUniqueUsername(user.email);
      const created = await db.blogger.create({
        data: {
          name: user.name ?? username,
          email: user.email,
          username,
          password: null,
          profilepicture: user.image ?? null,
          authprovider: account?.provider === "google" ? "google" : "linkedin",
        },
      });
      user.id = created.authorid.toString();
      (user as { username?: string }).username = created.username;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});