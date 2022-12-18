<template>
  <div class="o-landing">
    <Logo class="a-logo" />

    <div class="o-landing__content">
      <h1 class="o-landing__title">Alexis Besson</h1>
      <h2 class="o-landing__subtitle">Lead Front-end Developer</h2>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: ROUTER_LANDING,
  };
</script>

<script setup lang="ts">
  import { useHead } from '@vueuse/head';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  // Constants
  import { ROUTER_LANDING } from '@/constants/router';

  // Utils
  import { generateHeadMeta } from '@/utils/seo';

  // Assets
  import Logo from '@/assets/images/logo.svg?component';

  /*********************/
  /**** COMPOSABLES ****/
  /*********************/
  const { t } = useI18n();

  /*************/
  /**** SEO ****/
  /*************/
  useHead({
    title: t('seo.meta.title.landing'),
    meta: computed(() =>
      generateHeadMeta({
        title: 'seo.meta.title.landing',
        description: 'seo.meta.description.landing',
      }),
    ),
  });
</script>

<style lang="scss" src="./style.scss"></style>
