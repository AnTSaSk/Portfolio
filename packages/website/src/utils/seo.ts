import i18n from '@/i18n';

/**
 * getCurrentUrl
 *
 * @returns {string}
 */
export const getCurrentUrl = (): string => {
  let currentUrl = import.meta.env.VUE_APP_HOST_URL;

  if (window.location.pathname || window.location.search) {
    currentUrl = new URL(
      `${window.location.pathname}${window.location.search}`,
      currentUrl,
    );
  }

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
  const { t } = i18n.global;

  const currentUrl = getCurrentUrl();
  const currentOrigin = window.location.origin;

  return [
    {
      name: 'title',
      content: t(title),
    },
    {
      name: 'description',
      content: t(description),
    },

    // OpenGraph Data
    {
      name: 'og:site_name',
      content: t('seo.meta.title.generic'),
    },
    {
      name: 'og:title',
      content: t(title),
    },
    {
      name: 'og:description',
      content: t(description),
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'og:url',
      content: currentUrl,
    },
    {
      name: 'og:image',
      content: image || `${currentOrigin}/SocialNetworkBanner.webp`,
    },

    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:site',
      content: currentUrl,
    },
    {
      name: 'twitter:title',
      content: t(title),
    },
    {
      name: 'twitter:description',
      content: t(description),
    },
    {
      name: 'twitter:create',
      content: '@AlexisBessonWeb',
    },
    {
      name: 'twitter:image:src',
      content: image || `${currentOrigin}/SocialNetworkBanner.webp`,
    },
  ];
};
