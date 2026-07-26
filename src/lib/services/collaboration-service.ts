import { db } from "@/lib/db";

export async function listCollaborators(articleId: bigint) {
  return db.collaboration.findMany({
    where: { articleid: articleId },
    include: { blogger: { select: { authorid: true, name: true, username: true, profilepicture: true } } },
  });
}

export async function addCollaborator(
  articleId: bigint,
  authorId: bigint,
  role: "author" | "editor" | "contributor" = "contributor"
) {
  const existing = await db.collaboration.findFirst({ where: { articleid: articleId, authorid: authorId } });
  if (existing) return existing; // already a collaborator, no-op

  return db.collaboration.create({
    data: { articleid: articleId, authorid: authorId, colloborationrole: role, createdat: new Date() },
  });
}

export async function removeCollaborator(articleId: bigint, authorId: bigint) {
  const existing = await db.collaboration.findFirst({ where: { articleid: articleId, authorid: authorId } });
  if (!existing) return null;
  await db.collaboration.delete({ where: { collaborationid: existing.collaborationid } });
  return existing;
}