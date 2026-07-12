<template>
  <aside class="m-author">
    <div class="m-author__avatar" aria-hidden="true">
      <Text tag="span" variant="tag">{{ initials }}</Text>
    </div>

    <div class="m-author__content">
      <div class="m-author__name">
        <Heading tag="p" level="h5" uppercase>{{ name }}</Heading>
      </div>

      <div class="m-author__body">
        <Text tag="p" variant="bodyS">{{ bio }}</Text>
      </div>

      <div class="m-author__links">
        <Link
          v-for="link in links"
          :key="link.href"
          variant="arrow"
          :href="link.href"
          :external="link.external"
        >
          <Text tag="span" variant="bodyS">{{ link.label }}</Text>
        </Link>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import Heading from '@/components/Atoms/Heading/index.vue';
  import Link from '@/components/Atoms/Link/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';

  export interface AuthorLink {
    label: string;
    href: string;
    external?: boolean;
  }

  export interface Props {
    initials: string;
    name: string;
    bio: string;
    links: AuthorLink[];
  }

  defineOptions({ name: 'MoleculeAuthor' });

  defineProps<Props>();
</script>

<style src="./style.css" />
