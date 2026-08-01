import { describe, expect, it } from 'vitest';

import { buildUmamiScript } from '../umami';

describe('buildUmamiScript', () => {
  it('should return one entry with defer, src and data-website-id when production and config present', () => {
    const result = buildUmamiScript({
      src: 'https://umami.example.com/script.js',
      websiteId: 'abc-123',
      isProduction: true,
    });

    expect(result).toHaveLength(1);

    const [entry] = result;

    if (!entry) {
      throw new Error('expected one script entry');
    }

    expect(entry.src).toBe('https://umami.example.com/script.js');
    expect(entry.defer).toBe(true);
    expect(entry['data-website-id']).toBe('abc-123');
    expect(entry['data-domains']).toBeUndefined();
  });

  it('should include data-domains when domains is provided', () => {
    const result = buildUmamiScript({
      src: 'https://umami.example.com/script.js',
      websiteId: 'abc-123',
      domains: 'alexisbesson.fr',
      isProduction: true,
    });

    expect(result).toHaveLength(1);

    const [entry] = result;

    if (!entry) {
      throw new Error('expected one script entry');
    }

    expect(entry['data-domains']).toBe('alexisbesson.fr');
  });

  it('should return no entry when websiteId is missing', () => {
    const result = buildUmamiScript({
      src: 'https://umami.example.com/script.js',
      isProduction: true,
    });

    expect(result).toEqual([]);
  });

  it('should return no entry when src is missing', () => {
    const result = buildUmamiScript({
      websiteId: 'abc-123',
      isProduction: true,
    });

    expect(result).toEqual([]);
  });

  it('should return no entry when not in production', () => {
    const result = buildUmamiScript({
      src: 'https://umami.example.com/script.js',
      websiteId: 'abc-123',
      isProduction: false,
    });

    expect(result).toEqual([]);
  });

  it('should return no entry when src and websiteId are whitespace-only', () => {
    const result = buildUmamiScript({
      src: '  ',
      websiteId: '  ',
      isProduction: true,
    });

    expect(result).toEqual([]);
  });

  it('should omit data-domains when domains is whitespace-only', () => {
    const result = buildUmamiScript({
      src: 'https://umami.example.com/script.js',
      websiteId: 'abc-123',
      domains: '  ',
      isProduction: true,
    });

    expect(result).toHaveLength(1);

    const [entry] = result;

    if (!entry) {
      throw new Error('expected one script entry');
    }

    expect(entry['data-domains']).toBeUndefined();
  });
});
