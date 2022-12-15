import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Constants
import { ROUTER_LANDING } from '@/constants/router';

/****************/
/**** ROUTES ****/
/****************/
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTER_LANDING,
    component: () => import('../views/Landing/index.vue'),
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

export default router;
