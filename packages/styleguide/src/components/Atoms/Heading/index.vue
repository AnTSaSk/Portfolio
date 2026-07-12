<template>
  <component :is="resolvedTag" :class="classes">
    <slot />
  </component>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'a';
  export type HeadingTone = 'default' | 'muted' | 'accent';

  export interface Props {
    level?: HeadingLevel;
    tag?: HeadingTag;
    tone?: HeadingTone;
    uppercase?: boolean;
    balance?: boolean;
  }

  defineOptions({ name: 'AtomHeading' });

  const {
    level = 'h2',
    tag = undefined,
    tone = 'default',
    uppercase = false,
    balance = true,
  } = defineProps<Props>();

  const resolvedTag = computed(() => tag ?? level);

  const classes = computed(() => [
    'a-heading',
    `-${level}`,
    tone !== 'default' && `-${tone}`,
    uppercase && '-uppercase',
    !balance && '-noBalance',
  ]);
</script>

<style src="./style.css" />
