<template>
  <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
    <Head>
      <Title>{{ title }}</Title>
      <template v-for="link in head.link" :key="link.id">
        <Link
          :id="link.id"
          :rel="link.rel"
          :href="link.href"
          :hreflang="link.hreflang"
        />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <main class="t-page -landing">
        <slot />
      </main>
    </Body>
  </Html>
</template>

<script setup lang="ts">
  // Constants
  import {
    LINK_EXTERNAL_GITHUB,
    LINK_EXTERNAL_LINKEDIN,
    LINK_EXTERNAL_TWITTER,
  } from '@/constants/links';
  import { ROUTE_LAYOUT_LANDING } from '@/constants/routes';

  defineOptions({
    name: ROUTE_LAYOUT_LANDING,
  });

  const { t } = useI18n();
  const route = useRoute();

  const head = useLocaleHead({
    dir: true,
    seo: true,
  });

  const title = computed((): string => t(route.meta.title as string));

  const { baseUrl, applySeoMeta } = useSeo();
  applySeoMeta(title);

  useHead({ titleTemplate: '%s' });

  useSchemaOrg([
    definePerson({
      name: 'Alexis Besson',
      givenName: 'Alexis',
      familyName: 'Besson',
      url: baseUrl.value,
      jobTitle: t('view.landing.subtitle'),
      description: t('seo.meta.description.landing'),
      knowsAbout: [
        'JavaScript',
        'TypeScript',
        'Vue.js',
        'Nuxt',
        'Node.js',
        'React',
        'React Native',
        'Front-end Architecture',
        'Design Systems',
        'Storybook',
        'SCSS',
        'CSS',
        'CI/CD',
        'GitHub Actions',
        'E2E Testing',
        'Unit Testing',
        'Agile',
        'Mentoring',
      ],
      knowsLanguage: ['en', 'fr'],
      worksFor: {
        '@type': 'Organization',
        name: 'Arneo',
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: "Campus Fonderie de l'Image",
      },
      sameAs: [
        LINK_EXTERNAL_GITHUB,
        LINK_EXTERNAL_LINKEDIN,
        LINK_EXTERNAL_TWITTER,
      ],
    }),
    defineWebSite({
      name: t('seo.meta.title.generic'),
      description: t('seo.meta.description.landing'),
      inLanguage: ['en-US', 'fr-FR'],
    }),
    defineWebPage(),
  ]);
</script>

<style lang="scss" src="./style.scss"></style>
