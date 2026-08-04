import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { iconNames } from '../names';

const STORY_FILES = [
  path.resolve(__dirname, '../index.stories.ts'),
  path.resolve(__dirname, '../../Button/index.stories.ts'),
];

// Sprite ids are camelCase (bin/sprite.mjs derives them from filenames), so a
// kebab-case quoted literal in these stories is always a stale icon name.
const KEBAB_CASE = /^[a-z]+(-[a-z]+)+$/;

describe('icon names used in stories', () => {
  it.each(STORY_FILES)('%s uses only sprite-backed names', (file) => {
    const quoted = fs
      .readFileSync(file, 'utf8')
      .split('\n')
      // Storybook control types ('inline-radio', 'select') are kebab-case too.
      .filter((line) => !line.includes('control:'))
      .flatMap((line) => [...line.matchAll(/'([a-zA-Z-]+)'/g)])
      .map((match) => match[1]);
    const kebabNames = quoted.filter((value) => KEBAB_CASE.test(value));
    const unknown = kebabNames.filter(
      (value) => !(iconNames as readonly string[]).includes(value),
    );

    expect(unknown).toEqual([]);
  });
});
