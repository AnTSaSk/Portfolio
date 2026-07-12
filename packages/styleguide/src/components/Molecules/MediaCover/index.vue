<template>
  <figure class="m-mediaCover" :class="variantModifier">
    <div class="m-mediaCover__frame" :class="frameClasses">
      <Image
        v-if="image"
        class="m-mediaCover__img"
        :src="image.src"
        :alt="image.alt"
      />
      <div v-else class="u-placeholder" :class="placeholderClasses" />
    </div>

    <figcaption v-if="caption" class="m-mediaCover__cap">
      <Text v-if="eyebrow" variant="eyebrow">{{ eyebrow }}</Text>
      <Text variant="caption">{{ caption }}</Text>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Image from '@/components/Atoms/Image/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';

  export type MediaCoverVariant = 'cover' | 'poster';
  export type MediaCoverRatio = '16x9' | '4x3' | '1x1' | 'portrait';
  export type MediaCoverPlaceholderVariant = 'topLeft' | 'topRight' | 'bottom';

  export interface MediaCoverImage {
    src: string;
    alt: string;
  }

  export interface Props {
    variant?: MediaCoverVariant;
    image?: MediaCoverImage;
    placeholderVariant?: MediaCoverPlaceholderVariant;
    ratio?: MediaCoverRatio;
    caption?: string;
    eyebrow?: string;
  }

  defineOptions({ name: 'MoleculeMediaCover' });

  const {
    variant = 'cover',
    image = undefined,
    placeholderVariant = 'topLeft',
    ratio = undefined,
    caption = undefined,
    eyebrow = undefined,
  } = defineProps<Props>();

  const ratioClasses: Record<MediaCoverRatio, string> = {
    '16x9': '-ratio16x9',
    '4x3': '-ratio4x3',
    '1x1': '-ratio1x1',
    portrait: '-ratioPortrait',
  };

  const variantModifier = computed(() => `-${variant}`);

  const placeholderClasses = computed(() => [
    placeholderVariant === 'topLeft' ? undefined : `-${placeholderVariant}`,
    variant === 'poster' ? '-big' : undefined,
  ]);

  const frameClasses = computed(() =>
    variant === 'poster' || !ratio ? undefined : ratioClasses[ratio],
  );
</script>

<style src="./style.css" />
