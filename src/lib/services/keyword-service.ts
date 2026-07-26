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