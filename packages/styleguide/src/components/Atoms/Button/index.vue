<template>
  <component
    :is="tag"
    class="a-button"
    :class="`-${variant}`"
    :type="isLink ? undefined : type"
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

  import Icon from '@/components/Atoms/Icon/index.vue';
  import Text from '@/components/Atoms/Text/index.vue';

  export type ButtonVariant = 'primary' | 'ghost';
  export type ButtonType = 'button' | 'submit' | 'link';
  export type ButtonIconPosition = 'before' | 'after';

  export interface Props {
    variant?: ButtonVariant;
    type?: ButtonType;
    href?: string;
    disabled?: boolean;
    icon?: string;
    iconPosition?: ButtonIconPosition;
  }

  defineOptions({ name: 'AtomButton' });

  const {
    variant = 'primary',
    type = 'button',
    href = undefined,
    disabled = false,
    icon = undefined,
    iconPosition = 'after',
  } = defineProps<Props>();

  const isLink = computed(() => type === 'link');
  const isDisabledLink = computed(() => isLink.value && disabled);
  const isDisabledButton = computed(() => !isLink.value && disabled);
  const tag = computed(() => (isLink.value ? 'a' : 'button'));
  const linkHref = computed(() =>
    isLink.value && !disabled ? href : undefined,
  );
</script>

<style src="./style.css" />
