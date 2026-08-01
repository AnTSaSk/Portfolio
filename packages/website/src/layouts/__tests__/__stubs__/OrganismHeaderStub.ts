import { defineComponent, h } from 'vue';

// Test-only stand-in for the real styleguide Header, isolated to satisfy vue/one-component-per-file.
export default defineComponent({
  name: 'OrganismHeader',
  props: {
    scrolled: Boolean,
    theme: { type: String, default: '' },
    locale: { type: String, default: '' },
    socialLinks: { type: Array, default: () => [] },
  },
  emits: ['toggleTheme', 'changeLang'],
  setup(_props, { slots }) {
    return () => h('header', { class: 'o-header' }, slots.default?.());
  },
});
