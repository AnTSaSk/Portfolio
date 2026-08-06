import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

import { useSiteConfigMock } from '../../__tests__/setup/nuxt-macros';

describe('useSeo', () => {
  let currentLocale: string;

  beforeEach(() => {
    currentLocale = 'en';

    vi.stubGlobal(
      'useI18n',
      vi.fn(() => ({ locale: ref(currentLocale) })),
    );
  });

  afterEach(() => {
    // Clears call history only: useSeoMeta/useSiteConfig stay stubbed by the
    // shared setup file across the whole file (unstubAllGlobals would erase
    // them, since they are only stubbed once at setup-file load time).
    vi.mocked(useSeoMeta).mockClear();
    vi.resetModules();
  });

  it('calls useSeoMeta with the provided title and description', async () => {
    const { useSeo } = await import('../useSeo');

    useSeo({ title: 'Home title', description: 'Home description' });

    expect(useSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Home title',
        description: 'Home description',
      }),
    );
  });

  it('sets ogTitle/ogDescription from title/description and defaults ogType to "website"', async () => {
    const { useSeo } = await import('../useSeo');

    useSeo({ title: 'Home title', description: 'Home description' });

    expect(useSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({
        ogTitle: 'Home title',
        ogDescription: 'Home description',
        ogType: 'website',
      }),
    );
  });

  it('sets ogType to "article" when type is "article"', async () => {
    const { useSeo } = await import('../useSeo');

    useSeo({
      title: 'Article title',
      description: 'Article description',
      type: 'article',
    });

    expect(useSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({ ogType: 'article' }),
    );
  });

  it('sets twitterCard to "summary_large_image" with twitterTitle/twitterDescription', async () => {
    const { useSeo } = await import('../useSeo');

    useSeo({ title: 'Home title', description: 'Home description' });

    expect(useSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({
        twitterCard: 'summary_large_image',
        twitterTitle: 'Home title',
        twitterDescription: 'Home description',
      }),
    );
  });

  it('sets ogLocale from useI18n().locale when locale is "en"', async () => {
    currentLocale = 'en';

    const { useSeo } = await import('../useSeo');

    useSeo({ title: 'Home title', description: 'Home description' });

    expect(useSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({ ogLocale: 'en' }),
    );
  });

  it('sets ogLocale from useI18n().locale when locale is "fr"', async () => {
    currentLocale = 'fr';

    const { useSeo } = await import('../useSeo');

    useSeo({ title: 'Home title', description: 'Home description' });

    expect(useSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({ ogLocale: 'fr' }),
    );
  });

  it('reflects a changing title ref in the value read by useSeoMeta', async () => {
    const { useSeo } = await import('../useSeo');
    const title = ref('Initial title');

    useSeo({ title, description: 'Static description' });

    const { calls } = vi.mocked(useSeoMeta).mock;

    expect(calls[0]).toBeDefined();

    const [options] = calls[0]!;
    const resolvedTitle =
      typeof options.title === 'function' ? options.title() : options.title;

    expect(resolvedTitle).toBe('Initial title');

    title.value = 'Updated title';

    const updatedTitle =
      typeof options.title === 'function' ? options.title() : options.title;

    expect(updatedTitle).toBe('Updated title');
  });

  describe('og:image / twitter:image', () => {
    const lastCall = (): Record<string, unknown> => {
      const { calls } = vi.mocked(useSeoMeta).mock;
      const call = calls.at(-1)?.[0];

      expect(call).toBeDefined();

      return call! as Record<string, unknown>;
    };

    const resolveValue = (value: unknown): unknown =>
      typeof value === 'function' ? (value as () => unknown)() : value;

    it('falls back to the absolute og-default.jpg when no image is provided', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({ title: 'Home title', description: 'Home description' });

      const call = lastCall();

      expect(resolveValue(call.ogImage)).toBe(
        'https://alexisbesson.fr/img/og-default.jpg',
      );
      expect(resolveValue(call.twitterImage)).toBe(
        'https://alexisbesson.fr/img/og-default.jpg',
      );
    });

    it('sets ogImageWidth/ogImageHeight to 1200/630 on the fallback', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({ title: 'Home title', description: 'Home description' });

      const call = lastCall();

      expect(call.ogImageWidth).toBe(1200);
      expect(call.ogImageHeight).toBe(630);
    });

    it('sets a fixed brand alt on the fallback, symmetric between og and twitter', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({ title: 'Home title', description: 'Home description' });

      const call = lastCall();

      expect(resolveValue(call.ogImageAlt)).toBe('Alexis Besson, portfolio');
      expect(resolveValue(call.twitterImageAlt)).toBe(
        'Alexis Besson, portfolio',
      );
    });

    it('emits the recadrée JPEG variant URL when a cover image is provided', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({
        title: 'Project title',
        description: 'Project description',
        image: { src: '/img/Projects/Arneo_Cover.jpg' },
      });

      const call = lastCall();

      expect(resolveValue(call.ogImage)).toBe(
        'https://alexisbesson.fr/img/Projects/_gen/Arneo_Cover-og.jpg',
      );
      expect(resolveValue(call.twitterImage)).toBe(
        'https://alexisbesson.fr/img/Projects/_gen/Arneo_Cover-og.jpg',
      );
      expect(call.ogImageWidth).toBe(1200);
      expect(call.ogImageHeight).toBe(630);
    });

    it('sets ogImageAlt/twitterImageAlt to the resolved title when a cover is provided', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({
        title: 'Project title',
        description: 'Project description',
        image: { src: '/img/Projects/Arneo_Cover.jpg' },
      });

      const call = lastCall();

      expect(resolveValue(call.ogImageAlt)).toBe('Project title');
      expect(resolveValue(call.twitterImageAlt)).toBe('Project title');
    });

    it('joins the fallback path without a double slash after the scheme', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({ title: 'Home title', description: 'Home description' });

      const call = lastCall();

      expect(resolveValue(call.ogImage) as string).toMatch(
        /^https:\/\/[^/]+\/[^/]/,
      );
    });

    it('joins the cover variant path without a double slash after the scheme', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({
        title: 'Project title',
        description: 'Project description',
        image: { src: '/img/Projects/Arneo_Cover.jpg' },
      });

      const call = lastCall();

      expect(resolveValue(call.ogImage) as string).toMatch(
        /^https:\/\/[^/]+\/[^/]/,
      );
    });

    it('never emits ogImageAlt without twitterImageAlt (fallback case)', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({ title: 'Home title', description: 'Home description' });

      const call = lastCall();

      expect(resolveValue(call.ogImageAlt)).toBeDefined();
      expect(resolveValue(call.twitterImageAlt)).toBeDefined();
      expect(resolveValue(call.ogImageAlt)).toBe(
        resolveValue(call.twitterImageAlt),
      );
    });

    it('never emits ogImageAlt without twitterImageAlt (cover case)', async () => {
      const { useSeo } = await import('../useSeo');

      useSeo({
        title: 'Project title',
        description: 'Project description',
        image: { src: '/img/Projects/Arneo_Cover.jpg' },
      });

      const call = lastCall();

      expect(resolveValue(call.ogImageAlt)).toBe(
        resolveValue(call.twitterImageAlt),
      );
    });

    it('resolves the recadrée variant once the image ref is filled in after useSeo runs', async () => {
      const { useSeo } = await import('../useSeo');
      const image = ref<{ src: string } | undefined>(undefined);

      useSeo({
        title: 'Project title',
        description: 'Project description',
        image,
      });

      const beforeCall = lastCall();

      expect(resolveValue(beforeCall.ogImage)).toBe(
        'https://alexisbesson.fr/img/og-default.jpg',
      );

      image.value = { src: '/img/Projects/Arneo_Cover.jpg' };

      const afterCall = lastCall();

      expect(resolveValue(afterCall.ogImage)).toBe(
        'https://alexisbesson.fr/img/Projects/_gen/Arneo_Cover-og.jpg',
      );
    });

    it('joins the path without a double slash when the site origin has a trailing slash', async () => {
      useSiteConfigMock.mockReturnValueOnce({
        url: 'https://alexisbesson.fr/',
        name: 'Alexis Besson',
      });

      const { useSeo } = await import('../useSeo');

      useSeo({
        title: 'Project title',
        description: 'Project description',
        image: { src: '/img/Projects/Arneo_Cover.jpg' },
      });

      const call = lastCall();

      expect(resolveValue(call.ogImage)).toBe(
        'https://alexisbesson.fr/img/Projects/_gen/Arneo_Cover-og.jpg',
      );
    });

    // Covered at the composable level, not by mounting the page: the
    // content-collection/TOC harness needed to mount [slug].vue is too heavy
    // for this unit spec.
    it('emits the recadrée variant and resolved-title alt once the page-like coverImage computed settles', async () => {
      const { useSeo } = await import('../useSeo');
      const project = ref<{ cover?: { src: string } } | undefined>(undefined);
      const coverImage = ref<{ src: string } | undefined>(undefined);

      useSeo({
        title: 'Project title',
        description: 'Project description',
        image: coverImage,
      });

      project.value = { cover: { src: '/img/Projects/Arneo_Cover.jpg' } };
      coverImage.value = project.value.cover;

      const call = lastCall();

      expect(resolveValue(call.ogImage)).toBe(
        'https://alexisbesson.fr/img/Projects/_gen/Arneo_Cover-og.jpg',
      );
      expect(resolveValue(call.ogImageAlt)).toBe('Project title');
    });
  });
});
