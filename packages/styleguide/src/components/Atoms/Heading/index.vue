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
    variant?: Variant;
    tag?: Tag;
  }

  withDefaults(defineProps<Props>(), {
    variant: 'h1Regular',
    tag: 'h1',
  });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./style.scss"></style>
