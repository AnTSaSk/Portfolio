<template>
  <nav class="m-pagination" :aria-label="ariaLabel">
    <button
      type="button"
      class="m-pagination__btn m-pagination__edge"
      :disabled="!hasPrev"
      :aria-label="prevLabel"
      @click="hasPrev && emit('prev')"
    >
      <Text tag="span" variant="bodyS">‹</Text>
    </button>

    <button
      v-for="page in pageNumbers"
      :key="page"
      type="button"
      class="m-pagination__btn"
      :aria-current="page === current ? 'page' : undefined"
      @click="emit('select', page)"
    >
      <Text tag="span" variant="eyebrow">{{
        String(page).padStart(2, '0')
      }}</Text>
    </button>

    <button
      type="button"
      class="m-pagination__btn m-pagination__edge"
      :disabled="!hasNext"
      :aria-label="nextLabel"
      @click="hasNext && emit('next')"
    >
      <Text tag="span" variant="bodyS">›</Text>
    </button>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Text from '@/components/Atoms/Text/index.vue';

  export interface Props {
    pages: number;
    current: number;
    hasPrev: boolean;
    hasNext: boolean;
    ariaLabel?: string;
    prevLabel?: string;
    nextLabel?: string;
  }

  defineOptions({ name: 'MoleculePagination' });

  const {
    pages,
    current,
    hasPrev,
    hasNext,
    ariaLabel = 'Pagination',
    prevLabel = 'Précédent',
    nextLabel = 'Suivant',
  } = defineProps<Props>();

  const emit = defineEmits<{
    select: [page: number];
    prev: [];
    next: [];
  }>();

  const pageNumbers = computed(() =>
    Array.from({ length: pages }, (_, index) => index + 1),
  );
</script>

<style src="./style.css" />
