<template>
  <nav class="m-toc" :aria-label="label">
    <div class="m-toc__head">
      <Text variant="tag">{{ label }}</Text>
    </div>
    <ul class="m-toc__list">
      <li
        v-for="item in items"
        :key="item.id"
        class="m-toc__item"
        :class="{ '-active': item.id === activeId, '-sub': item.sub }"
      >
        <a
          class="m-toc__link"
          :href="'#' + item.id"
          :aria-current="item.id === activeId ? 'location' : undefined"
          @click.prevent="emit('select', item.id)"
        >
          <Text variant="bodyS">{{ item.label }}</Text>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import Text from '../../Atoms/Text/index.vue';

  export interface TOCItem {
    id: string;
    label: string;
    sub?: boolean;
  }

  export interface Props {
    items: TOCItem[];
    activeId?: string;
    label?: string;
  }

  defineOptions({ name: 'MoleculeTOC' });

  withDefaults(defineProps<Props>(), {
    activeId: undefined,
    label: 'Sommaire',
  });

  const emit = defineEmits<{
    select: [id: string];
  }>();
</script>

<style src="./style.css" />
