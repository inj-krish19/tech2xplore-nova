# schema.prisma — consolidated changes for this round

Three things are asked for; only two need schema changes. Here's all of
it in one pass so you migrate once instead of three times.

---

## 1. OAuth support (Google + LinkedIn login) — schema change: YES

Same as discussed earlier, unchanged:

**`password` becomes optional:**

```prisma
  password                                   String?                  @db.VarChar(255)
```

**New enum, placed near your other enums:**

```prisma
enum auth_provider_enum {
  credentials
  google
  linkedin
}
```

**New field on `blogger`, right after `bloggerstatus`:**

```prisma
  authprovider                               auth_provider_enum?      @default(credentials)
```

---

## 2. "Post this to LinkedIn" button — schema change: YES

Posting to LinkedIn's API on the user's behalf (`w_member_social`) needs
two things the JWT session alone doesn't give you:

- The user's **LinkedIn person URN** (`urn:li:person:xxxx`) — required as
  the `author` field on every LinkedIn share API call.
- Their **LinkedIn access token** — LinkedIn's `w_member_social` product
  issues access tokens valid ~60 days with **no refresh token**, so it
  has to be persisted (re-auth is the only way to renew, there's no
  silent refresh flow like Google's).

**New fields on `blogger`** (nullable — only populated for users who
connected LinkedIn and granted posting permission, which may not be
100% of your LinkedIn-login users if you scope the OAuth request down
to login-only by default):

```prisma
  linkedinurn                                String?                  @db.VarChar(255)
  linkedinaccesstoken                        String?                  @db.VarChar(1000)
  linkedintokenexpiresat                     DateTime?                @db.Timestamp(6)
```

Storing a live access token in the same row as everything else is fine
at your current scale — just make sure this column is never selected
in any query that returns blogger data to the client (profile pages,
author bylines, etc.). Every `select` that touches `blogger` needs to
explicitly list fields rather than `select: true` on the whole model,
or this token leaks into a JSON response.

---

## 3. Org's own LinkedIn posts, fetched from links — schema change: YES

This is new storage, not a blogger column. Right now these 3–4
daily posts exist only as raw LinkedIn URLs with nothing captured
anywhere — to "fetch and show to the user" repeatably (not re-fetch
LinkedIn on every page load, and to know what's already been shown),
you need a cache table.

**New model:**

```prisma
model orgpost {
  orgpostid    BigInt    @id @default(autoincrement())
  sourceurl    String    @unique @db.VarChar(500)
  title        String?   @db.VarChar(255)
  content      String?   @db.Text
  coverimage   String?   @db.VarChar(500)
  publishedat  DateTime? @db.Timestamp(6)
  fetchedat    DateTime  @default(now()) @db.Timestamp(6)
  updatedat    DateTime  @default(now()) @updatedAt @db.Timestamp(6)
}
```

Notes on this one, worth deciding before you migrate:

- `sourceurl` is unique so re-submitting the same link is a no-op /
  upsert rather than a duplicate row.
- `content` as raw `@db.Text` (not `VarChar(3000)` like your `post`
  model) since scraped LinkedIn post bodies can run long and you don't
  control the length the way you do for in-app posts.
- Not linked to `blogger` at all — these aren't authored by a platform
  user, so there's no `authorid` to hang it off. If later you want
  "org account" to appear as a bylined identity, that's a separate
  decision (e.g. a reserved `blogger` row for the org) — not needed
  just to store and display these.
- No `status`/moderation field included since you said "show to the
  user" not "let them edit/approve" — say if that's wrong and I'll add
  a `draft/published` enum like `post` has.

---

## Migration + regenerate — run once, covers all three

```bash
npx prisma generate
npx prisma migrate dev --name oauth-linkedin-posting-orgposts
```

If `prisma/migrations` doesn't exist yet (first migration since your
original `db pull`), Prisma will prompt to baseline first — accept
that, it just snapshots current schema as migration zero without
touching data, then applies this migration on top.

---

# Schema change: post.shares

**Status:** approved — user confirmed via Phase 2 checkpoint (share count decision).

Add alongside `likes`/`dislikes` on the `post` model — same shape, same
default-zero counter pattern already used for reactions:

```diff
 model post {
   articleid              BigInt                   @id @default(autoincrement())
   commentscount          Int                      @default(0)
   createdat              DateTime?                @default(now()) @db.Timestamp(6)
   description            String                   @db.VarChar(3000)
   dislikes               Int                      @default(0)
   likes                  Int                      @default(0)
   postmedia              String?                  @db.VarChar(255)
   publishedat            DateTime?                @db.Timestamp(6)
+  shares                 Int                      @default(0)
   title                  String                   @db.VarChar(255)
   updatedat              DateTime?                @default(now()) @db.Timestamp(6)
   viewscount             Int                      @default(0)
   ...
 }
```

After editing `schema.prisma`:

```bash
npx prisma migrate dev --name add_post_shares
npx prisma generate
```

This is additive-only (new nullable-safe column with a default) — no
backfill needed, no existing column touched.

---

# Schema change: post.shares

```sql
-- Adds the columns the LinkedIn automation pipeline needs to persist a
-- full record of what it fetched/generated/published, instead of that
-- data being discarded after each cron run.
--
-- Assumption (flagging, not confirmed): orgpost is currently empty —
-- README describes it as unbuilt/unpopulated until this automation
-- pipeline runs. `provider` is added NOT NULL on that basis. If the
-- table already has rows, run this as two steps instead: add it
-- nullable, backfill a value, then ALTER COLUMN ... SET NOT NULL.

ALTER TABLE "orgpost"
  ADD COLUMN "provider" VARCHAR(20) NOT NULL,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "linkedinpostid" VARCHAR(255),
  ADD COLUMN "linkedinurl" VARCHAR(500);
```
