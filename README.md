# Tech2Xplore Nova — README

Context-transfer doc. Paste this + `ROADMAP.md` into a new chat to
continue frontend work — this chat has been backend-focused and is
getting long, so frontend continues elsewhere from here.

---

## 1. What this project is

**Tech2Xplore** is two things in one app:

1. A blogging/community platform for developers — write posts, follow
   other writers, react/comment, join communities. Rebuild of a legacy
   Spring Boot + Thymeleaf app, now Next.js.
2. A services & consulting company (the same team, same brand) —
   contract-based web/software development, consulting, digital
   marketing, and platform promotion. The homepage sells both.

Old repo (untouched, kept as fallback): `github.com/inj-krish19/Tech2Xplore`
LinkedIn: `https://www.linkedin.com/company/tech2xplore/`

## 2. Tech stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** — CSS-first config (`@theme`/`@custom-variant` in
  `globals.css`), no `tailwind.config.ts` needed
- **Prisma** with the newer `prisma-client` generator (not
  `prisma-client-js`) — requires the `PrismaPg` driver adapter, client
  generates to `src/generated/prisma/client` (not `@prisma/client`)
- **Auth.js v5** (`next-auth@beta`) — JWT session strategy, no
  database adapter, no `account`/`session` tables
- **Zustand** — `authStore` (session mirror), `themeStore` (persisted)
- **Zod** — validation on every API route
- **Nodemailer + Gmail** for email (not Resend — needs domain
  verification, revisit later)
- **motion** (formerly framer-motion) + custom `Reveal`/`WordsPullUp`
  components for scroll animation
- **react-icons** for all icons — no emoji anywhere in the UI
- **bcryptjs**, **jose** (JWT signing for magic links)

## 3. Folder structure (layer-based, not feature-based — deliberate choice)

```
src/
├── app/
│   ├── page.tsx                    homepage (public, marketing + platform pitch)
│   ├── layout.tsx                  root layout — loads fonts, wraps Providers
│   ├── providers.tsx               SessionProvider + SessionSync + ThemeProvider
│   ├── globals.css                 ALL design tokens + Tailwind v4 config live here
│   ├── (auth)/                     login, login/password, register, set-password, verify-email
│   ├── (main)/                     feed, post/[id], post/new, profile/[username] — shares Header/Footer via its layout.tsx
│   ├── admin/                      moderation panel, gated by ADMIN_EMAILS allowlist (no role column exists)
│   └── api/                        route handlers — thin, call into lib/services/*
├── components/
│   ├── ui/                         (not yet populated — no shadcn generated components yet despite being in the original stack decision)
│   ├── layout/                     Header.tsx, Footer.tsx — APP-WIDE, not homepage-only
│   ├── auth/                       OAuthButtons, EmailStepForm, LoginPasswordForm, RegisterForm, SetPasswordForm, SessionSync
│   ├── theme/                      ThemeProvider, ThemeToggle (switch, not cycle button)
│   ├── blog/                       PostCard, CommentThread (NOT yet wired to real API)
│   ├── admin/                      AdminSidebar, PostModerationTable
│   └── motion/                     Reveal (scroll fade+scale), WordsPullUp (word-by-word headline)
├── lib/
│   ├── db.ts, env.ts, auth.ts, mail.ts, rate-limit.ts, api-response.ts,
│   │   auth-guard.ts, verification-token.ts, generate-username.ts
│   ├── constants/avatar-presets.ts DiceBear preset URLs
│   ├── validations/                one file per domain (auth, post, comment, category, keyword, reaction, collaboration, community, avatar)
│   └── services/                   actual business logic — routes call these, never touch db.* directly except for simple lookups
├── store/                          authStore.ts, themeStore.ts
├── types/                          next-auth.d.ts
└── proxy.ts                        route protection (renamed from middleware.ts — Next.js 16)
```

**The one real architectural rule**: route handlers stay thin (parse →
call a service function → shape response). Business logic lives in
`lib/services/`, not in `app/api/**/route.ts`.

## 4. Design system — READ THIS BEFORE BUILDING ANY UI

Full tokens live in `src/app/globals.css`. Summary:

**Color** — light and dark are deliberately the same brand, different
mood ("day/night," not two palettes):
| Token | Light (sky/azure) | Dark (violet night) |
|---|---|---|
| `background` | `#F5F9FF` | `#140B22` |
| `foreground` | `#0D1B2A` | `#EFE7FB` |
| `accent` | `#1768D1` | `#A64DFF` |
| `card` | `#FFFFFF` | `#1D1230` |
| `border` | `#DCE6F2` | `#2C2043` |

Use `bg-background`, `text-foreground`, `bg-accent`,
`text-muted-foreground`, `border-border` etc. — **never raw Tailwind
grays/blues**, or the theme switch breaks for that component.

**Dark mode**: class-based via `.dark` on `<html>`, NOT
`prefers-color-scheme` — driven by `themeStore` (Zustand, persisted to
localStorage key `"theme"`), applied by `ThemeProvider`. Default is
`"system"` until the user explicitly flips `ThemeToggle` (a two-state
switch, not a 3-way cycle) — from then on it's an explicit light/dark
choice, never reverts to system from the UI.

**Typography** — three fonts, loaded via `next/font/google` in
`layout.tsx`:

- Display/headings: **Space Grotesk** (`font-display` / `h1-h4`)
- Body: **Inter** (default)
- Kickers/labels/mono accents: **JetBrains Mono** (`.font-mono-kicker`
  class — small, uppercase, tracked-out)

**Signature motion device**: `<Reveal>` (fade + rise + slight scale on
scroll-into-view) — reused everywhere instead of one-off animations.
`<WordsPullUp text="..." />` for headline text specifically. Both are
in `components/motion/`. There's also a `.tilt-card` CSS utility for a
light 3D hover tilt, and `.hero-glow` (pulsing radial gradient,
re-hued per theme) for hero sections.

**Standing rule**: every new component — down to a single toast —
gets built responsive and on-theme from the start.

## 5. Current frontend state (as of this handoff)

**Built and largely working:**

- Full auth flow: email-first login (`/login` → `/login/password` or
  `/register` or `/set-password`), OAuth (Google + LinkedIn — UI
  built, DB columns for it NOT yet migrated, see §7), magic-link email
  verification
- Homepage: hero, Beyond the Platform (services), What Tech2Xplore Is,
  Example Posts (live or sample), Clients (2 real + 1 placeholder),
  Why teams choose us, LinkedIn CTA, final CTA
- `/feed`, `/post/[id]`, `/post/new`, `/profile/[username]`, `/admin`
  — all render, but see the NOT-wired list below
- Header/Footer are app-wide (shared via `(main)/layout.tsx` and
  homepage), NOT homepage-only anymore

**Explicitly NOT wired to the real API yet** (this is the frontend
chat's main job — see `ROADMAP.md` Phase 1 for the full breakdown):

- `CommentThread`'s reply handler is a local prop, not calling
  `/api/posts/[id]/comments`
- No like/dislike buttons on post detail
- No share button
- No related-posts/related-users UI anywhere
- No category/keyword picker on post creation (API expects
  `categoryIds`/`keywordIds`, form doesn't send them)
- No follow/unfollow button on profile
- No avatar picker UI (API exists: `/api/users/me/avatar-options`,
  `/api/users/me/avatar`)
- No category/keyword dedicated pages exist at all (API routes exist,
  pages don't)
- No communities UI at all (full API, zero UI)
- No collaborator-invite UI on posts
- **Navbar is not responsive** — text-heavy, will overflow on small
  screens. This is Phase 0 in `ROADMAP.md`, fix before building more
  on top of it
- No toast/notification system exists yet — needed before most of the
  above can give real user feedback

## 6. Environment variables

See `.env.example` in the repo for the full list with sourcing notes
(which you generate yourself vs. pull from Google Cloud
Console/LinkedIn Developer Portal). Key ones for frontend work:
`NEXTAUTH_URL`, `NEXT_PUBLIC_*` (none defined yet — add if the
frontend needs any client-exposed config).

## 7. Known issues / standing decisions — don't relitigate these

- **No further DB/schema changes without explicit production-team
  sign-off.** This is a standing instruction, not a one-off. OAuth
  columns (`authprovider`, nullable `password`), LinkedIn posting
  columns, and the `orgpost` table are all documented in
  `prisma/SCHEMA_CHANGES.md` but NOT applied — LinkedIn posting and
  org-posts features are blocked on this.
- **Prisma import**: `import { PrismaClient } from "@/generated/prisma/client"`
  — NOT `@prisma/client`. This generator (`prisma-client`, not
  `prisma-client-js`) requires the `PrismaPg` driver adapter, already
  wired in `lib/db.ts`.
- **Avoid `db.$transaction` for read-only batches** — hit "unable to
  start a transaction in the given time" against the pooled
  `DATABASE_URL` (`listPosts` was fixed to use `Promise.all` instead).
  `createPost` still uses an interactive transaction since it
  genuinely needs atomicity — untested for the same failure, watch for
  it.
- **Next.js 16**: `params`/`searchParams` are `Promise`s in Server
  Components — always `await` them. `middleware.ts` is renamed
  `proxy.ts`, export is `export const proxy`, not `export default`.
- **`postmedia` is always `""`**, never null, never client-settable —
  no post media allowed currently, by product decision.
- **Comment deletion** is blocked (409) if the comment has replies —
  `postcomment`'s self-referencing FK is `onDelete: NoAction`. No
  soft-delete exists.
- **Reactions have no DB-level unique constraint** on (post, user) —
  enforced only in application code, small race-condition risk.
- **Admin gating** is an `ADMIN_EMAILS` env allowlist — `blogger` has
  no `role` column.
- Categories are many-to-many with posts (confirmed, not 1:1).
  Collaboration is two-tier: `post.primaryauthor` is the creator,
  everyone else added is a "secondary" `collaboration` row. Follow is
  instant/Instagram-style — no requests, no notifications.

## 8. Reference docs in the repo

- `API_ENDPOINTS.md` — every route, what it does, open questions
- `prisma/SCHEMA_CHANGES.md` — the pending-but-unapplied migration
- `ROADMAP.md` — prioritized next-phase plan (read this alongside this file)
- `PUSH_ORDER.md` — git history in commit-ready chunks (historical —
  everything in it has already been pushed as of this handoff)
- `FOLDER_STRUCTURE.md` — the original layer-based structure rationale

## 9. Commit convention (still in effect)

```
git commit -m "<type>(<optional-scope>): <short imperative description>

<body point one>;
<body point two>

Co-authored-by: Claude <claude@users.noreply.github.com>"
```

Small, frequent, meaningful chunks — not large batched commits.

## 10. Running locally

```bash
npm install
npx prisma generate
npm run dev
```

`DATABASE_URL` and `NEXTAUTH_SECRET` are the two non-optional env vars
to get a dev server running at all — see `.env.example`.
