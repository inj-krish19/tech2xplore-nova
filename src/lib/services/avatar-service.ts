import { db } from "@/lib/db";
import { AVATAR_PRESETS, isValidAvatarUrl } from "@/lib/constants/avatar-presets";

/**
 * Returns the fixed presets plus whatever's currently on file as
 * `profilepicture` — for an OAuth user that's still their Google/
 * LinkedIn picture unless they've already overwritten it. There's no
 * separate column preserving the original OAuth picture once
 * overwritten (that'd need a schema addition, not done without
 * production sign-off), so once someone picks a preset, their old
 * OAuth picture isn't recoverable through this endpoint again — only
 * by signing in again, which re-syncs it... actually it doesn't
 * currently, signIn only sets profilepicture on first account
 * creation, not on repeat logins. Flag if that resync behavior is
 * wanted; not built here.
 */
export async function getAvatarOptions(authorId: bigint) {
  const blogger = await db.blogger.findUnique({
    where: { authorid: authorId },
    select: { profilepicture: true, authprovider: true },
  });

  const current = blogger?.profilepicture ?? null;
  const currentIsCustom = current !== null && !isValidAvatarUrl(current);

  return {
    presets: AVATAR_PRESETS,
    current,
    // Only surfaced as a distinct "keep your OAuth picture" option when
    // it isn't already one of the presets (i.e. it's a real external URL).
    currentIsOAuthPicture: currentIsCustom && blogger?.authprovider !== "credentials",
  };
}

export async function setAvatar(authorId: bigint, url: string) {
  // Accept a preset, OR the picture already on file (so re-selecting
  // "keep current" via this endpoint isn't rejected) — but nothing else,
  // since there's no upload path and no arbitrary-URL avatar allowed.
  const blogger = await db.blogger.findUnique({ where: { authorid: authorId }, select: { profilepicture: true } });
  const isCurrent = blogger?.profilepicture === url;

  if (!isValidAvatarUrl(url) && !isCurrent) {
    throw new Error("INVALID_AVATAR_URL");
  }

  return db.blogger.update({
    where: { authorid: authorId },
    data: { profilepicture: url },
    select: { authorid: true, profilepicture: true },
  });
}