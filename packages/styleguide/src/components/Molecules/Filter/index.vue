<template>
  <div class="m-filter" role="group" :aria-label="ariaLabel">
    <Text tag="span" variant="tag" class="m-filter__label">{{ label }}</Text>
    <Tag
      v-for="item in items"
      :key="item.id"
      as="button"
      :pressed="item.pressed"
      :count="item.count"
      @click="emit('toggle', item.id)"
    >
      {{ item.label }}
    </Tag>
  </div>
</template>

<script setup lang="ts">
  import Tag from '../../Atoms/Tag/index.vue';
  import Text from '../../Atoms/Text/index.vue';

  export interface FilterItem {
    id: string;
    label: string;
    pressed: boolean;
    count?: number;
  }

  export interface Props {
    items: FilterItem[];
    label?: string;
    ariaLabel?: string;
  }

  defineOptions({ name: 'MoleculeFilter' });

  const {
    items,
    label = 'Filtrer',
    ariaLabel = 'Filtrer par tag',
  } = defineProps<Props>();

  const emit = defineEmits<{
    toggle: [id: string];
  }>();
</script>

<style src="./style.css" />
