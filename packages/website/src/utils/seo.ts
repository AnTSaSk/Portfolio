/**
 * getCurrentUrl
 *
 * @returns {string}
 */
export const getCurrentUrl = (): string => {
  const runtimeConfig = useRuntimeConfig();

  let currentUrl: URL = new URL(runtimeConfig.public.baseUrl);

  onNuxtReady(() => {
    if (window && (window.location.pathname || window.location.search)) {
      currentUrl = new URL(
        `${window.location.pathname}${window.location.search}`,
        import.meta.url,
      );

      return currentUrl.toString();
    }
  });

  return currentUrl.toString();
};

/**
 * generateHeadMeta
 *
 * @param   {string}  title
 * @param   {string}  description
 * @param   {string}  image?
 *
 * @returns {Meta[]}
 */
export const generateHeadMeta = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) => {
  const { t } = useI18n();
  const runtimeConfig = useRuntimeConfig();

  const currentUrl = getCurrentUrl();
  let currentOrigin = runtimeConfig.public.baseUrl || '';

  onNuxtReady(() => {
    currentOrigin = window.location.origin;
  });

  return [
    // {
    //   property: 'title',
    //   content: title,
    // },
    {
      property: 'description',
      content: description,
    },

    // OpenGraph Data
    {
      property: 'og:site_name',
      content: t('seo.meta.title.generic'),
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: currentUrl,
    },
    {
      property: 'og:image',
      content: image || `${currentOrigin}/SocialNetworkBanner.webp`,
    },

    // Twitter Card
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:site',
      content: currentUrl,
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      property: 'twitter:description',
      content: description,
    },
    {
      property: 'twitter:create',
      content: '@AlexisBessonWeb',
    },
    {
      property: 'twitter:image:src',
      content: image || `${currentOrigin}/SocialNetworkBanner.webp`,
    },
  ];
};
