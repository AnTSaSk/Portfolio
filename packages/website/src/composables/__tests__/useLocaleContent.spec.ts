import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref, type Ref } from 'vue';

describe('useLocaleContent', () => {
  let currentLocale: Ref<string>;

  beforeEach(() => {
    currentLocale = ref('en');
    vi.stubGlobal(
      'useI18n',
      vi.fn(() => ({ locale: currentLocale })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves the "blogEn" collection when type is "blog" and locale is "en"', async () => {
    const { useLocaleContent } = await import('../useLocaleContent');
    const { collection } = useLocaleContent('blog');

    expect(collection.value).toBe('blogEn');
  });

  it('resolves the "blogFr" collection when type is "blog" and locale is "fr"', async () => {
    currentLocale.value = 'fr';

    const { useLocaleContent } = await import('../useLocaleContent');
    const { collection } = useLocaleContent('blog');

    expect(collection.value).toBe('blogFr');
  });

  it('resolves the "projectsFr" collection when type is "projects" and locale is "fr"', async () => {
    currentLocale.value = 'fr';

    const { useLocaleContent } = await import('../useLocaleContent');
    const { collection } = useLocaleContent('projects');

    expect(collection.value).toBe('projectsFr');
  });

  it('resolves the "legalEn" collection when type is "legal" and locale is "en"', async () => {
    const { useLocaleContent } = await import('../useLocaleContent');
    const { collection } = useLocaleContent('legal');

    expect(collection.value).toBe('legalEn');
  });

  it('updates the collection name reactively when the locale changes', async () => {
    const { useLocaleContent } = await import('../useLocaleContent');
    const { collection } = useLocaleContent('blog');

    expect(collection.value).toBe('blogEn');

    currentLocale.value = 'fr';

    expect(collection.value).toBe('blogFr');
  });

  it('preserves the same base collection identifier across locales, only the locale suffix differs', async () => {
    const { useLocaleContent } = await import('../useLocaleContent');

    currentLocale.value = 'en';
    const enValue = useLocaleContent('projects').collection.value;

    currentLocale.value = 'fr';
    const frValue = useLocaleContent('projects').collection.value;

    expect(enValue.replace(/En$/, '')).toBe(frValue.replace(/Fr$/, ''));
  });
});
