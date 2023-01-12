import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { locale } from '@/i18n';

// Constants
import { SAVED_LOCALE } from '@/constants/i18n';
import { ROUTER_LANDING } from '@/constants/router';

/****************/
/**** ROUTES ****/
/****************/
const routes: Array<RouteRecordRaw> = [
  {
    path: '/:locale?',
    children: [
      {
        path: '',
        name: ROUTER_LANDING,
        component: () => import('../views/Landing/index.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: ROUTER_LANDING },
  },
];

/****************/
/**** ROUTER ****/
/****************/
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/***************************/
/**** NAVIGATION GUARDS ****/
/***************************/
router.beforeEach((to, from, next) => {
  const savedLocale = localStorage.getItem(SAVED_LOCALE);

  if (
    to.params.locale &&
    from.params.locale !== to.params.locale &&
    to.params.locale !== locale.value &&
    !savedLocale
  ) {
    locale.value = to.params.locale as string;
  }

  // Redirect
  if (locale.value !== 'en' && to.params.locale !== locale.value) {
    to.params.locale = locale.value;

    next(to);
  } else if (
    to.params.locale === 'en' ||
    (locale.value === 'en' && to.params.locale.length > 0)
  ) {
    to.params.locale = '';

    next(to);
  } else {
    next();
  }
});

export default router;
