import { defineComponent, h } from 'vue';

// Test-only stand-in for the real styleguide AtomWatermark.
export default defineComponent({
  name: 'AtomWatermark',
  props: {
    text: { type: String, default: '' },
  },
  setup(props) {
    return () => h('svg', { class: 'a-watermark' }, String(props.text));
  },
});
