<template>
  <section class="m-gallery" :class="variantModifier" :aria-label="ariaLabel">
    <figure v-for="(item, index) in items" :key="index" class="m-gallery__fig">
      <div class="m-gallery__media">
        <Image v-if="item.image" :src="item.image.src" :alt="item.image.alt" />
        <div v-else class="u-placeholder" />
      </div>

      <figcaption v-if="item.caption" class="m-gallery__cap">
        <Text variant="tag">{{ item.caption }}</Text>
      </figcaption>
    </figure>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Image from '@/components/Atoms/Image/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';

  export type GalleryVariant = 'styleA' | 'threeUp';

  export interface GalleryImage {
    src: string;
    alt: string;
  }

  export interface GalleryItem {
    image?: GalleryImage;
    caption?: string;
  }

  export interface Props {
    items: GalleryItem[];
    ariaLabel?: string;
    variant?: GalleryVariant;
  }

  defineOptions({ name: 'MoleculeGallery' });

  const {
    items,
    ariaLabel = 'Project gallery',
    variant = 'styleA',
  } = defineProps<Props>();

  const variantModifier = computed(() =>
    variant === 'threeUp' ? '-threeUp' : undefined,
  );
</script>

<style src="./style.css" />
