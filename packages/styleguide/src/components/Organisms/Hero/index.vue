<template>
  <section class="o-hero">
    <div class="o-hero__inner l-container">
      <Heading level="h4" tag="p" uppercase class="o-hero__greeting"
        >{{ greeting
        }}<span class="o-hero__wave" aria-hidden="true">👋</span></Heading
      >
      <Heading level="h1" tag="h1" uppercase class="o-hero__name">{{
        name
      }}</Heading>
      <Heading level="h3" tag="p" uppercase class="o-hero__role">{{
        role
      }}</Heading>
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
          <Tag variant="brand">{{ tag }}</Tag>
        </li>
      </ul>
      <div class="o-hero__actions">
        <Button variant="primary" :href="contactHref">{{
          contactLabel
        }}</Button>
        <Link variant="arrow" :href="projectsHref">{{ projectsLabel }}</Link>
      </div>
    </div>
    <Watermark :text="watermarkText" class="o-hero__watermark" />
    <div class="u-radial" aria-hidden="true"></div>
  </section>
</template>

<script setup lang="ts">
  import Button from '@/components/Atoms/Button/index.vue';
  import Heading from '@/components/Atoms/Heading/index.vue';
  import Link from '@/components/Atoms/Link/index.vue';
  import Tag from '@/components/Atoms/Tag/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';
  import Watermark from '@/components/Atoms/Watermark/index.vue';

  export interface Props {
    greeting?: string;
    name: string;
    role: string;
    body: string[];
    tags?: string[];
    watermarkText?: string;
    contactHref?: string;
    projectsHref?: string;
    contactLabel?: string;
    projectsLabel?: string;
  }

  defineOptions({ name: 'OrganismHero' });

  const {
    greeting = 'Bonsoir !',
    name,
    role,
    body,
    tags = [],
    watermarkText = '',
    contactHref = '#contact',
    projectsHref = '#projects',
    contactLabel = 'Me contacter',
    projectsLabel = 'Voir les projets',
  } = defineProps<Props>();
</script>

<style src="./style.css" />
