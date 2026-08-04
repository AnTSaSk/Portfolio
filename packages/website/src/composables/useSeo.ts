import { isRef, toValue, type MaybeRefOrGetter } from 'vue';

const BRAND_ALT = 'Alexis Besson, portfolio';
const DEFAULT_OG_IMAGE_PATH = '/img/og-default.jpg';

interface UseSeoOptions {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  type?: 'website' | 'article';
  image?: MaybeRefOrGetter<{ src: string } | undefined>;
}

// Preserves reactivity (ref/getter) for useSeoMeta while forwarding plain
// strings as-is, matching what useSeoMeta itself accepts.
const resolve = (value: MaybeRefOrGetter<string>): string | (() => string) =>
  isRef(value) || typeof value === 'function' ? () => toValue(value) : value;

export const useSeo = (options: UseSeoOptions): void => {
  const { title, description, type = 'website', image } = options;
  const { locale } = useI18n();
  const siteConfig = useSiteConfig();
  const img = useImage();

  // Getters (not resolved once): image/title resolve asynchronously on
  // [slug] pages, whose useAsyncData is not awaited before useSeo runs.
  const ogImageGetter = (): string => {
    const resolvedImage = toValue(image);
    const path = resolvedImage?.src
      ? img(resolvedImage.src, {
          width: 1200,
          height: 630,
          fit: 'cover',
          format: 'jpeg',
        })
      : DEFAULT_OG_IMAGE_PATH;

    return new URL(path, siteConfig.url).href;
  };

  const imageAltGetter = (): string => {
    const resolvedImage = toValue(image);

    return resolvedImage?.src ? toValue(title) : BRAND_ALT;
  };

  useSeoMeta({
    title: resolve(title),
    description: resolve(description),
    ogTitle: resolve(title),
    ogDescription: resolve(description),
    ogType: type,
    ogSiteName: siteConfig.name,
    ogLocale: locale.value,
    ogImage: ogImageGetter,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: imageAltGetter,
    twitterCard: 'summary_large_image',
    twitterTitle: resolve(title),
    twitterDescription: resolve(description),
    twitterImage: ogImageGetter,
    twitterImageAlt: imageAltGetter,
  });
};
