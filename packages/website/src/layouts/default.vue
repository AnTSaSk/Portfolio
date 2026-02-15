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

<script setup lang="ts">
  // Constants
  import { ROUTE_LAYOUT_DEFAULT } from '@/constants/routes';

  defineOptions({
    name: ROUTE_LAYOUT_DEFAULT,
  });

  const { t } = useI18n();
  const route = useRoute();

  const head = useLocaleHead({
    dir: true,
    seo: true,
  });

  const title = computed((): string => t(route.meta.title as string));

  const { applySeoMeta } = useSeo();
  applySeoMeta(title);
</script>

<style lang="scss" src="./style.scss"></style>
