import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const contentDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../content',
);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);

    if (statSync(full).isDirectory()) {
      return walk(full);
    }

    return full.endsWith('.md') ? [full] : [];
  });

const frontMatter = (raw: string): string | null => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  return match ? (match[1] ?? null) : null;
};

// A top-level `key: value` whose value is an unquoted scalar containing `: `
// (or ending in `:`) makes YAML parse it as a nested mapping instead of a
// string. This silently drops every following sibling field into that map and
// coerces the value to `[object Object]`. Such values MUST be quoted.
const unquotedColonScalar =
  /^[A-Za-z_][\w-]*:[ \t]+(?![|>'"])(?:[^\n]*:(?:[ \t]|$))/;

const markdownFiles = walk(contentDir).sort();

describe('content front-matter is well-formed', () => {
  it('finds at least one content file', () => {
    expect(markdownFiles.length).toBeGreaterThan(0);
  });

  for (const file of markdownFiles) {
    const rel = path.relative(contentDir, file);

    it(`${rel} has no unquoted scalar that YAML reads as a mapping`, () => {
      const fm = frontMatter(readFileSync(file, 'utf8'));

      expect(fm, `${rel} has no front-matter block`).not.toBeNull();

      const offenders = (fm ?? '')
        .split('\n')
        .filter((line) => unquotedColonScalar.test(line));

      expect(
        offenders,
        `${rel}: quote these values (unescaped ": " makes YAML build a nested map):\n${offenders.join('\n')}`,
      ).toEqual([]);
    });
  }
});
