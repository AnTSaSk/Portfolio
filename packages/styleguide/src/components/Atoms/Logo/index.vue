<template>
  <svg
    class="a-logo"
    viewBox="0 0 155 143"
    :aria-hidden="!label || undefined"
    :role="label ? 'img' : undefined"
    :aria-label="label"
  >
    <title v-if="title">{{ title }}</title>
    <path :d="PATH_1" :fill="`url(#${gradientId1})`" />
    <path :d="PATH_2" :fill="`url(#${gradientId2})`" />
    <path
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
      :d="PATH_3"
    />
    <defs>
      <linearGradient
        :id="gradientId1"
        x1="114.5"
        y1="0"
        x2="0"
        y2="162.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#30BF75" />
        <stop offset="1" stop-color="#1E9782" />
      </linearGradient>
      <linearGradient
        :id="gradientId2"
        x1="114.5"
        y1="0"
        x2="0"
        y2="162.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#30BF75" />
        <stop offset="1" stop-color="#1E9782" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts">
  export default {
    name: 'AtomLogo',
  };
</script>

<script setup lang="ts">
  import { useId } from 'vue';

  export interface Props {
    label?: string;
    title?: string;
  }

  defineProps<Props>();

  const PATH_1 = 'M63.0546 27H81L17.8225 143H0L63.0546 27Z';
  const PATH_2 =
    'M58.9224 133H41.1L104.155 17L113.5 0H115L120 17L120.738 19.5L58.9224 133Z';
  const PATH_3 =
    'M123.344 102.996H84.2636L93.8199 85.4499H118.554L110.296 55.1978L123.971 30.0895L155 133H131.535L123.344 102.996Z';

  // useId() is SSR-stable: deterministic per component instance, matches on hydration.
  const gradientId1 = `logo-grad1-${useId()}`;
  const gradientId2 = `logo-grad2-${useId()}`;
</script>

<style src="./style.css" />
