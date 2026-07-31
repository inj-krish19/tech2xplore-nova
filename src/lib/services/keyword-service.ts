import { db } from "@/lib/db";
import type { CreateKeywordInput } from "@/lib/validations/keyword";

export async function listKeywords() {
  return db.keyword.findMany({ orderBy: { name: "asc" } });
}

export async function createKeyword(input: CreateKeywordInput) {
  return db.keyword.create({ data: input });
}

export async function getKeywordById(keywordId: bigint) {
  return db.keyword.findUnique({ where: { keywordid: keywordId } });
}

export async function listPostsByKeyword(keywordId: bigint, page: number, pageSize: number) {
  const where = {
    keywordassignment: { some: { keywordid: keywordId } },
    poststatus: "published" as const,
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

export async function recentAuthorsByKeyword(keywordId: bigint, limit = 8) {
  const assignments = await db.keywordassignment.findMany({
    where: { keywordid: keywordId },
    orderBy: { createdat: "desc" },
    take: limit * 3,
    select: {
      blogger: { select: { authorid: true, name: true, username: true, profilepicture: true } },
    },
  });

  const seen = new Set<string>();
  const authors = [];
  for (const a of assignments) {
    const key = a.blogger.authorid.toString();
    if (seen.has(key)) continue;
    seen.add(key);
    authors.push(a.blogger);
    if (authors.length >= limit) break;
  }
  return authors;
}

/** Admin panel listing — paginated, optional name search, includes how many posts use each keyword. */
export async function adminListKeywords(page: number, pageSize: number, search?: string) {
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {};

  const [items, total] = await Promise.all([
    db.keyword.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdat: "desc" },
      include: { _count: { select: { keywordassignment: true } } },
    }),
    db.keyword.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/**
 * Admin takedown. Same NoAction-FK reasoning as `deleteCategory` —
 * `keywordassignment.keywordid` blocks the delete at the DB level if
 * any post still uses this keyword, so check first and return a clean
 * `in_use` status instead of letting that hit as a raw 500.
 */
export async function deleteKeyword(
  keywordId: bigint
): Promise<{ status: "deleted" } | { status: "in_use"; postCount: number }> {
  const postCount = await db.keywordassignment.count({ where: { keywordid: keywordId } });
  if (postCount > 0) return { status: "in_use", postCount };

  await db.keyword.delete({ where: { keywordid: keywordId } });
  return { status: "deleted" };
}