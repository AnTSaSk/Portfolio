import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const configPath = resolve(process.cwd(), 'nuxt.config.ts');
const configSource = readFileSync(configPath, 'utf-8');

const robotsBlock = configSource.match(/\n {2}robots:\s*{.*?\n {2}},\n/s)?.[0];

describe('nuxt.config.ts robots configuration', () => {
  it('declares a robots block', () => {
    expect(robotsBlock).toBeDefined();
  });

  // Googlebot renders pages before indexing them and needs the assets served
  // from /_nuxt/ to do so.
  it('does not disallow /_nuxt/', () => {
    expect(robotsBlock).not.toContain('/_nuxt/');
  });

  it('allows the whole site', () => {
    expect(robotsBlock).toContain("allow: ['/']");
  });

  it('keeps a single group targeting every user agent', () => {
    expect(robotsBlock).toContain("userAgent: ['*']");
    expect(robotsBlock?.match(/userAgent:/g)).toHaveLength(1);
  });

  it('declares no disallow rule at all', () => {
    expect(robotsBlock).not.toContain('disallow');
  });

  it('adds no noindex directive', () => {
    expect(robotsBlock).not.toContain('noindex');
  });
});
