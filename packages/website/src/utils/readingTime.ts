// Reading time is always at least 1 minute, even for empty content.
export const readingTime = (text: string, wordsPerMinute = 200): number => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
};
