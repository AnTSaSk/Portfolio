import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(dirname, '../../..');
const tokensCss = fs.readFileSync(
  path.join(dirname, '..', 'tokens.css'),
  'utf-8',
);

const readComponentCss = (relative: string): string =>
  fs.readFileSync(path.join(srcDir, 'components', relative), 'utf-8');

const DISPLAY_TOKENS: Array<[string, string]> = [
  ['--fs-displayXl', 'clamp(56px, 8vw, 120px)'],
  ['--fs-displayL', 'clamp(48px, 6vw, 72px)'],
  ['--fs-displayHero', 'clamp(38px, 5vw, 84px)'],
  ['--fs-displayM', 'clamp(28px, 3vw, 44px)'],
  ['--fs-displayS', 'clamp(18px, 2vw, 30px)'],
  ['--fs-ledeL', 'clamp(18px, 1.7vw, 28px)'],
  ['--fs-ledeS', 'clamp(17px, 1.4vw, 20px)'],
  ['--fs-metaS', 'clamp(15px, 1.1vw, 18px)'],
  ['--fs-watermark', 'clamp(64px, 12vw, 140px)'],
];

describe('tokens.css : display type tokens', () => {
  it.each(DISPLAY_TOKENS)('defines %s verbatim', (token, value) => {
    expect(tokensCss).toContain(`${token}: ${value};`);
  });
});

describe('display tokens replace inline clamp() font sizes', () => {
  const consumers = [
    'Organisms/Head/style.css',
    'Organisms/Hero/style.css',
    'Organisms/Feature/style.css',
    'Molecules/MediaCover/style.css',
  ];

  it.each(consumers)('%s declares no literal clamp() font-size', (file) => {
    const css = readComponentCss(file);

    expect(css).not.toMatch(/font-size:\s*clamp\(\s*\d/);
  });

  it('page.css declares no literal clamp() font-size', () => {
    const pageCss = fs.readFileSync(
      path.resolve(srcDir, '../../website/src/assets/css/page.css'),
      'utf-8',
    );

    expect(pageCss).not.toMatch(/font-size:\s*clamp\(\s*\d/);
  });
});

describe('shared display tokens prove their mutualisation', () => {
  const allCss = [
    readComponentCss('Organisms/Head/style.css'),
    readComponentCss('Organisms/Hero/style.css'),
    readComponentCss('Organisms/Feature/style.css'),
    readComponentCss('Molecules/MediaCover/style.css'),
    fs.readFileSync(
      path.resolve(srcDir, '../../website/src/assets/css/page.css'),
      'utf-8',
    ),
  ].join('\n');

  it.each(['--fs-displayM', '--fs-displayS', '--fs-ledeL'])(
    '%s is consumed by at least 2 sites',
    (token) => {
      const uses = allCss.match(new RegExp(`var\\(${token}\\)`, 'g'));

      expect(uses?.length ?? 0).toBeGreaterThanOrEqual(2);
    },
  );
});

describe('font-size never uses relative units', () => {
  const cssFiles = (dir: string): string[] =>
    fs
      .readdirSync(dir, { recursive: true, encoding: 'utf-8' })
      .filter((entry) => entry.endsWith('.css'))
      .map((entry) => path.join(dir, entry));

  // base.css keeps `code/pre/kbd/samp { font-size: 0.92em }`: it must track
  // whatever size the surrounding text uses (14px UI vs 16px prose).
  const EXEMPT = new Set(['assets/css/base.css']);

  it('declares no font-size in em or rem across both packages', () => {
    const offenders: string[] = [];

    for (const dir of [srcDir, path.resolve(srcDir, '../../website/src')]) {
      for (const file of cssFiles(dir)) {
        const relative = path.relative(dir, file);

        if (EXEMPT.has(relative)) {
          continue;
        }

        const css = fs.readFileSync(file, 'utf-8');

        for (const [match] of css.matchAll(/font-size:\s*[^;]+;/g)) {
          if (/\d\s*(em|rem)\b/.test(match)) {
            offenders.push(`${relative}: ${match.trim()}`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
