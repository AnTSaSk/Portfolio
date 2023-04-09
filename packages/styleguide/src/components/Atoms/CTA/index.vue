<template>
  <Component
    :is="getTag"
    :class="`a-cta -${variant}`"
    :href="href"
    :disabled="disabled"
  >
    <slot />
  </Component>
</template>

<script lang="ts">
  export default {
    name: 'AtomCTA',
  };
</script>

<script setup lang="ts">
  import { computed } from 'vue';

  // Types
  import type { Tag, Variant } from './index.d';

  export interface Props {
    variant: Variant;
    href?: string;
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    // tag: 'a',
    href: undefined,
    disabled: false,
  });

  /**
   * getTag
   *
   * @returns {Tag}
   */
  const getTag = computed((): Tag => {
    if (props.href) {
      return 'a';
    }

    return 'button';
  });
</script>

<style scoped lang="scss" src="./style.scss" />
