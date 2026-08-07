# Tech2Xplore Nova — Future Work

Living roadmap, written after the LinkedIn org-post automation pipeline
shipped end-to-end (fetch → normalize → image → Gemini → publish →
persist to `orgpost`, admin panel with all six sections, sticky sidebar,
pagination/search bugs fixed). This is the "what's next" doc — pick
items off the top of each tier when development resumes.

---

## Tier 1 — Next up

### 1. Unified search (the explicitly requested one)

Three surfaces, one underlying need — search across posts, people, and
communities, with posts additionally filterable/searchable by category
and keyword.

- **Post search**: title + content full-text match. Postgres has two
  reasonable paths here — `ILIKE`/`contains` (what every admin list
  already uses, zero new infra, fine at current scale) or real
  full-text search via `tsvector`/`pg_trgm` (better ranking, handles
  typos, needs a migration + index). Start with `contains` for parity
  with the admin pattern; upgrade only if search quality becomes a
  complaint.
- **Category/keyword-aware post search**: a search query should surface
  posts whose category or keyword _name_ matches too, not just title/
  content — e.g. searching "react" should return posts tagged with a
  "React" keyword even if "react" never appears in the title. This is
  the join the current `listPosts` doesn't do.
- **People search**: name/username/bio match — `discover` page already
  has the card UI and `listDiscoverableUsers`; this is closer to adding
  a `search` param to that function than building anything new.
- **Community search**: name/description match — same shape as
  `adminListCommunities`'s search, but for the public communities page
  instead of the admin one.
- **Where it lives**: likely a single `/search?q=...&type=posts|people|
communities` page with tabs, or a combined results page with three
  sections. Worth deciding before building — affects whether this is
  one new route or three.
- **Known gap this overlaps with**: the feed's keyword filter is
  already flagged as non-functional (`listPosts` never gained
  `keywordId` support) — fixing that and building keyword-aware search
  are close enough in scope that they should probably happen in the
  same pass.

---

## Tier 2 — Real gaps flagged during earlier sessions, never closed

- **Feed keyword filter is dead UI** — `FeedFilters.tsx` has a keyword
  select that does nothing; `listPosts` only supports `categoryId`.
  Fix alongside search (above) since they touch the same query.
- **Individual blogger LinkedIn share is UI-only** — `LinkedInShareButton.
tsx` calls an endpoint that was never built. The org-level automation
  pipeline now exists and could be the reference implementation for a
  simpler per-user version (same register-image → publish flow, but
  `author: urn:li:person:{blogger's linkedinurn}` instead of the
  organization urn, using each blogger's own `linkedinaccesstoken`
  instead of the fixed org token).
- **Banning doesn't revoke live sessions** — `setBloggerStatus` writes
  `bloggerstatus: "banned"` but a JWT issued before the ban stays valid
  until it expires (up to 30 days). Enforcing this needs a check in
  `proxy.ts` or the `session`/`jwt` callback in `auth.ts` — re-checking
  `bloggerstatus` on each request (or at least each token refresh) and
  forcing sign-out if banned.
- **Reactions have no DB-level unique constraint** on (post, user) —
  enforced only in application code. Small race-condition window for a
  double-like. A unique index migration closes it for good.
- **Comment deletion is blocked (409) if it has replies, no soft-delete
  exists** — a genuinely annoying UX dead-end for a user who wants to
  remove their own comment. Soft-delete (a `deletedat` column, render
  as "[deleted]" instead of actually removing the row) is the standard
  fix and keeps the reply thread intact.

---

## Tier 3 — LinkedIn automation hardening

Now that it's live, the failure modes worth building around:

- **Failure alerting** — right now a 400/500 just throws and the cron
  caller sees a failed HTTP call. Worth a Slack/email webhook on
  failure so a broken Gemini prompt or expired LinkedIn token doesn't
  go unnoticed for days.
- **Retry/backoff** — a single transient failure (rate limit, flaky
  provider API) currently means that day's post just doesn't happen.
  A retry with backoff, or at minimum a manual "retry this provider"
  button in the admin panel, would help.
- **Admin visibility into orgpost** — there's a public org-posts page
  now, but no admin management page for it (no edit, no manual
  re-trigger, no view of `provider`/`linkedinurl` in one place). Worth
  a sixth admin section mirroring the pattern used for categories/
  keywords/communities.
- **Token expiry handling** — `linkedintokenexpiresat` is now being
  written on every LinkedIn OAuth login (per-user), but nothing reads
  it yet to warn about or refresh an expiring token. For the org-level
  automation token specifically, LinkedIn org tokens are typically
  longer-lived, but worth confirming the refresh story before it
  expires unexpectedly mid-cron-run.
- **Prompt iteration** — the sanitizer added this session is a safety
  net (strips Markdown, caps length, keeps only the first "option" if
  Gemini ignores instructions), not a substitute for a tighter
  `GEMINI_PROMPT`. Worth a pass on prompt wording once there's a
  handful of real published posts to look back at.
- **CORS** — you mentioned this is coming; flagging that the
  automation route in particular should probably stay closed to
  browser origins entirely (it's Basic-Auth-gated and cron-only), while
  the rest of the public API needs whatever origin policy the
  frontend actually requires.

---

## Tier 4 — Product features (net-new, no prior flag)

- **Notifications** — follow is "instant, no requests" per the
  standing design decision, but there's no notification of any kind
  (new follower, comment on your post, reaction, collaborator invite).
  Even an in-app notification bell with a simple `notification` table
  would close a real gap — right now a blogger only finds out about
  activity by checking manually.
- **Post drafts / autosave** — `poststatus` already has a `draft` value
  in the schema, but confirm the editor actually autosaves to draft
  rather than requiring an explicit publish-or-lose-it flow.
- **Rich content in posts** — worth checking whether `PostEditor.tsx`
  is plain textarea or markdown/rich-text today; `postmedia` is
  hardcoded to `""` by product decision (no images in post body), so
  this is scoped to text formatting only unless that decision changes.
- **Blogger analytics** — a simple "views over time" / "top posts by
  engagement" view for a blogger's own profile, using data that's
  already being tracked (views, likes, comments, shares) but never
  aggregated into a dashboard.
- **Private/invite-only communities** — `membership.membershiprole` is
  already admin/member; a `communityvisibility` (public/private) column
  plus an invite flow would be a natural extension.
- **Direct messages** — bigger lift, no existing schema support, would
  need its own model. Lower priority than the above unless it's a
  product priority.

---

## Tier 5 — Infrastructure / quality

- **Automated tests** — no test suite exists yet anywhere in the repo
  as far as this session's context shows. Even a thin layer (service-
  function unit tests with a test DB, or just the pure functions like
  `sanitizeForLinkedIn` and the article normalizers) would catch
  regressions before they reach a cron job at 6am.
- **CI pipeline** — lint + typecheck + test on every push, since none
  of that currently seems to be enforced before merge.
- **SEO basics** — meta tags, OpenGraph images (post cover images
  already exist, just need wiring into `<meta>`), sitemap.xml,
  robots.txt. Free wins for a public blogging platform.
- **Accessibility pass** — admin tables, forms, and the theme toggle
  are all custom-built; worth a quick audit (focus states, aria labels,
  contrast in both themes) since none of this went through a
  component library with accessibility baked in.

---

## Notes for whoever picks this up

- Session/schema conventions established so far: route handlers stay
  thin, business logic in `lib/services/`, BigInt fields always
  serialized to string before crossing into JSON responses, admin
  routes use `requireAdmin()` (session-based), cron-triggered routes
  use `requireCronBasicAuth()` (Basic Auth from env) — pick the right
  one for any new route rather than defaulting to session auth.
- When touching `listPosts`/`FeedFilters` for the keyword-filter fix,
  the search feature above almost certainly wants the same query
  changes — worth doing both in one pass rather than two.
- Nothing in this doc has been scoped into tasks/estimates yet — it's
  a menu, not a sprint plan. Pick based on what's most annoying to not
  have vs. most interesting to build.
