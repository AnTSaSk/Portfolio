<template>
  <figure class="m-mediaCover" :class="variantModifier">
    <div class="m-mediaCover__frame" :class="frameClasses">
      <Image
        v-if="image"
        reveal
        :src="image.src"
        :alt="image.alt"
        :sources="image.sources"
        :srcset="image.srcset"
        :width="image.width"
        :height="image.height"
        :sizes="POSTER_SIZES"
        :fetchpriority="fetchpriority"
        :loading="loading"
      >
        <template #placeholder>
          <div class="u-placeholder" :class="placeholderClasses">
            <figcaption v-if="category" class="m-mediaCover__cat">
              <Text tag="span" variant="tag" class="m-mediaCover__catLabel">
                {{ category }}
              </Text>
            </figcaption>
          </div>
        </template>
      </Image>
      <div v-else class="u-placeholder" :class="placeholderClasses">
        <figcaption v-if="category" class="m-mediaCover__cat">
          <Text tag="span" variant="tag" class="m-mediaCover__catLabel">
            {{ category }}
          </Text>
        </figcaption>
      </div>
    </div>

    <figcaption v-if="caption" class="m-mediaCover__cap">
      <Text v-if="eyebrow" variant="eyebrow">{{ eyebrow }}</Text>
      <Text variant="caption">{{ caption }}</Text>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Image, { type ImageSource } from '../../Atoms/Image/index.vue';
  import Text from '../../Atoms/Text/index.vue';

  export type MediaCoverVariant = 'cover' | 'poster';
  export type MediaCoverRatio = '16x9' | '4x3' | '1x1' | 'portrait';
  export type MediaCoverPlaceholderVariant = 'topLeft' | 'topRight' | 'bottom';

  export interface MediaCoverImage {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    sources?: ImageSource[];
    srcset?: string;
  }

  export interface Props {
    variant?: MediaCoverVariant;
    image?: MediaCoverImage;
    placeholderVariant?: MediaCoverPlaceholderVariant;
    placeholderHeading?: boolean;
    ratio?: MediaCoverRatio;
    caption?: string;
    eyebrow?: string;
    category?: string;
    fetchpriority?: 'high' | 'low' | 'auto';
    loading?: 'lazy' | 'eager';
  }

  defineOptions({ name: 'MoleculeMediaCover' });

  const {
    variant = 'cover',
    image = undefined,
    placeholderVariant = 'topLeft',
    placeholderHeading = false,
    ratio = undefined,
    caption = undefined,
    eyebrow = undefined,
    category = undefined,
    fetchpriority = undefined,
    loading = undefined,
  } = defineProps<Props>();

  const POSTER_SIZES = '(min-width: 1280px) 1280px, 100vw';

  const ratioClasses: Record<MediaCoverRatio, string> = {
    '16x9': '-ratio16x9',
    '4x3': '-ratio4x3',
    '1x1': '-ratio1x1',
    portrait: '-ratioPortrait',
  };

  const variantModifier = computed(() => `-${variant}`);

  const placeholderClasses = computed(() => [
    placeholderVariant === 'topLeft' ? undefined : `-${placeholderVariant}`,
    placeholderHeading ? '-big' : undefined,
  ]);

  const frameClasses = computed(() =>
    variant === 'poster' || !ratio ? undefined : ratioClasses[ratio],
  );
</script>

<style src="./style.css" />
