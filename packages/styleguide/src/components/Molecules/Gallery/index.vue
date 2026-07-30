<template>
  <section class="m-gallery" :class="variantModifier" :aria-label="ariaLabel">
    <figure v-for="(item, index) in items" :key="index" class="m-gallery__fig">
      <div class="m-gallery__media">
        <Image
          v-if="item.image"
          reveal
          :image-component="imageComponent"
          :src="item.image.src"
          :alt="item.image.alt"
          :width="item.image.width"
          :height="item.image.height"
          :sizes="sizesForIndex(index)"
          format="avif,webp"
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
  import { computed, type Component } from 'vue';

  import Image from '../../Atoms/Image/index.vue';
  import Text from '../../Atoms/Text/index.vue';

  export type GalleryVariant = 'styleA' | 'threeUp';

  export interface GalleryImage {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }

  export interface GalleryItem {
    image?: GalleryImage;
    caption?: string;
  }

  export interface Props {
    items: GalleryItem[];
    ariaLabel?: string;
    variant?: GalleryVariant;
    imageComponent?: Component;
  }

  defineOptions({ name: 'MoleculeGallery' });

  const {
    items,
    ariaLabel = 'Project gallery',
    variant = 'styleA',
    imageComponent = undefined,
  } = defineProps<Props>();

  const variantModifier = computed(() =>
    variant === 'threeUp' ? '-threeUp' : undefined,
  );

  // @nuxt/image `sizes` syntax (breakpoint prefixes), not CSS media queries.
  const HERO_SIZES = '100vw xl:1280px';
  const TILE_SIZES = '100vw md:632px';

  // First item is the hero (full-width 16/9), the rest are tiles.
  const sizesForIndex = (index: number): string =>
    index === 0 ? HERO_SIZES : TILE_SIZES;
</script>

<style src="./style.css" />
