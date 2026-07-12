<template>
  <a
    :class="classes"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :aria-current="current ? 'page' : undefined"
  >
    <Text v-if="hasEyebrowLabel" tag="span" variant="eyebrow"><slot /></Text>
    <template v-else>
      <span
        v-if="showArrow && arrowPosition === 'before'"
        class="a-link__arrow -before"
        aria-hidden="true"
        >←</span
      >
      <slot />
      <span
        v-if="showArrow && arrowPosition === 'after'"
        class="a-link__arrow"
        aria-hidden="true"
        >→</span
      >
    </template>
  </a>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Text from '@/components/Atoms/Text/index.vue';

  export type LinkVariant = 'inline' | 'arrow' | 'quiet' | 'nav';
  export type LinkArrowPosition = 'before' | 'after';

  export interface Props {
    href: string;
    external?: boolean;
    current?: boolean;
    variant?: LinkVariant;
    arrowPosition?: LinkArrowPosition;
  }

  defineOptions({ name: 'AtomLink' });

  const {
    href,
    external = undefined,
    current = false,
    variant = 'inline',
    arrowPosition = 'after',
  } = defineProps<Props>();

  const showArrow = computed(() => variant === 'arrow');

  // Styleguide is isolated from routing: renders a plain <a>. The website
  // wires internal hrefs through NuxtLink at the call site.
  const isExternal = computed(() => external ?? /^https?:/.test(href));

  const classes = computed(() => [
    'a-link',
    variant !== 'inline' && `-${variant}`,
  ]);

  // Quiet/nav labels are composed via Text -eyebrow (typography owned by Text, AC-ATOM-2).
  const hasEyebrowLabel = computed(
    () => variant === 'quiet' || variant === 'nav',
  );
</script>

<style src="./style.css" />
