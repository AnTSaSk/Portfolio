<template>
  <NuxtLayout :name="getLayoutName">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  // Utils
  import { logDecoration } from '@/utils/easteregg';

  defineOptions({
    name: 'App',
  });

  const runtimeConfig = useRuntimeConfig();

  const getLayoutName = computed((): 'landing' | 'default' => {
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
