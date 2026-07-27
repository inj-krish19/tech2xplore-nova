# ROADMAP.md — what's next, in priority order

## Where things actually stand

Backend is ahead of frontend right now — most of the API surface
exists (auth, posts, categories, keywords, comments, reactions,
collaboration, follow, communities, avatar, share, related content)
but very little of it is wired into the UI yet. `post/[id]/page.tsx`'s
`CommentThread`, for instance, renders with a local `onReply` prop that
doesn't call the real `/api/posts/[id]/comments` endpoint. That gap —
built API, unwired frontend — is the main thing this phase closes.

On the two things you flagged as missing:

- **View count**: already exists and already increments (`post.viewscount`,
  fired from `post/[id]/page.tsx`) — but it counts every page load,
  including refreshes and the author's own visits. No dedup logic.
  Worth deciding whether that's good enough or needs a real fix
  (session/IP-based dedup) — flagged in Phase 2 below.
- **Share count**: genuinely not tracked anywhere — the `/share` route
  returns a URL, writes nothing. Still an open question from before.
- **Read time**: not built at all. This one's cheap — word-count-based
  estimate computed at render time, no schema change, no DB write.
  Included in Phase 2.

---

## Phase 0 — Navbar responsiveness (do this first, blocks everything else)

Every page built so far shares the `Header` component, so fixing it
once fixes it everywhere instead of retrofitting per-page later.

- Replace text nav items with icon+label that collapses to icon-only
  below `md`, or a hamburger/sheet menu on mobile instead of squeezing
  text
- "Write" / "Get started" / "Log in" buttons need a compact mobile
  form (icon buttons or a slide-out menu) instead of wrapping/
  overflowing
- Same pass on `Footer` — 4-column grid probably needs to collapse
  more gracefully than 2-col at the `sm` breakpoint it's on now
- Establish the actual responsive pattern here (breakpoints, spacing
  scale, icon-vs-text rules) so every component after this follows the
  same rules instead of each page inventing its own mobile behavior

## Phase 1 — Core loop, frontend wired to the real API

This is the biggest chunk. Roughly in the order a reader/writer would
actually hit these:

1. **Toast/notification system** — doesn't exist yet. Every wiring
   task below needs a consistent way to show "followed!", "comment
   posted", "failed to react, try again" etc. Building this first
   avoids bolting inconsistent one-off feedback onto each component.
2. **Post creation form** → real category/keyword picker (currently a
   plain textarea with no category/keyword UI at all), wired to
   `POST /api/posts`
3. **Post detail page** → reactions (like/dislike buttons wired to
   `/react`), comments (real threaded post/reply wired to
   `/api/posts/[id]/comments`), share button, related posts strip,
   collaborator list
4. **Feed** → category/keyword filter UI, pagination controls (API
   supports both, UI doesn't expose either yet)
5. **Profile page** → follow/unfollow button wired to `/follow`,
   avatar picker wired to `/avatar-options` + `/avatar`, related-users
   ("people you might follow") strip
6. **Category/keyword pages** — don't exist as pages yet at all, only
   as API routes. Need `app/(main)/category/[id]/page.tsx` and the
   keyword equivalent, each showing that category/keyword's posts +
   recent authors

## Phase 2 — Read/view/share analytics

- **Read-time estimate**: word count / average reading speed, computed
  at render, no schema change — cheap, do this early in this phase
- **View count dedup**: decide whether raw increment-per-load is
  acceptable or needs real dedup (e.g. don't increment for the
  post's own author, or session-based "already counted this visit")
- **Share count**: decide if it's wanted at all; if yes, it's a schema
  addition (a `shares` counter column, similar to `likes`/`dislikes`)
  — needs the production sign-off the standing instruction requires

## Phase 3 — Communities & collaboration UI

Both have full APIs, zero UI:

- Community list/detail/create pages, join/leave button
- "Invite a collaborator" flow on a post (search by username, add via
  `/api/posts/[id]/collaborators`), collaborator list shown on the
  post itself

## Phase 4 — LinkedIn posting + org-posts

Blocked on the still-pending migration (linkedinurn/
linkedinaccesstoken/linkedintokenexpiresat, `orgpost` table) — picked
up the moment that's approved and run, not before.

## Phase 5 — PM-requested pages

Lowest priority per your note, sequenced last on purpose:

1. **About / Team page**
2. **Quotation page** — reading this as a "request a quote" form for
   the services/consulting side (name, project type, budget range,
   timeline, message) rather than a literal pricing page — confirm
   that's the right read before I build it
3. **Clients / testimonials page** — expands what's currently just a
   3-card section on the homepage into its own dedicated page with
   fuller case studies + testimonial quotes

---

## Standing rule going forward

Every new component from here — page, section, or as small as a
single toast — gets built responsive and on-theme from the start, not
retrofitted after. Phase 0 exists specifically to stop that
retrofit pattern before Phase 1's volume of new components begins.
