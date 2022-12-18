import { createHead } from '@vueuse/head';
import { SchemaOrgUnheadPlugin } from '@vueuse/schema-org';
import { createApp, h } from 'vue';

import App from './App.vue';
import i18n from './i18n';
import router from './router';

const app = createApp({
  render: () => h(App),
});
const head = createHead();

head.use(
  SchemaOrgUnheadPlugin(
    {
      host: import.meta.env.VUE_APP_HOST_URL,
    },
    () => {
      const route = router.currentRoute.value;

      return {
        path: route.path,
        ...route.meta,
      };
    },
  ),
);

app.use(router);
app.use(head);
app.use(i18n);

app.mount('#app');
