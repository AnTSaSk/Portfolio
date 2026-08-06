<template>
  <picture>
    <source
      v-for="source in sources"
      :key="source.type"
      :srcset="source.srcset"
      :type="source.type"
      :sizes="PROSE_SIZES"
    />
    <img
      :src="src"
      :alt="alt"
      :srcset="fallbackSrcset"
      :sizes="PROSE_SIZES"
      :width="width"
      :height="height"
      loading="lazy"
      decoding="async"
    />
  </picture>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { pictureSourcesFor, srcsetFor } from '@/utils/imageVariants';

  defineOptions({ name: 'ProseImg' });

  export interface Props {
    src: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
  }

  const props = withDefaults(defineProps<Props>(), {
    alt: '',
    width: undefined,
    height: undefined,
  });

  const PROSE_SIZES =
    '(min-width: 1280px) 600px, (min-width: 768px) 65vw, 100vw';

  const sources = computed(() => pictureSourcesFor(props.src, 'prose'));
  const fallbackSrcset = computed(() => srcsetFor(props.src, 'prose', 'webp'));
</script>
