import { defineComponent, h } from 'vue';

// Test-only stand-in for the real styleguide AtomText.
export default defineComponent({
  name: 'AtomText',
  props: {
    tag: { type: String, default: 'p' },
    variant: { type: String, default: 'body' },
    weight: { type: String, default: 'regular' },
    tone: { type: String, default: 'default' },
    prose: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => h(props.tag, { class: 'a-text' }, slots.default?.());
  },
});
