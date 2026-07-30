/**
 * DiceBear's API generates deterministic SVG avatars from a seed string
 * — no upload, no cloud storage, no API key. Fits the "cloud free"
 * requirement exactly: these are just static URLs.
 * https://www.dicebear.com/
 */
export const AVATAR_PRESETS: string[] = [
  "https://api.dicebear.com/9.x/notionists/svg?seed=t2x-orbit",
  "https://api.dicebear.com/9.x/notionists/svg?seed=t2x-nova",
  "https://api.dicebear.com/9.x/notionists/svg?seed=t2x-pulse",
  "https://api.dicebear.com/9.x/notionists/svg?seed=t2x-echo",
  "https://api.dicebear.com/9.x/notionists/svg?seed=t2x-drift",
  "https://api.dicebear.com/9.x/notionists/svg?seed=t2x-flux",
] as const;

export function isValidAvatarUrl(url: string): boolean {
  return (AVATAR_PRESETS as readonly string[]).includes(url);
}