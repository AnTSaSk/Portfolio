import { defineComponent, h } from 'vue';

// Test-only stand-in for the real styleguide AtomLink.
export default defineComponent({
  name: 'AtomLink',
  props: {
    href: { type: String, required: true },
    external: { type: Boolean, default: false },
    current: { type: Boolean, default: false },
    variant: { type: String, default: 'inline' },
    arrowPosition: { type: String, default: 'after' },
  },
  setup(props, { slots }) {
    return () =>
      h('a', { class: 'a-link', href: props.href }, slots.default?.());
  },
});
