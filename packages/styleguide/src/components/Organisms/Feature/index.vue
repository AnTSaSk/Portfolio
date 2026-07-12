<template>
  <a class="o-feature" :href="href">
    <div class="o-feature__body">
      <Text tag="p" variant="eyebrow" class="o-feature__label">{{
        label
      }}</Text>
      <Text tag="p" variant="tag" class="o-feature__meta">{{ meta }}</Text>
      <Heading level="h2" uppercase class="o-feature__title">{{
        title
      }}</Heading>
      <Text tag="p" variant="lede" class="o-feature__lead">{{ lead }}</Text>
      <ul class="o-feature__stack">
        <li v-for="entry in stack" :key="entry">
          <Tag class="-strong">{{ entry }}</Tag>
        </li>
      </ul>
      <span class="o-feature__cta">
        <Text tag="span" variant="cta">{{ ctaLabel }}</Text>
        <span aria-hidden="true">→</span>
      </span>
    </div>
    <div class="o-feature__cover">
      <Image v-if="image" :src="image.src" :alt="image.alt" />
      <div v-else class="u-placeholder -big">
        <span>{{ title }}</span>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
  import Heading from '@/components/Atoms/Heading/index.vue';
  import Image from '@/components/Atoms/Image/index.vue';
  import Tag from '@/components/Atoms/Tag/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';

  export interface FeatureImage {
    src: string;
    alt: string;
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
  } = defineProps<Props>();
</script>

<style src="./style.css" />
