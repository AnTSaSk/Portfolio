import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';

import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const SOURCE_DIR = join(ROOT, 'public/img');
const OUTPUT_DIR = join(ROOT, 'optimized-sources');
const GENERATED_DIR = '_gen';

// Covers and gallery heroes are rendered full width at 2x, tiles at 632px, and
// prose captures never exceed the article column.
const maxWidthFor = (path: string): number => {
  if (/_Cover|_Gallery_Hero/i.test(path)) {
    return 2560;
  }

  if (/_Gallery/i.test(path)) {
    return 1600;
  }

  return 1920;
};

const collect = (dir: string): string[] => {
  const found: string[] = [];
  const walk = (current: string): void => {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);

      if (statSync(full).isDirectory()) {
        if (entry !== GENERATED_DIR) {
          walk(full);
        }
      } else if (/\.(jpe?g|png)$/i.test(entry)) {
        found.push(full);
      }
    }
  };

  walk(dir);

  return found;
};

const run = async (): Promise<void> => {
  const sources = collect(SOURCE_DIR);
  const rows: string[] = [];
  let before = 0;
  let after = 0;

  for (const source of sources) {
    const relativePath = relative(SOURCE_DIR, source);
    const target = join(OUTPUT_DIR, relativePath);
    const isPng = extname(source).toLowerCase() === '.png';
    const originalSize = statSync(source).size;

    mkdirSync(dirname(target), { recursive: true });

    const pipeline = sharp(source).resize(maxWidthFor(relativePath), null, {
      withoutEnlargement: true,
    });

    await (
      isPng
        ? pipeline.png({ compressionLevel: 9, palette: true })
        : pipeline.jpeg({ quality: 82, mozjpeg: true })
    ).toFile(target);

    const optimizedSize = statSync(target).size;

    before += originalSize;
    after += optimizedSize;

    rows.push(
      `${(originalSize / 1e6).toFixed(2)} -> ${(optimizedSize / 1e6).toFixed(2)} MB  ${relativePath}`,
    );
  }

  rows.sort().forEach((row) => console.log(row));
  console.log(
    `\n${sources.length} sources: ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB ` +
      `(-${Math.round((1 - after / before) * 100)}%)`,
  );
  console.log(
    `Written to ${existsSync(OUTPUT_DIR) ? relative(ROOT, OUTPUT_DIR) : '?'}`,
  );
};

await run();
