<template>
  <div class="o-landing">
    <Logo class="a-logo" />

    <div class="o-landing__content">
      <h1 class="o-landing__title">Alexis Besson</h1>
      <h2 class="o-landing__subtitle">Lead Front-end Developer</h2>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: ROUTER_LANDING,
  };
</script>

<script setup lang="ts">
  // Constants
  import { ROUTER_LANDING } from '@/constants/router';

  // Logo
  import Logo from '@/assets/images/logo.svg?component';
</script>

<style lang="scss" src="./style.scss"></style>
