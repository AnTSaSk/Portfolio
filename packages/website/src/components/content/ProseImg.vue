<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    sizes="100vw md:65vw xl:600px"
    format="avif,webp"
    loading="lazy"
  />
</template>

<script setup lang="ts">
  defineOptions({ name: 'ProseImg' });

  export interface Props {
    src: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
  }

  withDefaults(defineProps<Props>(), {
    alt: '',
    width: undefined,
    height: undefined,
  });
</script>
