const AVERAGE_WORDS_PER_MINUTE = 200;

/**
 * Word-count-based estimate, computed at render time — no DB write, no
 * schema change. Rounds up so a 30-second post still reads as "1 min read"
 * rather than "0 min read".
 */
export function estimateReadTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / AVERAGE_WORDS_PER_MINUTE));
}