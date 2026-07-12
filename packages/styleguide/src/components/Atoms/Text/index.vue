<template>
  <component :is="tag" :class="classes" :style="style">
    <slot />
  </component>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  export type TextTag = 'p' | 'span' | 'div' | 'li' | 'dd';
  export type TextVariant =
    'body' | 'lede' | 'bodyS' | 'eyebrow' | 'cta' | 'caption' | 'tag';
  export type TextWeight = 'regular' | 'medium' | 'semibold';
  export type TextTone = 'default' | 'muted' | 'accent';

  export interface Props {
    tag?: TextTag;
    variant?: TextVariant;
    weight?: TextWeight;
    tone?: TextTone;
    prose?: boolean;
    truncate?: number | false;
  }

  defineOptions({ name: 'AtomText' });

  const {
    tag = 'p',
    variant = 'body',
    weight = 'regular',
    tone = 'default',
    prose = false,
    truncate = false,
  } = defineProps<Props>();

  const classes = computed(() => [
    'a-text',
    variant !== 'body' && `-${variant}`,
    weight !== 'regular' && `-${weight}`,
    tone !== 'default' && `-${tone}`,
    prose && '-prose',
    truncate !== false && '-truncate',
  ]);

  const style = computed(() =>
    truncate !== false ? { '--truncate-lines': truncate } : undefined,
  );
</script>

<style src="./style.css" />
