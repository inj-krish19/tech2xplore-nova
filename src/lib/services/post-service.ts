import { db } from "@/lib/db";
import type { CreatePostInput, UpdatePostInput, ListPostsQuery } from "@/lib/validations/post";

export async function createPost(authorId: bigint, input: CreatePostInput) {
  const { categoryIds, keywordIds, ...postData } = input;

  return db.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        ...postData,
        postmedia: "",
        primaryauthor: authorId,
        publishedat: postData.poststatus === "published" ? new Date() : null,
      },
    });

    if (categoryIds?.length) {
      await tx.postcategoryassignment.createMany({
        data: categoryIds.map((categoryid) => ({
          articleid: post.articleid,
          categoryid: BigInt(categoryid),
          assignedby: authorId,
          createdat: new Date(),
        })),
      });
    }

    if (keywordIds?.length) {
      await tx.keywordassignment.createMany({
        data: keywordIds.map((keywordid) => ({
          articleid: post.articleid,
          keywordid: BigInt(keywordid),
          assignedby: authorId,
          createdat: new Date(),
        })),
      });
    }

    return post;
  });
}

export async function getPostById(articleId: bigint) {
  return db.post.findUnique({
    where: { articleid: articleId },
    include: {
      blogger: { select: { authorid: true, name: true, username: true, profilepicture: true } },
      postcategoryassignment: { include: { category: true } },
      keywordassignment: { include: { keyword: true } },
    },
  });
}

/** Fire-and-forget from a page view — don't await this in the request path that renders the page. */
export async function incrementViewCount(articleId: bigint) {
  return db.post.update({
    where: { articleid: articleId },
    data: { viewscount: { increment: 1 } },
  });
}

export async function listPosts(query: ListPostsQuery) {
  const { page, pageSize, status, authorId, categoryId, keywordId, search } = query;

  const where = {
    ...(status && { poststatus: status }),
    ...(authorId && { primaryauthor: BigInt(authorId) }),
    ...(categoryId && {
      postcategoryassignment: { some: { categoryid: BigInt(categoryId) } },
    }),
    // Was accepted by the query schema but silently ignored here before —
    // feed/page.tsx has been passing it through an `as never` cast
    // because this where clause never read it.
    ...(keywordId && {
      keywordassignment: { some: { keywordid: BigInt(keywordId) } },
    }),
    ...(search && {
      // A search term now also matches a category/keyword *name* the
      // post is tagged with, not just its own title/description — e.g.
      // searching "react" surfaces posts tagged with a "React" keyword
      // even if that word never appears in the post's own text.
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        {
          postcategoryassignment: {
            some: { category: { name: { contains: search, mode: "insensitive" as const } } },
          },
        },
        {
          keywordassignment: {
            some: { keyword: { name: { contains: search, mode: "insensitive" as const } } },
          },
        },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    db.post.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdat: "desc" },
      include: {
        blogger: { select: { authorid: true, name: true, username: true, profilepicture: true } },
      },
    }),
    db.post.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/** Caller must have already verified the requester owns this post or is an admin. */
export async function updatePost(articleId: bigint, input: UpdatePostInput) {
  const { categoryIds, keywordIds, ...postData } = input;

  return db.post.update({
    where: { articleid: articleId },
    data: {
      ...postData,
      ...(postData.poststatus === "published" && { publishedat: new Date() }),
    },
  });
  // NOTE: categoryIds/keywordIds re-assignment on update intentionally
  // left out for now — needs a decided replace-vs-merge strategy before
  // wiring it up. Flag if you want that in this pass.
}

/** Caller must have already verified the requester owns this post or is an admin. */
export async function deletePost(articleId: bigint) {
  return db.post.delete({ where: { articleid: articleId } });
}

/** Primary author (creator) or DELETE — the "primary only" side of the collaboration model. */
export async function isPrimaryAuthor(articleId: bigint, authorId: bigint) {
  const post = await db.post.findUnique({ where: { articleid: articleId }, select: { primaryauthor: true } });
  return post?.primaryauthor === authorId;
}

/** Primary author OR any secondary collaborator — the "can edit" side of the collaboration model. */
export async function canEditPost(articleId: bigint, authorId: bigint) {
  const post = await db.post.findUnique({ where: { articleid: articleId }, select: { primaryauthor: true } });
  if (!post) return false;
  if (post.primaryauthor === authorId) return true;
  const collab = await db.collaboration.findFirst({ where: { articleid: articleId, authorid: authorId } });
  return collab !== null;
}

/**
 * Related posts — shares at least one category or keyword with the
 * given post, excludes the post itself, published only. No relevance
 * ranking beyond recency; a real "most similar" ranking would want a
 * weighted score (shared category + keyword count) which isn't built
 * here yet.
 */
export async function getRelatedPosts(articleId: bigint, limit = 6) {
  const [categoryIds, keywordIds] = await Promise.all([
    db.postcategoryassignment.findMany({ where: { articleid: articleId }, select: { categoryid: true } }),
    db.keywordassignment.findMany({ where: { articleid: articleId }, select: { keywordid: true } }),
  ]);

  if (categoryIds.length === 0 && keywordIds.length === 0) return [];

  return db.post.findMany({
    where: {
      articleid: { not: articleId },
      poststatus: "published",
      OR: [
        ...(categoryIds.length
          ? [{ postcategoryassignment: { some: { categoryid: { in: categoryIds.map((c) => c.categoryid) } } } }]
          : []),
        ...(keywordIds.length
          ? [{ keywordassignment: { some: { keywordid: { in: keywordIds.map((k) => k.keywordid) } } } }]
          : []),
      ],
    },
    take: limit,
    orderBy: { createdat: "desc" },
    include: {
      blogger: { select: { authorid: true, name: true, username: true, profilepicture: true } },
    },
  });
}