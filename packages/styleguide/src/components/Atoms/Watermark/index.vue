<template>
  <svg
    class="a-watermark"
    viewBox="0 0 1085 90"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <text x="542.5" y="78" text-anchor="middle">{{ text }}</text>
  </svg>
</template>

<script lang="ts">
  export default {
    name: 'AtomWatermark',
  };
</script>

<script setup lang="ts">
  export interface Props {
    text?: string;
  }

  const { text = '' } = defineProps<Props>();
</script>

<style src="./style.css" />
