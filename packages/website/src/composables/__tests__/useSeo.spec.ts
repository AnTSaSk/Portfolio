import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';

const mockT = vi.fn((key: string) => key);
const mockLocale = ref('en');
const mockRoute = {
  meta: { description: 'seo.meta.description.landing' },
  fullPath: '/about',
};
const mockRuntimeConfig = {
  public: { baseUrl: 'https://test.example.com' },
};
const mockUseSeoMeta = vi.fn();

// Nuxt auto-imports are globals - stub them before importing useSeo
vi.stubGlobal('useI18n', () => ({ t: mockT, locale: mockLocale }));
vi.stubGlobal('useRoute', () => mockRoute);
vi.stubGlobal('useRuntimeConfig', () => mockRuntimeConfig);
vi.stubGlobal('useSeoMeta', (...args: unknown[]) => mockUseSeoMeta(...args));
vi.stubGlobal('computed', computed);

// Import AFTER stubs
const { useSeo } = await import('../useSeo');

describe('useSeo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocale.value = 'en';
    mockRoute.meta.description = 'seo.meta.description.landing';
    mockRoute.fullPath = '/about';
    mockRuntimeConfig.public.baseUrl = 'https://test.example.com';
  });

  describe('baseUrl', () => {
    it('returns runtimeConfig public baseUrl', () => {
      const { baseUrl } = useSeo();

      expect(baseUrl.value).toBe('https://test.example.com');
    });

    it('falls back to https://alexisbesson.fr when baseUrl is empty', () => {
      mockRuntimeConfig.public.baseUrl = '';
      const { baseUrl } = useSeo();

      expect(baseUrl.value).toBe('https://alexisbesson.fr');
    });
  });

  describe('description', () => {
    it('calls t() with route.meta.description key', () => {
      const { description } = useSeo();

      expect(description.value).toBe('seo.meta.description.landing');
      expect(mockT).toHaveBeenCalledWith('seo.meta.description.landing');
    });
  });

  describe('ogLocale', () => {
    it('returns en_US when locale is en', () => {
      const { ogLocale } = useSeo();

      expect(ogLocale.value).toBe('en_US');
    });

    it('returns fr_FR when locale is fr', () => {
      mockLocale.value = 'fr';
      const { ogLocale } = useSeo();

      expect(ogLocale.value).toBe('fr_FR');
    });
  });

  describe('ogLocaleAlternate', () => {
    it('returns ["fr_FR"] when locale is en', () => {
      const { ogLocaleAlternate } = useSeo();

      expect(ogLocaleAlternate.value).toEqual(['fr_FR']);
    });

    it('returns ["en_US"] when locale is fr', () => {
      mockLocale.value = 'fr';
      const { ogLocaleAlternate } = useSeo();

      expect(ogLocaleAlternate.value).toEqual(['en_US']);
    });
  });

  describe('ogUrl', () => {
    it('concatenates baseUrl and route.fullPath', () => {
      const { ogUrl } = useSeo();

      expect(ogUrl.value).toBe('https://test.example.com/about');
    });
  });

  describe('ogImage', () => {
    it('builds social banner URL from baseUrl', () => {
      const { ogImage } = useSeo();

      expect(ogImage.value).toBe(
        'https://test.example.com/SocialNetworkBanner.webp',
      );
    });
  });

  describe('applySeoMeta', () => {
    it('calls useSeoMeta with correct properties', () => {
      const { applySeoMeta } = useSeo();
      const title = ref('Test Title');

      applySeoMeta(title);

      expect(mockUseSeoMeta).toHaveBeenCalledOnce();
      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          ogType: 'website',
          ogImageWidth: 1200,
          ogImageHeight: 630,
          twitterCard: 'summary_large_image',
          twitterCreator: '@AlexisBessonWeb',
        }),
      );
    });

    it('passes reactive getters for dynamic SEO values', () => {
      const { applySeoMeta } = useSeo();
      const title = ref('Test Title');

      applySeoMeta(title);

      const meta = mockUseSeoMeta.mock.calls[0][0];

      expect(meta.title()).toBe('Test Title');
      expect(meta.description()).toBe('seo.meta.description.landing');
      expect(meta.ogTitle()).toBe('Test Title');
      expect(meta.ogDescription()).toBe('seo.meta.description.landing');
      expect(meta.ogUrl()).toBe('https://test.example.com/about');
      expect(meta.ogImage()).toBe(
        'https://test.example.com/SocialNetworkBanner.webp',
      );
      expect(meta.ogImageAlt()).toBe('Test Title');
      expect(meta.ogLocale()).toBe('en_US');
      expect(meta.ogLocaleAlternate()).toEqual(['fr_FR']);
      expect(meta.ogSiteName()).toBe('seo.meta.title.generic');
      expect(meta.twitterTitle()).toBe('Test Title');
      expect(meta.twitterDescription()).toBe('seo.meta.description.landing');
      expect(meta.twitterImage()).toBe(
        'https://test.example.com/SocialNetworkBanner.webp',
      );
    });
  });
});
