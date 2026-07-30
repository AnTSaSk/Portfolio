<template>
  <section class="o-listing">
    <div class="o-listing__inner">
      <div v-if="$slots.filter" class="o-listing__filter">
        <slot name="filter" />
      </div>

      <div v-if="$slots.preGrid" class="o-listing__preGrid">
        <slot name="preGrid" />
      </div>

      <div class="o-listing__grid" :class="gridModifier">
        <slot />
      </div>

      <div v-if="$slots.pagination" class="o-listing__pagination">
        <slot name="pagination" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  export type ListingGridVariant = 'auto-fill' | '2up';

  export interface Props {
    gridVariant?: ListingGridVariant;
  }

  defineOptions({ name: 'OrganismListing' });

  const { gridVariant = 'auto-fill' } = defineProps<Props>();

  const gridModifier = computed(() =>
    gridVariant === '2up' ? '-twoUp' : '-autoFill',
  );
</script>

<style src="./style.css" />
