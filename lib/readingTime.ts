const WORDS_PER_MINUTE = 200;

export function computeReadingTimeMinutes(contentHtml: string) {
  const text = contentHtml.replace(/<[^>]*>/g, " ").trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
