<template>
  <footer class="o-mainNav" :class="{ '-min': min }">
    <div class="o-mainNav__inner">
      <nav class="o-mainNav__nav" :aria-label="ariaLabel">
        <ul class="o-mainNav__list">
          <li v-for="link in links" :key="link.href" class="o-mainNav__item">
            <Link
              variant="nav"
              :href="link.href"
              :current="Boolean(link.current)"
              :external="link.external"
            >
              {{ link.label }}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import Link from '../../Atoms/Link/index.vue';

  export interface MainNavLink {
    label: string;
    href: string;
    current?: boolean;
    external?: boolean;
  }

  export interface Props {
    links: MainNavLink[];
    min?: boolean;
    ariaLabel?: string;
  }

  defineOptions({ name: 'OrganismMainNav' });

  const { links, min = false, ariaLabel = 'Principale' } = defineProps<Props>();
</script>

<style src="./style.css" />
