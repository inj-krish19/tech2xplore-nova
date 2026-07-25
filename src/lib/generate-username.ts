import { db } from "@/lib/db";

/** Turns "Jane Doe" / "jane.doe@gmail.com" into a slug like "janedoe", appending digits if taken. */
export async function generateUniqueUsername(seed: string): Promise<string> {
  const base = seed
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .slice(0, 15) || "user";

  let candidate = base;
  let suffix = 0;

  while (await db.blogger.findUnique({ where: { username: candidate }, select: { authorid: true } })) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}