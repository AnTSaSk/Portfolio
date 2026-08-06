import { mount } from '@vue/test-utils';
import {
  type Component,
  defineComponent,
  h,
  onErrorCaptured,
  Suspense,
} from 'vue';

// Pages with an awaited useAsyncData have an async setup; VTU 2.x only resolves
// it under a Suspense boundary, mirroring Nuxt's own runtime.
export function mountSuspended(
  component: Component,
  options: Parameters<typeof mount>[1] = {},
): ReturnType<typeof mount> {
  const Host = defineComponent({
    setup() {
      // A page that throws a 404 rejects its async setup. Nuxt captures that to
      // serve the error page; without an equivalent boundary here the rejection
      // stays unhandled and fails the run even though every test passes.
      onErrorCaptured(() => false);

      return (): ReturnType<typeof h> =>
        h(Suspense, null, { default: () => h(component) });
    },
  });

  return mount(Host, options);
}
