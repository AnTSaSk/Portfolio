import { defineComponent, h } from 'vue';

// Test-only stand-in for the real styleguide OrganismHero.
export default defineComponent({
  name: 'OrganismHero',
  props: {
    greeting: { type: String, default: 'Bonsoir !' },
    name: { type: String, required: true },
    role: { type: String, required: true },
    body: { type: Array, default: () => [] },
    tags: { type: Array, default: () => [] },
    watermarkText: { type: String, default: '' },
    primaryHref: { type: String, default: '#' },
    primaryLabel: { type: String, default: 'Voir les projets' },
    secondaryHref: { type: String, default: '#' },
    secondaryLabel: { type: String, default: '' },
    secondaryExternal: { type: Boolean, default: false },
  },
  setup() {
    return () => h('section', { class: 'o-hero' });
  },
});
