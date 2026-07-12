<template>
  <picture v-if="sources && sources.length > 0">
    <source
      v-for="source in sources"
      :key="source.srcset"
      :srcset="source.srcset"
      :type="source.type"
      :media="source.media"
    />
    <img
      class="a-image"
      :class="fitModifier"
      :src="src"
      :alt="alt"
      :srcset="srcset"
      :sizes="sizes"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
    />
  </picture>

  <img
    v-else
    class="a-image"
    :class="fitModifier"
    :src="src"
    :alt="alt"
    :srcset="srcset"
    :sizes="sizes"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  export interface ImageSource {
    srcset: string;
    type?: string;
    media?: string;
  }

  export type ImageFit = 'cover' | 'contain' | 'none';

  export interface Props {
    src: string;
    alt: string;
    srcset?: string;
    sizes?: string;
    width?: number | string;
    height?: number | string;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'sync' | 'auto';
    sources?: ImageSource[];
    fit?: ImageFit;
  }

  defineOptions({ name: 'AtomImage' });

  const props = withDefaults(defineProps<Props>(), {
    srcset: undefined,
    sizes: undefined,
    width: undefined,
    height: undefined,
    loading: 'lazy',
    decoding: 'async',
    sources: undefined,
    fit: 'cover',
  });

  const fitModifier = computed(() =>
    props.fit === 'cover' ? undefined : `-${props.fit}`,
  );
</script>

<style src="./style.css" />
