import { useI18n } from 'vue-i18n';

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
  const currentUrl = window.location.href;
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
      content: image || `${currentOrigin}/socialnetwork.webp`,
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
      content: image || `${currentOrigin}/socialnetwork.webp`,
    },
  ];
};
