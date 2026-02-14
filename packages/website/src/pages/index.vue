<template>
  <div class="o-landing">
    <Logo class="a-logo" />

    <div class="o-landing__content">
      <h1 class="o-landing__title">Alexis Besson</h1>
      <h2 class="o-landing__subtitle">{{ t('view.landing.subtitle') }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Constants
  import { ROUTE_COMMON_HOMEPAGE } from '@/constants/routes';

  // Assets
  import Logo from '@/assets/images/logo.svg';

  defineOptions({
    name: ROUTE_COMMON_HOMEPAGE,
  });

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

<style scoped lang="scss" src="./style.scss"></style>
