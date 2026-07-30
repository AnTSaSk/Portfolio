<template>
  <component
    :is="as"
    :class="classes"
    :type="as === 'button' ? 'button' : undefined"
    :disabled="as === 'button' ? disabled : undefined"
    :aria-pressed="ariaPressed"
    :aria-disabled="ariaDisabled"
  >
    <span v-if="showLead" class="a-tag__lead lead">
      <slot name="lead">
        <span v-if="isFunctional" class="a-tag__dot dot" />
      </slot>
    </span>
    <Text tag="span" variant="tag" class="a-tag__label">
      <slot />
    </Text>
    <span v-if="showTrail" class="a-tag__trail trail">
      <slot name="trail">
        <span v-if="count !== undefined" class="a-tag__count count">
          {{ count }}
        </span>
      </slot>
    </span>
  </component>
</template>

<script setup lang="ts">
  import { computed, useSlots } from 'vue';

  import Text from '../Text/index.vue';

  export type TagAs = 'span' | 'button';
  export type TagVariant = 'brand' | 'info' | 'warning' | 'error' | 'strong';

  export interface Props {
    as?: TagAs;
    variant?: TagVariant;
    pressed?: boolean;
    disabled?: boolean;
    count?: number;
  }

  defineOptions({ name: 'AtomTag' });

  const {
    as = 'span',
    variant = undefined,
    pressed = false,
    disabled = false,
    count = undefined,
  } = defineProps<Props>();

  const slots = useSlots();

  const isFunctional = computed(
    () => variant === 'info' || variant === 'warning' || variant === 'error',
  );

  const showLead = computed(() => !!slots.lead || isFunctional.value);
  const showTrail = computed(() => !!slots.trail || count !== undefined);

  const ariaPressed = computed(() =>
    as === 'button' ? String(pressed) : undefined,
  );
  const ariaDisabled = computed(() =>
    as === 'span' && disabled ? 'true' : undefined,
  );

  const classes = computed(() => [
    'a-tag',
    variant && `-${variant}`,
    showLead.value && '-withLead',
    showTrail.value && '-withTrail',
    pressed && '-selected',
  ]);
</script>

<style src="./style.css" />
