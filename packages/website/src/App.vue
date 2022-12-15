<template>
  <component :is="getLayout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  // Constants
  import { ROUTER_LANDING } from '@/constants/router';

  // Layouts
  import LandingLayout from '@/layouts/Landing/index.vue';

  const route = useRoute();

  /**********************/
  /**** LAYOUT GROUP ****/
  /**********************/
  const landingRoutes = [ROUTER_LANDING];

  const getLayout = computed((): typeof LandingLayout => {
    if (route.name && landingRoutes.includes(route.name as string)) {
      return LandingLayout;
    }

    return LandingLayout;
  });
</script>
