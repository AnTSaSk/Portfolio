import { describe, expect, it } from 'vitest';

describe('readingTime', () => {
  it('returns 1 for an empty string', async () => {
    const { readingTime } = await import('../readingTime');

    expect(readingTime('')).toBe(1);
  });

  it('returns 1 for a whitespace-only string', async () => {
    const { readingTime } = await import('../readingTime');

    expect(readingTime('   \n\t  ')).toBe(1);
  });

  it('returns 1 minute for exactly 200 words at the default rate', async () => {
    const { readingTime } = await import('../readingTime');
    const text = new Array(200).fill('word').join(' ');

    expect(readingTime(text)).toBe(1);
  });

  // ceil rounding: 350 words / 200 wpm = 1.75 -> 2
  it('rounds up to the next whole minute when word count is not an exact multiple of the rate', async () => {
    const { readingTime } = await import('../readingTime');
    const text = new Array(350).fill('word').join(' ');

    expect(readingTime(text)).toBe(2);
  });

  it('uses a custom wordsPerMinute rate when provided', async () => {
    const { readingTime } = await import('../readingTime');
    const text = new Array(300).fill('word').join(' ');

    expect(readingTime(text, 100)).toBe(3);
  });

  it('counts words by splitting on whitespace, ignoring repeated separators', async () => {
    const { readingTime } = await import('../readingTime');

    expect(readingTime('one  two\n\tthree')).toBe(1);
  });
});
