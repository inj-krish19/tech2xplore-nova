import { db } from "@/lib/db";

/**
 * orgpost is fed by the LinkedIn automation pipeline
 * (lib/services/linkedin-automation-service.ts), which fetches an
 * article, generates LinkedIn post text via Gemini, and publishes it —
 * upsertOrgPostFromAutomation below is that pipeline's only write path
 * into this table. Nothing else in the app creates orgpost rows.
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

export interface OrgPostAutomationInput {
  sourceurl: string;
  provider: string;
  title: string | null;
  description: string;
  content: string;
  coverimage: string;
  linkedinpostid: string | null;
  linkedinurl: string | null;
  publishedat: Date;
}

/**
 * Upsert keyed on sourceurl (the schema's unique column) — if the
 * rotation math in the automation pipeline picks the same article again
 * on a later run, this updates the existing row instead of hitting the
 * unique constraint or creating a duplicate entry.
 */
export async function upsertOrgPostFromAutomation(input: OrgPostAutomationInput) {
  return db.orgpost.upsert({
    where: { sourceurl: input.sourceurl },
    create: input,
    update: {
      provider: input.provider,
      title: input.title,
      description: input.description,
      content: input.content,
      coverimage: input.coverimage,
      linkedinpostid: input.linkedinpostid,
      linkedinurl: input.linkedinurl,
      publishedat: input.publishedat,
    },
  });
}