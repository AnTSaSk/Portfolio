export type ImageRole = 'cover' | 'gallery' | 'prose' | 'social';

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

export type ResponsiveFormat = (typeof RESPONSIVE_FORMATS)[number];

export const MIME_BY_FORMAT: Record<ResponsiveFormat | 'jpeg', string> = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
};

const splitSource = (source: string): { dir: string; base: string } => {
  const lastSlash = source.lastIndexOf('/');
  const dir = lastSlash >= 0 ? source.slice(0, lastSlash) : '';
  const file = source.slice(lastSlash + 1);
  const lastDot = file.lastIndexOf('.');
  const base = lastDot > 0 ? file.slice(0, lastDot) : file;

  return { dir, base };
};

/**
 * `<base>-<width>w.<ext>` for responsive variants, `<base>-og.jpg` for the social
 * one, mirrored under `_gen/`. String-only so components can rebuild these URLs
 * without pulling node:path into the client bundle.
 */
export const variantPath = (
  source: string,
  width: number,
  format: string,
): string => {
  const { dir, base } = splitSource(source);
  const ext = format === 'jpeg' ? 'jpg' : format;

  return `${dir}/${GENERATED_DIR}/${base}-${width}w.${ext}`;
};

export const socialVariantPath = (source: string): string => {
  const { dir, base } = splitSource(source);

  return `${dir}/${GENERATED_DIR}/${base}-og.jpg`;
};

export const widthsForRole = (role: ImageRole): number[] =>
  WIDTHS_BY_ROLE[role === 'social' ? 'prose' : role];

export const srcsetFor = (
  source: string,
  role: ImageRole,
  format: string,
): string =>
  widthsForRole(role)
    .map((width) => `${variantPath(source, width, format)} ${width}w`)
    .join(', ');

/**
 * `<picture>` sources ordered by preference: the browser takes the first type
 * it decodes, so avif must precede webp.
 */
export const pictureSourcesFor = (
  source: string,
  role: ImageRole,
): Array<{ srcset: string; type: string }> =>
  RESPONSIVE_FORMATS.map((format) => ({
    srcset: srcsetFor(source, role, format),
    type: MIME_BY_FORMAT[format],
  }));
