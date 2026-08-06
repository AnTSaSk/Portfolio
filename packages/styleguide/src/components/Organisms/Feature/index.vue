<template>
  <a class="o-feature" :href="href">
    <div class="o-feature__body">
      <Text tag="p" variant="eyebrow" class="o-feature__label">
        {{ label }}
      </Text>
      <Text tag="p" variant="tag" class="o-feature__meta">{{ meta }}</Text>
      <Heading level="h2" uppercase class="o-feature__title">
        {{ title }}
      </Heading>
      <Text tag="p" variant="lede" class="o-feature__lead">{{ lead }}</Text>
      <ul class="o-feature__stack">
        <li v-for="entry in stack" :key="entry">
          <Tag class="-strong">{{ entry }}</Tag>
        </li>
      </ul>
      <Link variant="arrow" tag="span" class="o-feature__cta">
        {{ ctaLabel }}
      </Link>
    </div>
    <div class="o-feature__cover">
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
          <div class="u-placeholder -big" aria-hidden="true">
            <span>{{ title }}</span>
          </div>
        </template>
      </Image>
      <div v-else class="u-placeholder -big" aria-hidden="true">
        <span>{{ title }}</span>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
  import Heading from '../../Atoms/Heading/index.vue';
  import Image, { type ImageSource } from '../../Atoms/Image/index.vue';
  import Link from '../../Atoms/Link/index.vue';
  import Tag from '../../Atoms/Tag/index.vue';
  import Text from '../../Atoms/Text/index.vue';

  export interface FeatureImage {
    src: string;
    alt: string;
    sources?: ImageSource[];
    srcset?: string;
  }

  export interface Props {
    href: string;
    label: string;
    meta: string;
    title: string;
    lead: string;
    stack: string[];
    ctaLabel: string;
    image?: FeatureImage;
    sizes?: string;
  }

  defineOptions({ name: 'OrganismFeature' });

  const {
    href,
    label,
    meta,
    title,
    lead,
    stack,
    ctaLabel,
    image = undefined,
    sizes = undefined,
  } = defineProps<Props>();
</script>

<style src="./style.css" />
