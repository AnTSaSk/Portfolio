<template>
  <component :is="tag" :class="`a-paragraph -${variant}`">
    <slot />
  </component>
</template>

<script setup lang="ts">
  export type Variant =
    | 'b1SemiBold'
    | 'b1Medium'
    | 'b1Regular'
    | 'b2SemiBold'
    | 'b2Medium'
    | 'b2Regular'
    | 'b3SemiBold'
    | 'b3Medium'
    | 'b3Regular';

  export type Tag = 'p' | 'span' | 'div';

  export interface Props {
    tag?: Tag;
    variant?: Variant;
  }

  defineOptions({
    name: 'AtomParagraph',
  });

  const { tag = 'p', variant = 'b1SemiBold' } = defineProps<Props>();
</script>

<style scoped lang="scss" src="./style.scss"></style>
