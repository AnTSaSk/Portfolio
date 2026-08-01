import { defineComponent, h } from 'vue';

// Test-only stand-in for the real styleguide MainNav, isolated to satisfy vue/one-component-per-file.
export default defineComponent({
  name: 'OrganismMainNav',
  props: {
    links: { type: Array, required: true },
    min: Boolean,
    ariaLabel: { type: String, default: '' },
  },
  setup() {
    return () => h('footer', { class: 'o-mainNav' });
  },
});
