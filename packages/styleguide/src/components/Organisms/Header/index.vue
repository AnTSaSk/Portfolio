<template>
  <header class="o-header" :class="{ '-scrolled': scrolled }">
    <div class="o-header__inner l-container">
      <Logo class="o-header__logo" :label="logoLabel" :title="logoTitle" />
      <div class="o-header__tools">
        <LangSwitcher :locale="locale" @change="emit('changeLang', $event)" />
        <ThemeSwitcher :theme="theme" @toggle="emit('toggleTheme')" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import LangSwitcher, {
    type LangSwitcherLocale,
  } from '@/components/Atoms/LangSwitcher/index.vue';
  import Logo from '@/components/Atoms/Logo/index.vue';
  import ThemeSwitcher, {
    type ThemeSwitcherTheme,
  } from '@/components/Atoms/ThemeSwitcher/index.vue';

  export interface Props {
    scrolled?: boolean;
    theme: ThemeSwitcherTheme;
    locale: LangSwitcherLocale;
    logoLabel?: string;
    logoTitle?: string;
  }

  defineOptions({ name: 'OrganismHeader' });

  const {
    scrolled = false,
    theme,
    locale,
    logoLabel,
    logoTitle,
  } = defineProps<Props>();

  const emit = defineEmits<{
    toggleTheme: [];
    changeLang: [locale: LangSwitcherLocale];
  }>();
</script>

<style src="./style.css" />
