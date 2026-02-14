<template>
  <Component
    :is="getTag"
    :class="`a-cta -${variant}`"
    :href="href"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
  >
    <slot />
  </Component>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  export type Tag = 'a' | 'button';

  export type Variant = 'main' | 'text';

  export interface Props {
    variant: Variant;
    href?: string;
    disabled?: boolean;
  }

  defineOptions({
    name: 'AtomCTA',
  });

  const { variant, href = undefined, disabled = false } = defineProps<Props>();

  const getTag = computed((): Tag => {
    if (href) {
      return 'a';
    }

    return 'button';
  });
</script>

<style scoped lang="scss" src="./style.scss" />
