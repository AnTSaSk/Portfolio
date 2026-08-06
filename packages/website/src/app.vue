<template>
  <div aria-hidden="true" class="l-spriteHost" v-html="sprite" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  import sprite from '@antsask/styleguide/src/assets/sprite.svg?raw';

  import { AUTHOR_PHOTO_PATH } from '@/constants/assets';

  const { url, name } = useSiteConfig();
  const { locale } = useI18n();

  // i18n SEO tags (hreflang alternates, canonical, og:locale) for every route.
  const localeHead = useLocaleHead();
  useHead(localeHead);

  // Global Person: disambiguates the homonym-prone name across every page.
  // WebSite: no potentialAction/SearchAction, no site search exists.
  useSchemaOrg([
    {
      '@type': 'Person',
      '@id': `${url}/#identity`,
      name: 'Alexis Besson',
      jobTitle: 'Lead Front-end JS/TS, Vue 3 / Nuxt',
      url,
      image: `${url}${AUTHOR_PHOTO_PATH}`,
      email: 'mailto:me@alexisbesson.fr',
      sameAs: [
        'https://www.linkedin.com/in/alexis-besson-lead-front',
        'https://github.com/AnTSaSk',
        'https://x.com/AlexisBessonWeb',
      ],
    },
    {
      '@type': 'WebSite',
      name,
      url,
      inLanguage: locale.value,
    },
  ]);
</script>
