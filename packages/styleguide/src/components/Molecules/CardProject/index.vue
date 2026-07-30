<template>
  <a class="m-cardProject" :href="href">
    <div class="m-cardProject__cover">
      <Image
        v-if="image"
        reveal
        :image-component="imageComponent"
        :src="image.src"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        :sizes="sizes"
        :densities="sizes ? undefined : 'x1 x2'"
        :fetchpriority="fetchpriority"
        :loading="loading"
        format="avif,webp"
      >
        <template #placeholder>
          <div
            class="u-placeholder"
            :class="placeholderVariant"
            aria-hidden="true"
          >
            <Heading
              tag="span"
              level="h4"
              uppercase
              class="m-cardProject__coverTitle"
            >
              {{ title }}
            </Heading>
          </div>
        </template>
      </Image>
      <div
        v-else
        class="u-placeholder"
        :class="placeholderVariant"
        aria-hidden="true"
      >
        <Heading
          tag="span"
          level="h4"
          uppercase
          class="m-cardProject__coverTitle"
        >
          {{ title }}
        </Heading>
      </div>
    </div>
    <div class="m-cardProject__meta">
      <Text tag="span" variant="tag">{{ meta }}</Text>
    </div>
    <div class="m-cardProject__title">
      <Heading level="h3" uppercase>{{ title }}</Heading>
    </div>
    <div v-if="desc" class="m-cardProject__desc">
      <Text variant="bodyS">{{ desc }}</Text>
    </div>
    <ul class="m-cardProject__stack">
      <li v-for="entry in stack" :key="entry" class="m-cardProject__stackItem">
        <Tag>{{ entry }}</Tag>
      </li>
    </ul>
  </a>
</template>

<script setup lang="ts">
  import { type Component } from 'vue';

  import Heading from '../../Atoms/Heading/index.vue';
  import Image from '../../Atoms/Image/index.vue';
  import Tag from '../../Atoms/Tag/index.vue';
  import Text from '../../Atoms/Text/index.vue';

  export type CardProjectPlaceholderVariant = '-topRight' | '-bottom';

  export interface CardProjectImage {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }

  export interface Props {
    href: string;
    title: string;
    meta: string;
    stack: string[];
    desc?: string;
    image?: CardProjectImage;
    imageComponent?: Component;
    placeholderVariant?: CardProjectPlaceholderVariant;
    sizes?: string;
    fetchpriority?: 'high' | 'low' | 'auto';
    loading?: 'lazy' | 'eager';
  }

  defineOptions({ name: 'MoleculeCardProject' });

  const {
    href,
    title,
    meta,
    stack,
    desc = undefined,
    image = undefined,
    imageComponent = undefined,
    placeholderVariant = undefined,
    sizes = undefined,
    fetchpriority = undefined,
    loading = undefined,
  } = defineProps<Props>();
</script>

<style src="./style.css" />
