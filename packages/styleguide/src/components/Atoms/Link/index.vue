<template>
  <component
    :is="tag"
    :class="classes"
    :href="isAnchor ? href : undefined"
    :target="isAnchor && isExternal ? '_blank' : undefined"
    :rel="isAnchor && isExternal ? 'noopener noreferrer' : undefined"
    :aria-current="isAnchor && current ? 'page' : undefined"
    :aria-label="variant === 'icon' ? label : undefined"
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
  </component>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Text from '../Text/index.vue';

  export type LinkVariant = 'inline' | 'arrow' | 'quiet' | 'nav' | 'icon';
  export type LinkArrowPosition = 'before' | 'after';
  export type LinkTag = 'a' | 'span';

  export interface Props {
    href?: string;
    external?: boolean;
    current?: boolean;
    variant?: LinkVariant;
    arrowPosition?: LinkArrowPosition;
    tag?: LinkTag;
    // Accessible name for the icon-only variant (the icon itself is decorative).
    label?: string;
  }

  defineOptions({ name: 'AtomLink' });

  const {
    href = undefined,
    external = undefined,
    current = false,
    variant = 'inline',
    arrowPosition = 'after',
    tag = 'a',
    label = undefined,
  } = defineProps<Props>();

  const showArrow = computed(() => variant === 'arrow');

  const isAnchor = computed(() => tag === 'a');

  // Styleguide is isolated from routing: renders a plain <a>. The website
  // wires internal hrefs through NuxtLink at the call site.
  const isExternal = computed(() => external ?? /^https?:/.test(href ?? ''));

  const classes = computed(() => [
    'a-link',
    variant !== 'inline' && `-${variant}`,
  ]);

  const hasEyebrowLabel = computed(
    () => variant === 'quiet' || variant === 'nav',
  );
</script>

<style src="./style.css" />
