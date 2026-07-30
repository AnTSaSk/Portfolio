<template>
  <button
    type="button"
    class="a-themeSwitcher"
    :class="[
      shape === 'circle' ? '-circle' : '-square',
      { '-active': pressed },
    ]"
    :aria-label="ariaLabel"
    :aria-pressed="pressed ? 'true' : undefined"
    :disabled="disabled ? true : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="emit('toggle')"
  >
    <Icon :name="iconName" size="sm" stroke />
  </button>
</template>

<script lang="ts">
  export default {
    name: 'AtomThemeSwitcher',
  };
</script>

<script setup lang="ts">
  import { computed } from 'vue';

  import Icon from '../Icon/index.vue';

  export type ThemeSwitcherTheme = 'light' | 'dark';
  export type ThemeSwitcherShape = 'square' | 'circle';

  export interface Props {
    theme: ThemeSwitcherTheme;
    shape?: ThemeSwitcherShape;
    pressed?: boolean;
    disabled?: boolean;
  }

  const {
    theme,
    shape = 'square',
    pressed = false,
    disabled = false,
  } = defineProps<Props>();

  const emit = defineEmits<{
    toggle: [];
  }>();

  const ariaLabel = computed(() =>
    theme === 'light' ? 'Switch to dark' : 'Switch to light',
  );

  const iconName = computed(() => (theme === 'light' ? 'moon' : 'sun'));
</script>

<style src="./style.css" />
