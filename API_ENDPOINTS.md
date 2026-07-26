# API_ENDPOINTS.md — full route plan for this feature round

Three earlier open questions are now resolved — decisions below.

## Decisions confirmed — no longer open

1. **Categories are many-to-many, not 1:1.** The "1:1 strict" read was
   based on the old legacy app and isn't actually wanted — a post can
   have multiple categories, same as the schema already supports via
   `postcategoryassignment`. No schema change, no behavior change from
   what was already built in `post-service.ts`.

2. **Collaboration stays two-tier, cheap path confirmed.**
   `post.primaryauthor` is the creator — that's it, a fact. Everyone
   else added afterward is a `collaboration` row and is explicitly
   "secondary" (your word). No restructure needed.

3. **Follow is instant, Instagram-style — no requests, no
   notifications.** Every `connection` row gets created with
   `connectionstatus: "accepted"` directly; the `pending`/`rejected`
   states in the enum stay unused for now. No approval flow, no
   notification system for this.

**Standing instruction:** no further schema/DB changes without an
explicit production-team call — everything below is built against the
schema exactly as it stands today.

**`postmedia` going to empty string, not null** — application-layer
default (`postmedia: ""` on create), not a schema change.

---

## Auth (already built — recap, not new)

| Method | Route                     | Purpose                                                    |
| ------ | ------------------------- | ---------------------------------------------------------- |
| POST   | `/api/auth/register`      | Legacy signup, sends magic link                            |
| GET    | `/api/auth/verify-email`  | Verifies magic link, creates blogger row                   |
| POST   | `/api/auth/check-email`   | Step 1 of login — routes to register/password/set-password |
| POST   | `/api/auth/set-password`  | OAuth-only user adds a password                            |
| \*     | `/api/auth/[...nextauth]` | Auth.js — credentials + Google + LinkedIn                  |

## Profile & avatar

| Method | Route                          | Purpose                                                                                               |
| ------ | ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| GET    | `/api/users/[username]`        | Public profile: bio, stats, recent posts                                                              |
| PATCH  | `/api/users/me`                | Update own bio, name, sociallinks                                                                     |
| GET    | `/api/users/me/avatar-options` | Returns the 5–6 preset avatars + the user's Google/LinkedIn picture URL if they have one on file      |
| PATCH  | `/api/users/me/avatar`         | Set `profilepicture` to a chosen preset URL or their OAuth picture — no file upload, no cloud storage |

## Follow / Connections (`connection` table)

| Method | Route                                   | Purpose                                              |
| ------ | --------------------------------------- | ---------------------------------------------------- |
| POST   | `/api/users/[username]/follow`          | Follow a user — creates a `connection` row           |
| DELETE | `/api/users/[username]/follow`          | Unfollow — removes the row                           |
| GET    | `/api/users/[username]/followers`       | List who follows this user                           |
| GET    | `/api/users/[username]/following`       | List who this user follows                           |
| GET    | `/api/users/me/follow-status?username=` | Quick check for a profile page's follow button state |

## Communities (`community` + `membership` tables)

| Method | Route                           | Purpose                                     |
| ------ | ------------------------------- | ------------------------------------------- |
| GET    | `/api/communities`              | List communities, paginated                 |
| POST   | `/api/communities`              | Create a community                          |
| GET    | `/api/communities/[id]`         | Community detail + member count             |
| PATCH  | `/api/communities/[id]`         | Update — creator/admin membership role only |
| POST   | `/api/communities/[id]/join`    | Enroll — creates a `membership` row         |
| DELETE | `/api/communities/[id]/join`    | Leave — removes the row                     |
| GET    | `/api/communities/[id]/members` | List members + their `membershiprole`       |

## Posts (core CRUD — extends what `post-service.ts` already has)

| Method | Route                   | Purpose                                                                                                                                                                                                                                                                                                                                                       |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/posts`            | List/search/filter (status, author, category, keyword, search)                                                                                                                                                                                                                                                                                                |
| POST   | `/api/posts`            | Create — `postmedia` always `""`, one or more `categoryIds`, 0+ `keywordIds`                                                                                                                                                                                                                                                                                  |
| GET    | `/api/posts/[id]`       | Detail                                                                                                                                                                                                                                                                                                                                                        |
| PATCH  | `/api/posts/[id]`       | Update — primary author or any secondary collaborator can edit                                                                                                                                                                                                                                                                                                |
| DELETE | `/api/posts/[id]`       | Delete — assuming primary-author-only for now (not yet confirmed) since deletion is destructive; flag if secondary collaborators should be able to delete too                                                                                                                                                                                                 |
| POST   | `/api/posts/[id]/share` | Increment a share count / return a shareable link — needs a decision: does "share" just mean "copy link," or does it write a record anywhere? No `share` concept exists in the schema yet. Simplest: no DB write, just returns the canonical post URL for the frontend to copy/share via the Web Share API. Say if you want shares tracked/counted somewhere. |

## Categories & Keywords — CRUD + their dedicated pages

| Method | Route                                 | Purpose                                                                                                             |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/categories`                     | List all categories                                                                                                 |
| POST   | `/api/categories`                     | Create (admin)                                                                                                      |
| GET    | `/api/categories/[id]`                | Category detail                                                                                                     |
| GET    | `/api/categories/[id]/posts`          | Posts in this category, paginated                                                                                   |
| GET    | `/api/categories/[id]/recent-authors` | People who recently posted in this category — backs the "some people who recently posted" part of the category page |
| GET    | `/api/keywords`                       | List all keywords                                                                                                   |
| POST   | `/api/keywords`                       | Create (admin)                                                                                                      |
| GET    | `/api/keywords/[id]`                  | Keyword detail                                                                                                      |
| GET    | `/api/keywords/[id]/posts`            | Posts tagged with this keyword                                                                                      |
| GET    | `/api/keywords/[id]/recent-authors`   | Same idea as categories                                                                                             |

## Comments & replies (`postcomment` — already partially built)

| Method | Route                      | Purpose                                                  |
| ------ | -------------------------- | -------------------------------------------------------- |
| GET    | `/api/posts/[id]/comments` | Threaded comments for a post                             |
| POST   | `/api/posts/[id]/comments` | New comment or reply (`parentcommentid` present = reply) |
| PATCH  | `/api/comments/[id]`       | Edit own comment                                         |
| DELETE | `/api/comments/[id]`       | Delete own comment (or admin)                            |

## Reactions — like/dislike (`postinteraction`)

| Method | Route                   | Purpose                                                                                            |
| ------ | ----------------------- | -------------------------------------------------------------------------------------------------- |
| POST   | `/api/posts/[id]/react` | Body `{ type: "like" \| "dislike" }` — upserts (switching from like->dislike replaces, not stacks) |
| DELETE | `/api/posts/[id]/react` | Remove own reaction                                                                                |

## Collaboration — multi-owner posts (`collaboration`)

| Method | Route                                      | Purpose                                                                             |
| ------ | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| GET    | `/api/posts/[id]/collaborators`            | List secondary owners of a post (creator is `post.primaryauthor`, not in this list) |
| POST   | `/api/posts/[id]/collaborators`            | Add a secondary owner — primary author only                                         |
| DELETE | `/api/posts/[id]/collaborators/[authorId]` | Remove a secondary owner — primary author only                                      |

## Related content

| Method | Route                           | Purpose                                                                                |
| ------ | ------------------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/api/posts/[id]/related`       | Related posts — by shared category/keywords, excluding the post itself                 |
| GET    | `/api/users/[username]/related` | "People you might follow" — based on shared categories they post in, or mutual follows |

---

## Suggested build order

Roughly dependency-ordered — categories/keywords need to exist before
post creation can require them meaningfully, reactions/comments/
collaboration all hang off a working post CRUD, and related-content
routes want real data to query against:

1. Categories + Keywords CRUD (small, unblocks everything else)
2. Posts CRUD (extends existing `post-service.ts`, applies the
   `postmedia: ""` and category/keyword rules)
3. Comments + Reactions (straightforward, well-scoped)
4. Collaboration
5. Follow/Connections
6. Communities/Membership
7. Avatar presets (independent of everything else, can slot in anytime)
8. Related content (wants the others in place to be meaningful)

Say the word on the three open questions above and I'll start on #1.
