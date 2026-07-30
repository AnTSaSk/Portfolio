<template>
  <header :class="rootClasses">
    <div class="o-head__inner">
      <template v-if="variant === 'listing'">
        <Text variant="eyebrow" tone="accent">{{ eyebrow }}</Text>
        <Heading level="h1" class="o-head__title">{{ title }}</Heading>
        <Text variant="lede">{{ lede }}</Text>
      </template>
      <template v-else>
        <Link
          v-if="backHref"
          variant="arrow"
          arrow-position="before"
          :href="backHref"
          class="o-head__back"
        >
          <Text tag="span" variant="eyebrow" class="o-head__backLabel">
            {{ backLabel }}
          </Text>
        </Link>
        <ul v-if="tags.length > 0" class="o-head__tags">
          <li v-for="tag in tags" :key="tag">
            <Tag>{{ tag }}</Tag>
          </li>
        </ul>
        <Heading level="h1" class="o-head__title">{{ title }}</Heading>
        <Text variant="lede" class="o-head__lede">{{ lede }}</Text>
        <p v-if="metaDate && metaDuration" class="o-head__meta">
          <Text tag="span" variant="tag">{{ metaDate }}</Text>
          <Text tag="span" variant="tag">{{ metaDuration }}</Text>
        </p>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Heading from '../../Atoms/Heading/index.vue';
  import Link from '../../Atoms/Link/index.vue';
  import Tag from '../../Atoms/Tag/index.vue';
  import Text from '../../Atoms/Text/index.vue';

  export type HeadVariant = 'listing' | 'article';

  export interface Props {
    variant: HeadVariant;
    title: string;
    lede: string;
    eyebrow?: string;
    backHref?: string;
    backLabel?: string;
    tags?: string[];
    metaDate?: string;
    metaDuration?: string;
  }

  defineOptions({ name: 'OrganismHead' });

  const {
    variant,
    title,
    lede,
    eyebrow = undefined,
    backHref = undefined,
    backLabel = undefined,
    tags = [],
    metaDate = undefined,
    metaDuration = undefined,
  } = defineProps<Props>();

  const rootClasses = computed(() => ['o-head', `-${variant}`]);
</script>

<style src="./style.css" />
