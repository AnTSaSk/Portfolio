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

  useSchemaOrg([
    definePerson({
      name: 'Alexis Besson',
      url: baseUrl.value,
      jobTitle: 'Lead Front-end Developer',
      sameAs: [LINK_EXTERNAL_GITHUB, LINK_EXTERNAL_LINKEDIN],
    }),
    defineWebSite({
      name: 'Alexis Besson Portfolio',
    }),
    defineWebPage(),
  ]);
</script>

<style lang="scss" src="./style.scss"></style>
