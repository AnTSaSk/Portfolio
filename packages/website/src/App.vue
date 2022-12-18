<template>
  <component :is="getLayout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
  import {
    definePerson,
    defineWebPage,
    defineWebSite,
    useSchemaOrg,
  } from '@vueuse/schema-org';
  import { computed, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  // Constants
  import { ROUTER_LANDING } from '@/constants/router';

  // Utils
  import { logDecoration } from '@/utils/easteregg';

  // Layouts
  import LandingLayout from '@/layouts/Landing/index.vue';

  /*********************/
  /**** COMPOSABLES ****/
  /*********************/
  const route = useRoute();
  const { t } = useI18n();

  /****************/
  /**** SCHEMA ****/
  /****************/
  useSchemaOrg([
    definePerson({
      name: 'Alexis Besson',
      image: '',
      sameAs: [
        'https://github.com/AnTSaSk',
        'https://www.linkedin.com/in/alexis-besson-web/',
        'https://twitter.com/AlexisBessonWeb',
      ],
    }),
    defineWebSite({
      name: t('seo.meta.title.generic'),
    }),
    defineWebPage(),
  ]);

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

  onMounted(() => {
    logDecoration();
  });
</script>
