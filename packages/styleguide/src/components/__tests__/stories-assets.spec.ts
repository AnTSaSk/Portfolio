import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const COMPONENTS_DIR = path.resolve(__dirname, '..');

// Link destinations a public story may legitimately point to. Anything else
// external is treated as a hotlinked asset: image hosts are not enumerable
// (extensions can sit mid-URL, or be absent entirely on CDN endpoints).
const ALLOWED_LINK_HOSTS = [
  'github.com',
  'www.linkedin.com',
  'linkedin.com',
  'x.com',
  'alexisbesson.fr',
  'www.w3.org',
  // Real client site a project card legitimately links out to.
  'valhalla.breitling.com',
];

const collectStoryFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectStoryFiles(full);
    }

    return entry.name.endsWith('.stories.ts') ? [full] : [];
  });

const storyFiles = collectStoryFiles(COMPONENTS_DIR);

const hostOf = (url: string): string => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

describe('story assets', () => {
  it('finds story files to check', () => {
    expect(storyFiles.length).toBeGreaterThan(0);
  });

  it.each(storyFiles)('%s references no external asset', (file) => {
    const source = fs.readFileSync(file, 'utf8');
    const disallowed = [...source.matchAll(/https?:\/\/[^'"`\s)]+/g)]
      .map((match) => match[0])
      .filter((url) => !ALLOWED_LINK_HOSTS.includes(hostOf(url)));

    expect(disallowed).toEqual([]);
  });
});
