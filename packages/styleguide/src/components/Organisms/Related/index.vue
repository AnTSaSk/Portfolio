<template>
  <section class="o-related" :aria-label="ariaLabel">
    <div class="o-related__inner">
      <Text variant="eyebrow" tone="accent">{{ eyebrow }}</Text>
      <div class="o-related__grid">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import Text from '../../Atoms/Text/index.vue';

  export interface Props {
    eyebrow: string;
    ariaLabel?: string;
  }

  defineOptions({ name: 'OrganismRelated' });

  const { eyebrow, ariaLabel = 'Related content' } = defineProps<Props>();
</script>

<style src="./style.css" />
