<template>
  <div class="t-error">
    <Logo class="t-error__logo" aria-hidden="true" />

    <div class="t-error__content" role="alert">
      <Heading tag="h1" variant="h1-regular">
        {{ title }}
      </Heading>

      <Paragraph>
        {{ description }}
      </Paragraph>

      <CTA variant="main" @click="handleError">
        {{ t('error.back') }}
      </CTA>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { NuxtError } from '#app';

  import { ROUTE_COMMON_ERROR } from '@/constants/routes';

  import { CTA, Heading, Paragraph } from '@antsask/styleguide';

  import { clearError } from '#app';
  import Logo from '@/assets/images/logo.svg';

  defineOptions({
    name: ROUTE_COMMON_ERROR,
  });

  const { t } = useI18n();

  interface Props {
    error: NuxtError;
  }

  const { error } = defineProps<Props>();

  const title = computed((): string => {
    if (error.status === 404) {
      return t('error.title.404');
    }
    return t('error.title.default');
  });

  const description = computed((): string => {
    if (error.status === 404) {
      return t('error.description.404');
    }
    return t('error.description.default');
  });

  const handleError = () => clearError({ redirect: '/' });

  useHead(() => ({
    title: `${title.value} - Alexis Besson`,
  }));
</script>

<style scoped lang="scss" src="./error.scss" />
