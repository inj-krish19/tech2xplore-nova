# Folder structure — layer-based, production target

Keeps your `lib/ store/ components/` split as-is, and fills in `app/`
properly. The SOLID angle here isn't folder names — it's that each
route handler stays thin (parse input → call a service function → shape
response), so the actual logic is unit-testable without spinning up
Next.js at all, and swapping a piece (e.g. Nodemailer → Resend later)
touches one file, not every route that happens to send email.

```
src/
├── app/
│   ├── (auth)/                      route group — no auth required
│   │   ├── login/
│   │   │   ├── page.tsx             step 1: email input only
│   │   │   └── password/
│   │   │       └── page.tsx         step 2: password input (email in query/cookie)
│   │   ├── register/
│   │   │   └── page.tsx             pre-filled email from step 1 if it came from there
│   │   ├── verify-email/
│   │   │   └── page.tsx             "check your inbox" / expired-link UI (backend already redirects here)
│   │   └── set-password/
│   │       └── page.tsx             OAuth user adding a password — requires active session
│   │
│   ├── (main)/                      authenticated app shell
│   │   ├── layout.tsx               shared nav, SessionSync + ThemeProvider mounted here
│   │   ├── feed/page.tsx
│   │   ├── post/[slug]/page.tsx
│   │   ├── post/new/page.tsx
│   │   └── profile/[username]/page.tsx
│   │
│   ├── admin/
│   │   └── page.tsx                 moderation panel (route already gated by middleware.ts)
│   │
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts
│       │   ├── register/route.ts
│       │   ├── verify-email/route.ts
│       │   ├── check-email/route.ts        NEW — step 1 of login flow
│       │   └── set-password/route.ts       NEW — OAuth user adding a password
│       ├── posts/
│       │   ├── route.ts             GET (list/search) + POST (create)
│       │   └── [id]/route.ts        GET/PATCH/DELETE one post
│       ├── linkedin/
│       │   └── post/route.ts        "post this to LinkedIn" button (upcoming feature)
│       ├── org-posts/
│       │   └── route.ts             fetch/list cached org LinkedIn posts (upcoming feature)
│       └── health/route.ts
│
├── components/
│   ├── ui/                          shadcn-generated, don't hand-edit
│   ├── auth/                        SessionSync, LoginForm, EmailStepForm, etc.
│   ├── theme/                       ThemeProvider, ThemeToggle
│   ├── blog/                        PostCard, PostEditor, CommentThread
│   └── admin/
│
├── lib/
│   ├── db.ts
│   ├── env.ts
│   ├── auth.ts
│   ├── mail.ts
│   ├── rate-limit.ts
│   ├── api-response.ts
│   ├── generate-username.ts
│   ├── verification-token.ts
│   ├── validations/                 one file per domain: auth.ts, post.ts, comment.ts
│   └── services/                    NEW — the actual business logic, called BY routes
│       ├── auth-service.ts          findOrCreateOAuthUser, checkEmailStatus, setPassword, etc.
│       ├── post-service.ts
│       └── linkedin-service.ts      NEW — LinkedIn API calls (post share, fetch org post content)
│
├── store/
│   ├── authStore.ts
│   └── themeStore.ts
│
└── types/
    └── next-auth.d.ts
```

## The one real principle worth calling out

**Route handlers don't contain business logic — they call a service
function and shape the HTTP response.** e.g. `check-email/route.ts`
should be ~10 lines: parse body with zod, call
`authService.checkEmailStatus(email)`, return `apiSuccess(result)`. All
the "does this email exist, do they have a password, what should the
frontend do next" logic lives in `lib/services/auth-service.ts` where
it can be unit tested and reused (e.g. the same check might get reused
by an admin "impersonate user" tool later without duplicating the
query logic inside a route file).

This is the actual scalability lever — not the folder names.
