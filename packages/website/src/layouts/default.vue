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
      <main class="t-page -default">
        <slot />
      </main>
    </Body>
  </Html>
</template>

<script lang="ts">
  export default {
    name: ROUTE_LAYOUT_DEFAULT,
  };
</script>

<script setup lang="ts">
  import { computed, useI18n, useLocaleHead, useRoute } from '#imports';

  // Constants
  import { ROUTE_LAYOUT_DEFAULT } from '@/constants/routes';

  const { t } = useI18n();
  const route = useRoute();

  const head = useLocaleHead({
    addDirAttribute: true,
    addSeoAttributes: true,
    identifierAttribute: 'id',
  });
  const title = computed(() =>
    t('layouts.title', { title: t(route.meta.title as string) }),
  );
</script>

<style lang="scss" src="./style.scss"></style>
