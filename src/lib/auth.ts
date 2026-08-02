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
      authorization: {
        params: {
          scope: "openid profile email w_organization_social w_member_social rw_organization_admin",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Credentials flow already fully resolved a real blogger in `authorize`.
      if (account?.provider === "credentials") return true;

      if (!user.email) return false; // can't match/create without an email

      const existing = await db.blogger.findUnique({ where: { email: user.email } });

      let authorId: bigint;
      let username: string;

      if (existing) {
        if (existing.bloggerstatus === "banned") return false;
        authorId = existing.authorid;
        username = existing.username;
      } else {
        // First time we've seen this email — provision a blogger row.
        const generatedUsername = await generateUniqueUsername(user.email);
        const created = await db.blogger.create({
          data: {
            name: user.name ?? generatedUsername,
            email: user.email,
            username: generatedUsername,
            password: null,
            profilepicture: user.image ?? null,
            authprovider: account?.provider === "google" ? "google" : "linkedin",
          },
        });
        authorId = created.authorid;
        username = created.username;
      }

      // Persist the LinkedIn access token/expiry/urn — this only happens
      // on the signIn callback because that's the one place account and
      // profile (the raw OAuth token response + userinfo) are available;
      // neither survives into the jwt/session callbacks unless copied
      // through the token first, which we don't need here since these
      // three live in the DB, not the session.
      if (account?.provider === "linkedin") {
        await db.blogger.update({
          where: { authorid: authorId },
          data: {
            linkedinaccesstoken: account.access_token ?? null,
            linkedintokenexpiresat: account.expires_at ? new Date(account.expires_at * 1000) : null,
            // LinkedIn's OIDC userinfo returns `sub` as the member's raw
            // ID — urn:li:person:{sub} is LinkedIn's documented URN format
            // for that ID, matching how linkedinurn is used elsewhere
            // (hasLinkedInConnected in user-service.ts just checks it's
            // non-null, so the exact format only matters if something
            // later calls the LinkedIn API with this urn directly).
            linkedinurn: profile?.sub ? `urn:li:person:${profile.sub}` : null,
          },
        });
      }

      user.id = authorId.toString();
      (user as { username?: string }).username = username;
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