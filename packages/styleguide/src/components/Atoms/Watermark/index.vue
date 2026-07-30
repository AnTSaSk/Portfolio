<template>
  <div
    class="a-watermark"
    :style="{ '--wm-chars': text.length }"
    aria-hidden="true"
  >
    {{ text }}
  </div>
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
