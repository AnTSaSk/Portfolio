<template>
  <a class="m-cardProject" :href="href">
    <div class="m-cardProject__cover">
      <Image v-if="image" :src="image.src" :alt="image.alt" />
      <div v-else class="u-placeholder" :class="placeholderVariant" />
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
  import Heading from '@/components/Atoms/Heading/index.vue';
  import Image from '@/components/Atoms/Image/index.vue';
  import Tag from '@/components/Atoms/Tag/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';

  export type CardProjectPlaceholderVariant = '-topRight' | '-bottom';

  export interface CardProjectImage {
    src: string;
    alt: string;
  }

  export interface Props {
    href: string;
    title: string;
    meta: string;
    stack: string[];
    desc?: string;
    image?: CardProjectImage;
    placeholderVariant?: CardProjectPlaceholderVariant;
  }

  defineOptions({ name: 'MoleculeCardProject' });

  const {
    href,
    title,
    meta,
    stack,
    desc = undefined,
    image = undefined,
    placeholderVariant = undefined,
  } = defineProps<Props>();
</script>

<style src="./style.css" />
