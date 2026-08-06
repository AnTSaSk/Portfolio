import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import sharp from 'sharp';

import {
  buildManifest,
  RESPONSIVE_FORMATS,
  SOCIAL_VARIANT,
  type ManifestEntry,
} from '../src/utils/imageManifest';

const ROOT = resolve(import.meta.dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const CONTENT_DIR = join(ROOT, 'content');
// Encoded variants live in the cache dir and are copied into public/. In CI that
// directory is a BuildKit cache mount, so it survives across builds.
const CACHE_DIR = join(ROOT, '.image-cache');
const CACHE_FILE = join(CACHE_DIR, 'index.json');
const QUALITY = 72;

const CODE_ASSETS = ['/img/og-default.jpg', '/img/Blog/author.jpg'];

type Cache = Record<string, string>;

const sourceHash = (absolute: string): string =>
  createHash('sha256')
    .update(readFileSync(absolute))
    .digest('hex')
    .slice(0, 16);

const readCache = (): Cache =>
  existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, 'utf-8')) : {};

const encode = async (
  absoluteSource: string,
  absoluteTarget: string,
  width: number,
  format: string,
): Promise<void> => {
  mkdirSync(dirname(absoluteTarget), { recursive: true });

  const pipeline = sharp(absoluteSource);

  if (format === 'jpeg') {
    await pipeline
      .resize(SOCIAL_VARIANT.width, SOCIAL_VARIANT.height, { fit: 'cover' })
      .jpeg({ quality: QUALITY })
      .toFile(absoluteTarget);

    return;
  }

  const resized = pipeline.resize(width, null, { withoutEnlargement: true });

  await (
    format === 'avif'
      ? resized.avif({ quality: QUALITY })
      : resized.webp({ quality: QUALITY })
  ).toFile(absoluteTarget);
};

const run = async (): Promise<void> => {
  const manifest: ManifestEntry[] = buildManifest(CONTENT_DIR, CODE_ASSETS);
  const cache = readCache();
  const nextCache: Cache = {};
  const missingSources: string[] = [];

  let encoded = 0;
  let skipped = 0;

  for (const entry of manifest) {
    const absoluteSource = join(PUBLIC_DIR, entry.source);

    if (!existsSync(absoluteSource)) {
      missingSources.push(entry.source);
      continue;
    }

    const hash = sourceHash(absoluteSource);

    nextCache[entry.source] = hash;

    for (const variant of entry.variants) {
      const cached = join(CACHE_DIR, variant.file);
      const absoluteTarget = join(PUBLIC_DIR, variant.file);
      const fresh = cache[entry.source] === hash && existsSync(cached);

      if (fresh) {
        mkdirSync(dirname(absoluteTarget), { recursive: true });
        copyFileSync(cached, absoluteTarget);
        skipped += 1;
        continue;
      }

      await encode(absoluteSource, cached, variant.width, variant.format);
      mkdirSync(dirname(absoluteTarget), { recursive: true });
      copyFileSync(cached, absoluteTarget);
      encoded += 1;
    }
  }

  if (missingSources.length > 0) {
    console.error(
      `Missing source images:\n${missingSources.map((s) => `  ${s}`).join('\n')}`,
    );
    process.exit(1);
  }

  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, `${JSON.stringify(nextCache, null, 2)}\n`);

  const expected = manifest.flatMap((entry) => entry.variants);
  const absent = expected.filter((v) => !existsSync(join(PUBLIC_DIR, v.file)));

  if (absent.length > 0) {
    console.error(
      `Missing generated variants:\n${absent.map((v) => `  ${v.file}`).join('\n')}`,
    );
    process.exit(1);
  }

  const bytes = expected.reduce(
    (total, v) => total + statSync(join(PUBLIC_DIR, v.file)).size,
    0,
  );

  console.log(
    `${manifest.length} sources, ${expected.length} variants ` +
      `(${encoded} encoded, ${skipped} cached), ` +
      `${(bytes / 1e6).toFixed(2)} MB, formats ${RESPONSIVE_FORMATS.join('+')}+jpeg`,
  );
};

await run();
