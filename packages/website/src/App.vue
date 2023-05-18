<template>
  <NuxtLayout :name="getLayoutName">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  // Utils
  import { logDecoration } from '@/utils/easteregg';

  const runtimeConfig = useRuntimeConfig();

  /**
   * getLayoutName
   *
   * @returns {string}
   */
  const getLayoutName = computed((): string => {
    if (runtimeConfig.public.layout === 'landing') {
      return 'landing';
    }

    return 'default';
  });

  /********************/
  /**** LIFECYCLES ****/
  /********************/
  onMounted(() => {
    logDecoration();
  });
</script>
