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

<script lang="ts">
  export default {
    name: ROUTE_LAYOUT_LANDING,
  };
</script>

<script setup lang="ts">
  // Constants
  import { ROUTE_LAYOUT_LANDING } from '@/constants/routes';

  // Utils
  import { generateHeadMeta } from '@/utils/seo';

  const { t } = useI18n();
  const route = useRoute();

  const head = useLocaleHead({
    addDirAttribute: true,
    addSeoAttributes: true,
    identifierAttribute: 'id',
  });

  const title = computed(() => t(route.meta.title as string));
  const description = computed(() => t(route.meta.description as string));

  useHead({
    htmlAttrs: {
      dir: head.value.htmlAttrs?.dir || 'ltr',
      lang: head.value.htmlAttrs?.lang || 'en',
    },
    link: [...(head.value.link || [])],
    meta: [
      ...(head.value.meta || []),
      ...generateHeadMeta({
        title: title.value,
        description: description.value,
      }),
    ],
  });
</script>

<style lang="scss" src="./style.scss"></style>
