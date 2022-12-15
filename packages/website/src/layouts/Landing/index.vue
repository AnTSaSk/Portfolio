<template>
  <main class="t-page -landing">
    <suspense>
      <template #default>
        <router-view></router-view>
      </template>
      <template #fallback> Loading... </template>
    </suspense>
  </main>
</template>

<script lang="ts">
  export default {
    name: 'LayoutLanding',
  };
</script>

<script setup lang="ts">
  import { useHead } from '@vueuse/head';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  useHead({
    title: t('seo.meta.title.landing'),
    meta: [
      {
        key: 'desc',
        name: 'description',
        content: computed(() => t('seo.meta.title.landing')),
      },
    ],
  });
</script>

<style lang="scss" src="./style.scss"></style>
