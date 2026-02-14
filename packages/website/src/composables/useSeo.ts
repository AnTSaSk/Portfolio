export const useSeo = () => {
  const { t, locale } = useI18n();
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

  const baseUrl = computed(
    (): string => runtimeConfig.public.baseUrl || 'https://alexisbesson.fr',
  );

  const description = computed((): string =>
    t(route.meta.description as string),
  );

  const ogLocale = computed((): string =>
    locale.value === 'fr' ? 'fr_FR' : 'en_US',
  );

  const ogLocaleAlternate = computed((): string[] =>
    locale.value === 'fr' ? ['en_US'] : ['fr_FR'],
  );

  const ogUrl = computed((): string => `${baseUrl.value}${route.fullPath}`);

  const ogImage = computed(
    (): string => `${baseUrl.value}/SocialNetworkBanner.webp`,
  );

  const applySeoMeta = (title: Ref<string> | ComputedRef<string>) => {
    useSeoMeta({
      title: () => title.value,
      description: () => description.value,
      ogTitle: () => title.value,
      ogDescription: () => description.value,
      ogType: 'website',
      ogUrl: () => ogUrl.value,
      ogImage: () => ogImage.value,
      ogImageWidth: 1200,
      ogImageHeight: 630,
      ogImageAlt: () => title.value,
      ogLocale: () => ogLocale.value,
      ogLocaleAlternate: () => ogLocaleAlternate.value,
      ogSiteName: () => t('seo.meta.title.generic'),
      twitterCard: 'summary_large_image',
      twitterTitle: () => title.value,
      twitterDescription: () => description.value,
      twitterCreator: '@AlexisBessonWeb',
      twitterImage: () => ogImage.value,
    });
  };

  return {
    baseUrl,
    description,
    ogLocale,
    ogLocaleAlternate,
    ogUrl,
    ogImage,
    applySeoMeta,
  };
};
