<template>
  <svg
    class="a-icon"
    :class="[`-${size}`, { '-stroke': stroke }]"
    :aria-hidden="!label || undefined"
    :role="label ? 'img' : undefined"
    :aria-label="label"
  >
    <use :href.attr="`#${name}`" />
  </svg>
</template>

<script setup lang="ts">
  import type { IconName } from './names';

  export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  export interface Props {
    name: IconName;
    size?: IconSize;
    label?: string;
    stroke?: boolean;
  }

  defineOptions({ name: 'AtomIcon' });

  withDefaults(defineProps<Props>(), {
    size: 'md',
    label: undefined,
    stroke: false,
  });
</script>

<style src="./style.css" />
