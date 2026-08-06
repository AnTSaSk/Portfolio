import { describe, expect, it } from 'vitest';

import {
  pictureSourcesFor,
  socialVariantPath,
  srcsetFor,
  variantPath,
  widthsForRole,
} from '../imageVariants';

const SRC = '/img/Projects/Arneo_Cover.jpg';

describe('utils/imageVariants', () => {
  describe('variantPath', () => {
    it('mirrors the source under _gen with a width descriptor suffix', () => {
      expect(variantPath(SRC, 1280, 'avif')).toBe(
        '/img/Projects/_gen/Arneo_Cover-1280w.avif',
      );
    });

    it('maps the jpeg format to the jpg extension', () => {
      expect(variantPath(SRC, 1200, 'jpeg')).toBe(
        '/img/Projects/_gen/Arneo_Cover-1200w.jpg',
      );
    });

    it('keeps the base name of a file with several dots', () => {
      expect(variantPath('/img/a.b.png', 600, 'webp')).toBe(
        '/img/_gen/a.b-600w.webp',
      );
    });

    it('handles a source at the public root', () => {
      expect(variantPath('/cover.jpg', 600, 'webp')).toBe(
        '/_gen/cover-600w.webp',
      );
    });
  });

  describe('socialVariantPath', () => {
    it('always resolves to the -og.jpg sibling under _gen', () => {
      expect(socialVariantPath(SRC)).toBe(
        '/img/Projects/_gen/Arneo_Cover-og.jpg',
      );
    });

    it('normalises a png source to the jpg social variant', () => {
      expect(socialVariantPath('/img/Blog/hero.png')).toBe(
        '/img/Blog/_gen/hero-og.jpg',
      );
    });
  });

  describe('widthsForRole', () => {
    it.each([
      ['cover', [1280, 2560]],
      ['gallery', [632, 1264]],
      ['prose', [600, 1200]],
    ] as const)('exposes the %s widths', (role, expected) => {
      expect(widthsForRole(role)).toEqual(expected);
    });

    it('falls back to the prose widths for the social role', () => {
      expect(widthsForRole('social')).toEqual([600, 1200]);
    });
  });

  describe('srcsetFor', () => {
    it('joins one width-descriptor candidate per role width', () => {
      expect(srcsetFor(SRC, 'cover', 'webp')).toBe(
        '/img/Projects/_gen/Arneo_Cover-1280w.webp 1280w, /img/Projects/_gen/Arneo_Cover-2560w.webp 2560w',
      );
    });

    it('uses the gallery widths for a gallery image', () => {
      expect(srcsetFor(SRC, 'gallery', 'avif')).toBe(
        '/img/Projects/_gen/Arneo_Cover-632w.avif 632w, /img/Projects/_gen/Arneo_Cover-1264w.avif 1264w',
      );
    });
  });

  describe('pictureSourcesFor', () => {
    it('lists avif before webp so the browser picks the smallest it decodes', () => {
      const sources = pictureSourcesFor(SRC, 'cover');

      expect(sources.map((source) => source.type)).toEqual([
        'image/avif',
        'image/webp',
      ]);
      expect(sources[0]?.srcset).toBe(srcsetFor(SRC, 'cover', 'avif'));
      expect(sources[1]?.srcset).toBe(srcsetFor(SRC, 'cover', 'webp'));
    });

    it('never emits a runtime transform URL', () => {
      for (const source of pictureSourcesFor(SRC, 'prose')) {
        expect(source.srcset).not.toContain('_ipx');
      }
    });
  });
});
