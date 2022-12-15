import { createHead } from '@vueuse/head';
import { createApp, h } from 'vue';

import App from './App.vue';
import i18n from './i18n';
import router from './router';

const app = createApp({
  render: () => h(App),
});
const head = createHead();

app.use(router);
app.use(head);
app.use(i18n);

app.mount('#app');
