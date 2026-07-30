<template>
  <section class="o-hero">
    <div class="o-hero__inner">
      <Heading level="h4" tag="p" uppercase class="o-hero__greeting">
        {{ greeting }}<span class="o-hero__wave" aria-hidden="true">👋</span>
      </Heading>
      <Heading level="h1" tag="h1" uppercase class="o-hero__name">
        {{ name }}
      </Heading>
      <Heading level="h3" tag="p" uppercase class="o-hero__role">
        {{ role }}
      </Heading>
      <div class="o-hero__body">
        <Text
          v-for="(paragraph, index) in body"
          :key="index"
          tag="p"
          variant="bodyS"
          >{{ paragraph }}</Text
        >
      </div>
      <ul v-if="tags.length > 0" class="o-hero__tags">
        <li v-for="tag in tags" :key="tag" class="o-hero__tagItem">
          <Tag variant="strong">{{ tag }}</Tag>
        </li>
      </ul>
      <div class="o-hero__actions">
        <Button variant="primary" :href="primaryHref">
          {{ primaryLabel }}
        </Button>
        <Link
          variant="arrow"
          :href="secondaryHref"
          :external="secondaryExternal"
          >{{ secondaryLabel }}</Link
        >
      </div>
    </div>
    <Watermark :text="watermarkText" class="o-hero__watermark" />
  </section>
</template>

<script setup lang="ts">
  import Button from '../../Atoms/Button/index.vue';
  import Heading from '../../Atoms/Heading/index.vue';
  import Link from '../../Atoms/Link/index.vue';
  import Tag from '../../Atoms/Tag/index.vue';
  import Text from '../../Atoms/Text/index.vue';
  import Watermark from '../../Atoms/Watermark/index.vue';

  export interface Props {
    greeting?: string;
    name: string;
    role: string;
    body: string[];
    tags?: string[];
    watermarkText?: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    secondaryExternal?: boolean;
  }

  defineOptions({ name: 'OrganismHero' });

  const {
    greeting = 'Bonsoir !',
    name,
    role,
    body,
    tags = [],
    watermarkText = '',
    primaryHref = '#',
    primaryLabel = 'Voir les projets',
    secondaryHref = '#',
    secondaryLabel = '',
    secondaryExternal = false,
  } = defineProps<Props>();
</script>

<style src="./style.css" />
