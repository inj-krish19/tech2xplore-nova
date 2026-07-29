import { db } from "@/lib/db";

/**
 * orgpost is fed by an external process (a scraper/fetcher against
 * sourceurl — fetchedat exists specifically to track that), not created
 * through this app's own post-creation flow. This service is read-only
 * on purpose — no createOrgPost here, since nothing in the schema or
 * README suggests posts originate from inside the app itself.
 */
export async function listOrgPosts(page: number, pageSize: number) {
  const [items, total] = await Promise.all([
    db.orgpost.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { publishedat: "desc" },
    }),
    db.orgpost.count(),
  ]);
  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getOrgPostById(orgPostId: bigint) {
  return db.orgpost.findUnique({ where: { orgpostid: orgPostId } });
}