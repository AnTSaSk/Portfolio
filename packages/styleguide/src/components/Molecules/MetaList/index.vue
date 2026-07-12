<template>
  <div class="m-metaList">
    <dl class="m-metaList__list" :aria-label="ariaLabel">
      <div v-for="item in items" :key="item.term" class="m-metaList__row">
        <dt class="m-metaList__term">
          <Text tag="span" variant="tag">{{ item.term }}</Text>
        </dt>
        <dd class="m-metaList__value">
          <Text v-if="item.value" tag="span" variant="bodyS">{{
            item.value
          }}</Text>
          <ul v-if="item.tags" class="m-metaList__stack">
            <li
              v-for="tag in item.tags"
              :key="tag"
              class="m-metaList__stackItem"
            >
              <Tag>{{ tag }}</Tag>
            </li>
          </ul>
        </dd>
      </div>
    </dl>

    <div v-if="links && links.length > 0" class="m-metaList__links">
      <p class="m-metaList__linksHead">
        <Text tag="span" variant="tag">{{ linksLabel }}</Text>
      </p>
      <Link
        v-for="link in links"
        :key="link.href"
        variant="arrow"
        :href="link.href"
        :external="link.external"
      >
        {{ link.label }}
      </Link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Link from '@/components/Atoms/Link/index.vue';
  import Tag from '@/components/Atoms/Tag/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';

  export interface MetaListItem {
    term: string;
    value?: string;
    tags?: string[];
  }

  export interface MetaListLink {
    label: string;
    href: string;
    external?: boolean;
  }

  export interface Props {
    items: MetaListItem[];
    ariaLabel?: string;
    links?: MetaListLink[];
    linksLabel?: string;
  }

  defineOptions({ name: 'MoleculeMetaList' });

  const {
    items,
    ariaLabel = undefined,
    links = undefined,
    linksLabel = 'Liens',
  } = defineProps<Props>();
</script>

<style src="./style.css" />
