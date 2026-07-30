import { defineComponent, h, ref, onMounted } from 'vue';

// Storybook stand-in for Nuxt's <NuxtImg custom>: exposes the same slot
// contract { src, isLoaded, imgAttrs } so injected-image stories render
// without Nuxt. isLoaded flips once the real <img> fires load.
export default defineComponent({
  name: 'StubNuxtImg',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: undefined },
    sizes: { type: String, default: undefined },
    densities: { type: String, default: undefined },
    format: { type: String, default: undefined },
    width: { type: [Number, String], default: undefined },
    height: { type: [Number, String], default: undefined },
  },
  setup(props, { slots }) {
    const isLoaded = ref(false);

    onMounted(() => {
      const probe = new window.Image();
      probe.onload = () => {
        isLoaded.value = true;
      };
      probe.src = props.src;
    });

    return () =>
      slots.default?.({
        src: props.src,
        isLoaded: isLoaded.value,
        imgAttrs: {
          alt: props.alt,
          width: props.width,
          height: props.height,
          onLoad: () => {
            isLoaded.value = true;
          },
        },
      });
  },
});
