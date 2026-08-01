// Resolves the locale-suffixed Nuxt Content collection name for a content
// type (e.g. 'blog' + 'en' -> 'blogEn'), reactive to locale changes.
import { computed, type ComputedRef } from 'vue';

import type { Collections } from '@nuxt/content';

export type LocaleContentType = 'blog' | 'projects' | 'legal' | 'about';

// Narrows the generated `Collections` keys to the ones matching `T`, so
// callers get a properly typed `keyof Collections` value without a cast at
// every `queryCollection()` call site.
type LocaleContentCollectionName<T extends LocaleContentType> = Extract<
  keyof Collections,
  `${T}En` | `${T}Fr`
>;

interface UseLocaleContentReturn<T extends LocaleContentType> {
  collection: ComputedRef<LocaleContentCollectionName<T>>;
}

export const useLocaleContent = <T extends LocaleContentType>(
  type: T,
): UseLocaleContentReturn<T> => {
  const { locale } = useI18n();

  const collection = computed(
    () =>
      `${type}${locale.value.charAt(0).toUpperCase()}${locale.value.slice(1)}` as LocaleContentCollectionName<T>,
  );

  return { collection };
};
