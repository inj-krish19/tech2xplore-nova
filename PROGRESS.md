# Tech2Xplore Nova — Frontend Session Handoff

Paste this into a new chat, alongside a fresh `ROADMAP.md` for the admin
panel + remaining work, to continue. This chat covered **frontend
build-out on top of an already-built backend** (routes/services from a
prior backend-focused chat) — this doc is the frontend session's memory,
not the original project brief.

---

## 1. What this project is

**Tech2Xplore** is two things in one app:

1. A blogging/community platform for developers — write posts, follow
   writers, react/comment, join communities.
2. A services & consulting company (same team/brand) — the homepage
   sells both.

Rebuild of a legacy Spring Boot + Thymeleaf app, now Next.js. Old repo
kept untouched as fallback: `github.com/inj-krish19/Tech2Xplore-nova`.

## 2. Tech stack (confirmed, in use)

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** — CSS-first config in `globals.css`, no
  `tailwind.config.ts`
- **Prisma** — `prisma-client` generator (not `prisma-client-js`),
  `PrismaPg` driver adapter, client at `src/generated/prisma/client`
- **Auth.js v5** — JWT sessions. **Real session shape: `session.user.id`**
  holds the blogger's `authorid` as a string — NOT `session.user.authorid`.
  This tripped up a whole batch of pages earlier in this session (see §6).
- **Zustand** — `authStore`, `themeStore` (persisted to localStorage key
  `"theme"`)
- **Zod** — validation per route, one schema file per domain in
  `lib/validations/`
- **react-icons** — used throughout (`Fi*` mainly, `Fa*` for brand icons
  like LinkedIn/GitHub). No `lucide-react` in use despite it being
  available.
- **motion** (framer-motion rename) — `Reveal` (fade+rise+scale
  scroll-in) and `WordsPullUp` (word-by-word headline) in
  `components/motion/`, reused everywhere instead of one-off animations

## 3. Design system

Light (sky/azure) vs dark (violet night) — same brand, different mood.
Tokens live in `globals.css`: `bg-background`, `text-foreground`,
`bg-accent`, `text-muted-foreground`, `border-border`, `bg-card` — never
raw Tailwind grays/blues, or theme switching breaks for that component.

Dark mode is class-based (`.dark` on `<html>`), driven by `themeStore`,
NOT `prefers-color-scheme`.

Three fonts via `next/font/google`: **Space Grotesk** (display/headings,
`font-display`), **Inter** (body, default), **JetBrains Mono**
(kickers/labels, `.font-mono-kicker` class).

Utilities: `.tilt-card` (hover tilt), `.hero-glow` (pulsing radial
gradient hero background).

**Standing rule, still in effect:** every new component, however small,
gets built responsive and on-theme from the start — not retrofitted.

## 4. Folder structure additions this session

Layer-based (not feature-based), matching the existing pattern:

```
├── prisma/
│   ├── SCHEMA_CHANGES.md
│   └── schema.prisma
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   ├── password/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── set-password/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   ├── (main)/
│   │   │   ├── category/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── communities/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── discover/
│   │   │   │   └── page.tsx
│   │   │   ├── feed/
│   │   │   │   └── page.tsx
│   │   │   ├── keyword/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── org-posts/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── post/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── [username]/
│   │   │   │       ├── followers/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── following/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── check-email/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── set-password/
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify-email/
│   │   │   │       └── route.ts
│   │   │   ├── categories/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── posts/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── recent-authors/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── comments/
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── communities/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── members/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── membership/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── health/
│   │   │   │   └── route.ts
│   │   │   ├── keywords/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── posts/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── recent-authors/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── posts/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── collaborators/
│   │   │   │   │   │   ├── [authorId]/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── comments/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── react/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── related/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── share/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── users/
│   │   │       ├── [username]/
│   │   │       │   ├── follow/
│   │   │       │   │   └── route.ts
│   │   │       │   ├── followers/
│   │   │       │   │   └── route.ts
│   │   │       │   ├── following/
│   │   │       │   │   └── route.ts
│   │   │       │   └── related/
│   │   │       │       └── route.ts
│   │   │       └── me/
│   │   │           ├── avatar/
│   │   │           │   └── route.ts
│   │   │           ├── avatar-options/
│   │   │           │   └── route.ts
│   │   │           ├── follow-status/
│   │   │           │   └── route.ts
│   │   │           └── route.ts
│   │   ├── home/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── PostModerationTable.tsx
│   │   ├── auth/
│   │   │   ├── EmailStepForm.tsx
│   │   │   ├── LoginPasswordForm.tsx
│   │   │   ├── OAuthButtons.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── SessionSync.tsx
│   │   │   └── SetPasswordForm.tsx
│   │   ├── blog/
│   │   │   ├── CommentThread.tsx
│   │   │   ├── PostCard.tsx
│   │   │   └── PostEditor.tsx
│   │   ├── community/
│   │   │   └── CommunityJoinButton.tsx
│   │   ├── feed/
│   │   │   ├── FeedFilters.tsx
│   │   │   └── Pagination.tsx
│   │   ├── home/
│   │   │   ├── FaqSection.tsx
│   │   │   ├── HeroToggle.tsx
│   │   │   ├── LoggedInHome.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   └── StatsSection.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── HeaderNav.tsx
│   │   ├── motion/
│   │   │   ├── Reveal.tsx
│   │   │   └── WordsPullUp.tsx
│   │   ├── post/
│   │   │   ├── CategoryKeywordPicker.tsx
│   │   │   ├── CollaboratorPanel.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── LinkedInShareButton.tsx
│   │   │   ├── PostEngagement.tsx
│   │   │   └── RelatedAndCollaborators.tsx
│   │   ├── profile/
│   │   │   ├── AvatarPicker.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   ├── RelatedUsers.tsx
│   │   │   └── SettingsForm.tsx
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ThemeToggle.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── Toast.tsx
│   ├── hooks/
│   │   └── usePromiseToast.ts
│   ├── lib/
│   │   ├── constants/
│   │   │   └── avatar-presets.ts
│   │   ├── services/
│   │   │   ├── auth-service.ts
│   │   │   ├── avatar-service.ts
│   │   │   ├── category-service.ts
│   │   │   ├── collaboration-service.ts
│   │   │   ├── comment-service.ts
│   │   │   ├── community-service.ts
│   │   │   ├── connection-service.ts
│   │   │   ├── keyword-service.ts
│   │   │   ├── linkedin-service.ts
│   │   │   ├── orgpost-service.ts
│   │   │   ├── post-service.ts
│   │   │   ├── reaction-service.ts
│   │   │   ├── share-service.ts
│   │   │   └── user-service.ts
│   │   ├── utils/
│   │   │   └── read-time.ts
│   │   ├── validations/
│   │   │   ├── auth.ts
│   │   │   ├── avatar.ts
│   │   │   ├── category.ts
│   │   │   ├── collaboration.ts
│   │   │   ├── comment.ts
│   │   │   ├── community.ts
│   │   │   ├── keyword.ts
│   │   │   ├── post.ts
│   │   │   ├── reaction.ts
│   │   │   └── user.ts
│   │   ├── api-client.ts
│   │   ├── api-response.ts
│   │   ├── auth-guard.ts
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── env.ts
│   │   ├── generate-username.ts
│   │   ├── mail.ts
│   │   ├── rate-limit.ts
│   │   ├── utils.ts
│   │   └── verification-token.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── themeStore.ts
│   ├── types/
│   │   └── next-auth.d.ts
│   └── proxy.ts
├── .env.example
├── .gitignore
├── AGENTS.md
├── API_ENDPOINTS.md
├── CLAUDE.md
├── components.json
├── eslint.config.mjs
├── FOLDER_STRUCTURE.md
├── LICENSE
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
├── ROADMAP.md
├── skills-lock.json
└── tsconfig.json

```

## 5. What's fully working (built + confirmed against real files)

- Toast system, wired into `providers.tsx`
- Header/Footer redesign, session-aware, responsive
- Homepage: marketing (audience toggle) for logged-out, dashboard for
  logged-in
- Post creation with category/keyword picker
- Post detail: reactions (like/dislike, optimistic, correct
  clear-via-DELETE semantics), threaded comments (real tree from
  `comment-service.ts`, avatar+profile links), share count, read-time,
  view count, collaborator invite/remove (primary-author-gated),
  LinkedIn share button (UI only — see §7)
- Feed: category filter + pagination (keyword filter has **no
  server-side effect** — `listPosts` only supports `categoryId`, not
  `keywordId` — flagged, not fixed, needs a decision)
- Profile: follow/unfollow, avatar picker (via real
  `lib/constants/avatar-presets.ts`, not a fake endpoint), settings page,
  public followers/following pages
- Discover people page — bio, post count, likes received, follow button
- Communities: list/detail/create, join/leave
- Category/keyword pages
- Org posts (public, no login gate) — list + detail

## 6. Bugs hit and fixed this session (read before debugging anything similar)

1. **RSC function-as-children** — a Server Component can't pass a
   function as `children` into a Client Component. Fixed by passing
   pre-built JSX via named props instead of a render-prop.
2. **`session.user.authorid` doesn't exist** — real field is
   `session.user.id`. This was wrong in `post/[id]/page.tsx`,
   `profile/[username]/page.tsx`, `communities/[id]/page.tsx`,
   `CommentSection.tsx` — fixed in all four. **If a new page reads the
   viewer's ID from session, it's `.id`, not `.authorid`.**
3. **`apiFetch` wasn't unwrapping the API envelope** — every route wraps
   responses via `apiSuccess()`/`apiError()` as `{success, data}` /
   `{success, error}`. `apiFetch` in `lib/api-client.ts` now unwraps
   `data` correctly. This one bug was the root cause of several
   different-looking symptoms (categories not loading, comments
   crashing) — if something "returns the wrong shape," check this file
   first before assuming the route is broken.
4. **Postgres auto-increment sequence desync** — hit on `connection`
   (follow) and `postinteraction` (react), both `P2002` unique
   constraint errors on an autoincrement PK. Not a code bug — the
   sequence fell behind the table's actual max ID (likely from seeded
   data bypassing `nextval()`). Fixed with `setval(...)` SQL, and a
   `prisma/check-sequences.sql` script was written to check every table
   at once rather than hitting each one blind.
5. **`AvatarPicker` fetched a nonexistent endpoint** — there's no
   `/api/users/me/avatar-options` route; presets are a hardcoded file
   (`lib/constants/avatar-presets.ts`) per the backend README. Fixed to
   take `presets` as a prop instead of fetching.

## 7. Still open / assumed — check before trusting

- **LinkedIn share button** — `components/post/LinkedInShareButton.tsx`
  calls an invented `POST /api/posts/[id]/linkedin-share` endpoint that
  doesn't exist. No `linkedin-service.ts` was ever shared in this chat —
  the actual LinkedIn UGC Post API call and token-refresh logic
  (`linkedintokenexpiresat`) isn't built. UI-only.
- **`AVATAR_PRESETS` import** — guessed export name/shape
  (`string[]` named `AVATAR_PRESETS`) from
  `lib/constants/avatar-presets.ts`. Never confirmed against the real
  file. Check `profile/[username]/page.tsx` and
  `profile/settings/page.tsx` if this doesn't compile.
- **Feed keyword filter** — UI exists in `FeedFilters.tsx` but
  `listPosts` doesn't support `keywordId`. Needs a decision: add keyword
  filtering to the real `listPosts` where-clause, or remove the keyword
  select from the filter bar.
- **Community/collaborator API routes** — service layer
  (`community-service.ts`, `collaboration-service.ts`) is real and
  confirmed, but the actual route handlers
  (`/api/communities/[id]/membership`, `/api/posts/[id]/collaborators`)
  were never pasted into this chat — still assumed shapes in the
  frontend calls.
- **Admin panel — in progress, not finished.** Requested at the very end
  of this session:
  - Existing admin: Sidebar (no theme toggle wired in it), Overview page
    built, Posts/Users/Categories sections exist as nav entries but have
    no actual page content yet
  - Requested additions: Communities and Keywords sections in the
    sidebar; pagination + search on every admin list; a way for admin to
    take down (delete) posts; admin API routes under `/api/admin/` don't
    exist yet and need to be created from scratch
  - **Only one file was completed before this session ended:**
    `lib/services/category-service.ts` was extended with
    `adminListCategories(page, pageSize, search)` (paginated + name
    search) and `deleteCategory(categoryId)` (blocks deletion with an
    `in_use` status if any posts still reference it, rather than letting
    the FK constraint 500). Full file content is current as of this
    handoff.
  - **Not started yet:** the equivalent admin list/delete functions for
    `keyword-service.ts` and `community-service.ts`; `blogger`
    ban/unban support in `user-service.ts`; every `/api/admin/*` route
    (posts, users, categories, keywords, communities — list + take-down
    actions); every admin page beyond Overview; sidebar update (add
    Communities/Keywords nav items, add a working `ThemeToggle` — the
    component already exists at `components/theme/ThemeToggle.tsx` and
    just needs to be imported into the sidebar, not rebuilt)

## 8. Conventions to carry into the next chat

**Commit message format:**

```
<type>(<optional-scope>): <short imperative description>

<body point one>;
<body point two>

Co-authored-by: Claude <claude@users.noreply.github.com>
```

**Delivery:** every file via the artifact/file panel (not zipped, not
pasted inline as chat text). Code and its matching commit message
interleaved — one file, one commit, next file, next commit — not all
code first then all commits at the end.

**When something is assumed** (endpoint shape, field name, service
function signature) because the real file wasn't pasted into the chat:
say so inline, don't silently guess and move on — this session's bugs
came almost entirely from unconfirmed assumptions that could have been
caught earlier by asking for the real file first.
