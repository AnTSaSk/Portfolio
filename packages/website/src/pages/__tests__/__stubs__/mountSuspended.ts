import { mount } from '@vue/test-utils';
import { type Component, defineComponent, h, Suspense } from 'vue';

// Pages with an awaited useAsyncData have an async setup; VTU 2.x only resolves
// it under a Suspense boundary, mirroring Nuxt's own runtime.
export function mountSuspended(
  component: Component,
  options: Parameters<typeof mount>[1] = {},
): ReturnType<typeof mount> {
  const Host = defineComponent({
    setup: () => (): ReturnType<typeof h> =>
      h(Suspense, null, { default: () => h(component) }),
  });

  return mount(Host, options);
}
