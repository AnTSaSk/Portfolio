<template>
  <component :is="tag" :class="`a-heading -${variant}`">
    <slot />
  </component>
</template>

<script lang="ts">
  export default {
    name: 'AtomHeading',
  };
</script>
<script setup lang="ts">
  import { Variant, Tag } from './index.d';

  export interface Props {
    tag?: Tag;
    variant?: Variant;
  }

  withDefaults(defineProps<Props>(), {
    tag: 'h1',
    variant: 'h1Regular',
  });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./style.scss"></style>
