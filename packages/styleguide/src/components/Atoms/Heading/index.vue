<template>
  <component :is="tag" :class="`a-heading -${variant}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
  export type Variant =
    | 'h1-regular'
    | 'h2-regular'
    | 'h3-medium'
    | 'h4-semibold'
    | 'h5-semibold';

  export type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  export interface Props {
    tag?: Tag;
    variant?: Variant;
  }

  defineOptions({
    name: 'AtomHeading',
  });

  const { tag = 'h1', variant = 'h1-regular' } = defineProps<Props>();
</script>

<style scoped lang="scss" src="./style.scss"></style>
