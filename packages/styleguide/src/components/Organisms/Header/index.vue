<template>
  <header class="o-header" :class="{ '-scrolled': scrolled }">
    <div class="o-header__inner">
      <a class="o-header__logoLink" :href="logoHref" :aria-label="logoLabel">
        <Logo class="o-header__logo" :title="logoTitle" />
      </a>
      <div class="o-header__tools">
        <div class="o-header__group -links">
          <Link
            v-for="social in socialLinks"
            :key="social.icon"
            class="o-header__social"
            variant="icon"
            external
            :href="social.href"
            :label="social.label"
          >
            <Icon :name="social.icon" size="sm" />
          </Link>
        </div>
        <div class="o-header__group -actions">
          <LangSwitcher :locale="locale" @change="emit('changeLang', $event)" />
          <ThemeSwitcher :theme="theme" @toggle="emit('toggleTheme')" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import type { IconName } from '../../Atoms/Icon/names';

  import Icon from '../../Atoms/Icon/index.vue';
  import LangSwitcher, {
    type LangSwitcherLocale,
  } from '../../Atoms/LangSwitcher/index.vue';
  import Link from '../../Atoms/Link/index.vue';
  import Logo from '../../Atoms/Logo/index.vue';
  import ThemeSwitcher, {
    type ThemeSwitcherTheme,
  } from '../../Atoms/ThemeSwitcher/index.vue';

  export interface SocialLink {
    icon: IconName;
    href: string;
    label: string;
  }

  export interface Props {
    scrolled?: boolean;
    theme: ThemeSwitcherTheme;
    locale: LangSwitcherLocale;
    logoHref?: string;
    logoLabel?: string;
    logoTitle?: string;
    socialLinks?: SocialLink[];
  }

  defineOptions({ name: 'OrganismHeader' });

  const {
    scrolled = false,
    theme,
    locale,
    logoHref = '/',
    logoLabel,
    logoTitle,
    socialLinks = undefined,
  } = defineProps<Props>();

  const emit = defineEmits<{
    toggleTheme: [];
    changeLang: [locale: LangSwitcherLocale];
  }>();
</script>

<style src="./style.css" />
