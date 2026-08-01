import { defineComponent, h } from 'vue';

// Test-only stand-in for the real styleguide AtomButton.
export default defineComponent({
  name: 'AtomButton',
  props: {
    variant: { type: String, default: 'primary' },
    type: { type: String, default: 'button' },
    href: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h('a', { class: 'a-button', href: props.href }, slots.default?.());
  },
});
