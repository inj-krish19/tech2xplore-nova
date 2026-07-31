import { db } from "@/lib/db";
import type { CreateCategoryInput } from "@/lib/validations/category";

export async function listCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

export async function createCategory(creatorId: bigint, input: CreateCategoryInput) {
  return db.category.create({
    data: { ...input, createdby: creatorId },
  });
}

export async function getCategoryById(categoryId: bigint) {
  return db.category.findUnique({ where: { categoryid: categoryId } });
}

export async function listPostsByCategory(categoryId: bigint, page: number, pageSize: number) {
  const where = {
    postcategoryassignment: { some: { categoryid: categoryId } },
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

/** People who've recently posted in this category — backs the category page's "recent authors" strip. */
export async function recentAuthorsByCategory(categoryId: bigint, limit = 8) {
  const assignments = await db.postcategoryassignment.findMany({
    where: { categoryid: categoryId },
    orderBy: { createdat: "desc" },
    take: limit * 3, // over-fetch, then de-dupe by author below
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

/** Admin panel listing — paginated, optional name search, includes how many posts reference each category. */
export async function adminListCategories(page: number, pageSize: number, search?: string) {
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {};

  const [items, total] = await Promise.all([
    db.category.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdat: "desc" },
      include: { _count: { select: { postcategoryassignment: true } } },
    }),
    db.category.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/**
 * Admin takedown. `postcategoryassignment.categoryid` is a NoAction FK,
 * so deleting a category still referenced by posts would 500 on the
 * constraint — this blocks with an `in_use` status instead so the admin
 * UI can show a clear reason rather than a raw DB error.
 */
export async function deleteCategory(
  categoryId: bigint
): Promise<{ status: "deleted" } | { status: "in_use"; postCount: number }> {
  const postCount = await db.postcategoryassignment.count({ where: { categoryid: categoryId } });
  if (postCount > 0) return { status: "in_use", postCount };

  await db.category.delete({ where: { categoryid: categoryId } });
  return { status: "deleted" };
}