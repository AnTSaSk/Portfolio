import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, dirname, basename } from 'node:path';

export type ImageRole = 'cover' | 'gallery' | 'prose' | 'social';

export type ImageVariant = {
  width: number;
  format: 'avif' | 'webp' | 'jpeg';
  file: string;
};

export type ManifestEntry = {
  source: string;
  role: ImageRole;
  variants: ImageVariant[];
};

export const GENERATED_DIR = '_gen';

// Widths mirror the rendered geometry of each placement, at 1x and 2x.
export const WIDTHS_BY_ROLE: Record<Exclude<ImageRole, 'social'>, number[]> = {
  cover: [1280, 2560],
  gallery: [632, 1264],
  prose: [600, 1200],
};

export const SOCIAL_VARIANT = {
  width: 1200,
  height: 630,
  format: 'jpeg' as const,
};

export const RESPONSIVE_FORMATS = ['avif', 'webp'] as const;

/**
 * `<base>-<width>w.<ext>` for responsive variants, `<base>-og.jpg` for the social
 * one, mirrored under `_gen/`. Consumers rebuild these URLs by convention, so
 * the pattern cannot change without updating them.
 */
export const variantPath = (
  source: string,
  width: number,
  format: string,
): string => {
  const dir = dirname(source);
  const base = basename(source, extname(source));
  const ext = format === 'jpeg' ? 'jpg' : format;

  return join(dir, GENERATED_DIR, `${base}-${width}w.${ext}`);
};

export const socialVariantPath = (source: string): string => {
  const dir = dirname(source);
  const base = basename(source, extname(source));

  return join(dir, GENERATED_DIR, `${base}-og.jpg`);
};

const collectMarkdown = (root: string): string[] => {
  const found: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);

      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.md')) {
        found.push(full);
      }
    }
  };

  walk(root);

  return found;
};

const FRONT_MATTER_SRC = /src:\s*['"]?(\/img\/[^\s'"]+)/g;
const MARKDOWN_IMAGE = /!\[[^\]]*\]\((\/img\/[^\s)]+)/g;
const GALLERY_BLOCK = /^gallery:/m;

const matchAll = (text: string, pattern: RegExp): string[] =>
  [...text.matchAll(pattern)]
    .map((m) => m[1])
    .filter((v): v is string => Boolean(v));

/**
 * Union of front-matter image fields, Markdown body images, and assets
 * referenced from code.
 */
export const buildManifest = (
  contentRoot: string,
  codeAssets: string[],
): ManifestEntry[] => {
  const roles = new Map<string, ImageRole>();

  for (const file of collectMarkdown(contentRoot)) {
    const text = readFileSync(file, 'utf-8');
    const hasGallery = GALLERY_BLOCK.test(text);
    const frontMatterEnd = text.indexOf('\n---', 3);
    const frontMatter = frontMatterEnd > 0 ? text.slice(0, frontMatterEnd) : '';
    const body = frontMatterEnd > 0 ? text.slice(frontMatterEnd) : text;
    const galleryStart = frontMatter.search(GALLERY_BLOCK);

    for (const src of matchAll(frontMatter, FRONT_MATTER_SRC)) {
      const isGallery =
        hasGallery &&
        galleryStart >= 0 &&
        frontMatter.indexOf(src) > galleryStart;

      roles.set(src, isGallery ? 'gallery' : 'cover');
    }

    for (const src of matchAll(body, MARKDOWN_IMAGE)) {
      if (!roles.has(src)) {
        roles.set(src, 'prose');
      }
    }
  }

  for (const asset of codeAssets) {
    if (!roles.has(asset)) {
      roles.set(asset, 'prose');
    }
  }

  return [...roles.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([source, role]) => ({
      source,
      role,
      variants: [
        ...WIDTHS_BY_ROLE[role === 'social' ? 'prose' : role].flatMap((width) =>
          RESPONSIVE_FORMATS.map((format) => ({
            width,
            format,
            file: variantPath(source, width, format),
          })),
        ),
        // Only covers feed og:image (useSeo derives it from image.src), so a
        // social variant elsewhere would never be requested.
        ...(role === 'cover' || role === 'social'
          ? [
              {
                width: SOCIAL_VARIANT.width,
                format: SOCIAL_VARIANT.format,
                file: socialVariantPath(source),
              },
            ]
          : []),
      ],
    }));
};
