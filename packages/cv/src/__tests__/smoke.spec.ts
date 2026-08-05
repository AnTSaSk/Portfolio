import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (relPath: string): string =>
  readFileSync(path.resolve(process.cwd(), relPath), 'utf-8');

describe('CV HTML pages scaffold', () => {
  it('EN page is a valid HTML document with lang="en"', () => {
    const html = read('index.html');
    expect(html).toMatch(/<!doctype html>/i);
    expect(html).toMatch(/<html[^>]*\slang="en"/i);
  });

  it('FR page is a valid HTML document with lang="fr"', () => {
    const html = read('fr/index.html');
    expect(html).toMatch(/<!doctype html>/i);
    expect(html).toMatch(/<html[^>]*\slang="fr"/i);
  });
});
