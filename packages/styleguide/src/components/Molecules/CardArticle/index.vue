<template>
  <a class="m-cardArticle" :href="href">
    <div class="m-cardArticle__cover">
      <Image
        v-if="image"
        reveal
        :src="image.src"
        :alt="image.alt"
        :sources="image.sources"
        :srcset="image.srcset"
        :sizes="sizes"
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
              class="m-cardArticle__coverTitle"
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
          class="m-cardArticle__coverTitle"
        >
          {{ title }}
        </Heading>
      </div>
    </div>

    <Text tag="p" variant="tag" class="m-cardArticle__date">{{ date }}</Text>
    <Heading tag="h2" level="h5" class="m-cardArticle__title">
      {{ title }}
    </Heading>
    <Text tag="p" variant="bodyS" class="m-cardArticle__excerpt">
      {{ excerpt }}
    </Text>

    <ul class="m-cardArticle__tags">
      <li v-for="tag in tags" :key="tag" class="m-cardArticle__tagItem">
        <Tag>{{ tag }}</Tag>
      </li>
    </ul>
  </a>
</template>

<script setup lang="ts">
  import Heading from '../../Atoms/Heading/index.vue';
  import Image, { type ImageSource } from '../../Atoms/Image/index.vue';
  import Tag from '../../Atoms/Tag/index.vue';
  import Text from '../../Atoms/Text/index.vue';

  export type CardArticlePlaceholderVariant = '-topRight' | '-bottom';

  export interface CardArticleImage {
    src: string;
    alt: string;
    sources?: ImageSource[];
    srcset?: string;
  }

  export interface Props {
    href: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    image?: CardArticleImage;
    placeholderVariant?: CardArticlePlaceholderVariant;
    sizes?: string;
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
    sizes = undefined,
  } = defineProps<Props>();
</script>

<style src="./style.css" />
