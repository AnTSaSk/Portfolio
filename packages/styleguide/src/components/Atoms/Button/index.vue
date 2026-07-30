<template>
  <component
    :is="resolvedTag"
    class="a-button"
    :class="`-${variant}`"
    :type="isButtonElement ? type : undefined"
    :href="linkHref"
    :aria-disabled="isDisabledLink ? 'true' : undefined"
    :disabled="isDisabledButton ? true : undefined"
  >
    <Icon v-if="icon && iconPosition === 'before'" :name="icon" />
    <Text tag="span" variant="cta">
      <slot />
    </Text>
    <Icon v-if="icon && iconPosition === 'after'" :name="icon" />
  </component>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import Icon from '../Icon/index.vue';
  import Text from '../Text/index.vue';

  export type ButtonVariant = 'primary' | 'ghost';
  export type ButtonType = 'button' | 'submit' | 'link';
  export type ButtonIconPosition = 'before' | 'after';
  export type ButtonTag = 'a' | 'button' | 'span';

  export interface Props {
    variant?: ButtonVariant;
    type?: ButtonType;
    href?: string;
    disabled?: boolean;
    icon?: string;
    iconPosition?: ButtonIconPosition;
    tag?: ButtonTag;
  }

  defineOptions({ name: 'AtomButton' });

  const {
    variant = 'primary',
    type = 'button',
    href = undefined,
    disabled = false,
    icon = undefined,
    iconPosition = 'after',
    tag = undefined,
  } = defineProps<Props>();

  const isLink = computed(() => type === 'link');
  const resolvedTag = computed(() => tag ?? (isLink.value ? 'a' : 'button'));
  const isAnchor = computed(() => resolvedTag.value === 'a');
  const isButtonElement = computed(() => resolvedTag.value === 'button');
  const isDisabledLink = computed(() => isAnchor.value && disabled);
  const isDisabledButton = computed(() => isButtonElement.value && disabled);
  const linkHref = computed(() =>
    isAnchor.value && !disabled ? href : undefined,
  );
</script>

<style src="./style.css" />
