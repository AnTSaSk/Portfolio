<template>
  <div class="o-landing">
    <Logo class="a-logo" />

    <div class="o-landing__content">
      <h1 class="o-landing__title">Alexis Besson</h1>
      <h2 class="o-landing__subtitle">{{ t('view.landing.subtitle') }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: ROUTE_COMMON_HOMEPAGE,
  };
</script>

<script setup lang="ts">
  // Constants
  import { ROUTE_COMMON_HOMEPAGE } from '@/constants/routes';

  // Assets
  import Logo from '@/assets/images/logo.svg';

  /*********************/
  /**** COMPOSABLES ****/
  /*********************/
  const { t } = useI18n();

  /*************/
  /**** SEO ****/
  /*************/
  definePageMeta({
    title: 'seo.meta.title.landing',
    description: 'seo.meta.description.landing',
  });
</script>

<style lang="scss" src="./style.scss"></style>
