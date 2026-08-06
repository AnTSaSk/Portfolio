import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  socialVariantPath,
  variantPath,
  WIDTHS_BY_ROLE,
} from '../../../src/utils/imageVariants';
import { buildManifest } from '../imageManifest';

const CONTENT_ROOT = resolve(process.cwd(), 'content');
const CODE_ASSETS = ['/img/og-default.jpg', '/img/Blog/author.jpg'];

const manifest = buildManifest(CONTENT_ROOT, CODE_ASSETS);
const bySource = new Map(manifest.map((entry) => [entry.source, entry]));

describe('variant naming convention', () => {
  it('names responsive variants <base>-<width>w.<ext> under _gen/', () => {
    expect(variantPath('/img/Blog/N0_Cover.jpg', 1280, 'avif')).toBe(
      '/img/Blog/_gen/N0_Cover-1280w.avif',
    );
    expect(variantPath('/img/Blog/N0_Cover.jpg', 632, 'webp')).toBe(
      '/img/Blog/_gen/N0_Cover-632w.webp',
    );
  });

  it('names the social variant <base>-og.jpg', () => {
    expect(socialVariantPath('/img/Blog/N0_Cover.jpg')).toBe(
      '/img/Blog/_gen/N0_Cover-og.jpg',
    );
  });

  it('maps the jpeg format to a .jpg extension', () => {
    expect(variantPath('/img/a.png', 600, 'jpeg')).toBe('/img/_gen/a-600w.jpg');
  });
});

describe('manifest covers the three required sources', () => {
  it('includes front-matter covers', () => {
    expect(bySource.get('/img/Blog/N0_Cover.jpg')?.role).toBe('cover');
  });

  it('includes gallery images', () => {
    const galleries = manifest.filter((entry) => entry.role === 'gallery');

    expect(galleries.length).toBeGreaterThan(0);
  });

  it('includes markdown body images', () => {
    expect(bySource.get('/img/Blog/N0_Figma2023.png')?.role).toBe('prose');
  });

  it('includes assets referenced from code', () => {
    expect(bySource.has('/img/og-default.jpg')).toBe(true);
    expect(bySource.has('/img/Blog/author.jpg')).toBe(true);
  });

  it('lists every source exactly once', () => {
    const sources = manifest.map((entry) => entry.source);

    expect(sources).toHaveLength(new Set(sources).size);
  });
});

describe('variants match the widths matrix', () => {
  it('produces avif and webp at every width of the role', () => {
    const cover = bySource.get('/img/Blog/N0_Cover.jpg');
    const responsive = cover?.variants.filter((v) => v.format !== 'jpeg') ?? [];

    expect(responsive).toHaveLength(WIDTHS_BY_ROLE.cover.length * 2);
    expect(
      responsive.every((v) => WIDTHS_BY_ROLE.cover.includes(v.width)),
    ).toBe(true);
  });

  it('gives covers a social variant', () => {
    const cover = bySource.get('/img/Blog/N0_Cover.jpg');

    expect(cover?.variants.some((v) => v.file.endsWith('-og.jpg'))).toBe(true);
  });

  // og:image derives from image.src, which is always a cover.
  it('gives prose and gallery images no social variant', () => {
    const others = manifest.filter(
      (entry) => entry.role === 'prose' || entry.role === 'gallery',
    );

    expect(
      others.every((e) => !e.variants.some((v) => v.file.endsWith('-og.jpg'))),
    ).toBe(true);
  });
});
