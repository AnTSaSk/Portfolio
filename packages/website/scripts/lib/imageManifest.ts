import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import {
  RESPONSIVE_FORMATS,
  SOCIAL_VARIANT,
  socialVariantPath,
  variantPath,
  widthsForRole,
  type ImageRole,
} from '../../src/utils/imageVariants';

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
        ...widthsForRole(role).flatMap((width) =>
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
