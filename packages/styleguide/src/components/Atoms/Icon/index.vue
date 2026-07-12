<template>
  <svg
    class="a-icon"
    :class="[`-${size}`, { '-stroke': stroke }]"
    :aria-hidden="!label || undefined"
    :role="label ? 'img' : undefined"
    :aria-label="label"
  >
    <use :href="`#${name}`" />
  </svg>
</template>

<script setup lang="ts">
  export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  export interface Props {
    name: string;
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
