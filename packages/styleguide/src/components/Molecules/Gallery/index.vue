<template>
  <section class="m-gallery" :class="variantModifier" :aria-label="ariaLabel">
    <figure v-for="(item, index) in items" :key="index" class="m-gallery__fig">
      <div class="m-gallery__media">
        <Image
          v-if="item.image"
          reveal
          :src="item.image.src"
          :alt="item.image.alt"
          :sources="item.image.sources"
          :srcset="item.image.srcset"
          :width="item.image.width"
          :height="item.image.height"
          :sizes="sizesForIndex(index)"
        >
          <template #placeholder>
            <div class="u-placeholder" />
          </template>
        </Image>
        <div v-else class="u-placeholder" />

        <figcaption v-if="item.caption" class="m-gallery__cap">
          <Text variant="tag">{{ item.caption }}</Text>
        </figcaption>
      </div>
    </figure>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Image, { type ImageSource } from '../../Atoms/Image/index.vue';
  import Text from '../../Atoms/Text/index.vue';

  export type GalleryVariant = 'styleA' | 'threeUp';

  export interface GalleryImage {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    sources?: ImageSource[];
    srcset?: string;
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

  const HERO_SIZES = '(min-width: 1280px) 1280px, 100vw';
  const TILE_SIZES = '(min-width: 768px) 632px, 100vw';

  // First item is the hero (full-width 16/9), the rest are tiles.
  const sizesForIndex = (index: number): string =>
    index === 0 ? HERO_SIZES : TILE_SIZES;
</script>

<style src="./style.css" />
