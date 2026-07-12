<template>
  <a class="m-cardArticle" :href="href">
    <div class="m-cardArticle__cover">
      <Image v-if="image" :src="image.src" :alt="image.alt" />
      <div v-else class="u-placeholder" :class="placeholderVariant" />
    </div>

    <Text tag="p" variant="tag" class="m-cardArticle__date">{{ date }}</Text>
    <Heading tag="h2" level="h5" class="m-cardArticle__title">{{
      title
    }}</Heading>
    <Text tag="p" variant="bodyS" class="m-cardArticle__excerpt">{{
      excerpt
    }}</Text>

    <ul class="m-cardArticle__tags">
      <li v-for="tag in tags" :key="tag" class="m-cardArticle__tagItem">
        <Tag>{{ tag }}</Tag>
      </li>
    </ul>
  </a>
</template>

<script setup lang="ts">
  import Heading from '@/components/Atoms/Heading/index.vue';
  import Image from '@/components/Atoms/Image/index.vue';
  import Tag from '@/components/Atoms/Tag/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';

  export type CardArticlePlaceholderVariant = '-topRight' | '-bottom';

  export interface CardArticleImage {
    src: string;
    alt: string;
  }

  export interface Props {
    href: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    image?: CardArticleImage;
    placeholderVariant?: CardArticlePlaceholderVariant;
  }

  defineOptions({ name: 'MoleculeCardArticle' });

  const {
    href,
    title,
    date,
    excerpt,
    tags,
    image = undefined,
    placeholderVariant = undefined,
  } = defineProps<Props>();
</script>

<style src="./style.css" />
