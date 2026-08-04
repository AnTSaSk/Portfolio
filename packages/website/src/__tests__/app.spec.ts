import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import { definePersonMock, useSchemaOrgMock } from './setup/nuxt-macros';

const NuxtLayoutStub = defineComponent({
  name: 'NuxtLayout',
  setup(_props, { slots }) {
    return () => h('div', { class: 'nuxt-layout-stub' }, slots.default?.());
  },
});

const NuxtPageStub = defineComponent({
  name: 'NuxtPage',
  setup() {
    return () => h('div', { class: 'nuxt-page-stub' });
  },
});

async function mountApp(): Promise<ReturnType<typeof mount>> {
  const App = (await import('../app.vue')).default;

  return mount(App, {
    global: {
      stubs: {
        NuxtLayout: NuxtLayoutStub,
        NuxtPage: NuxtPageStub,
      },
    },
  });
}

describe('app.vue', () => {
  beforeEach(() => {
    useSchemaOrgMock.mockClear();
    definePersonMock.mockClear();
  });

  it('calls useSchemaOrg on mount to emit the global Person JSON-LD', async () => {
    await mountApp();

    expect(useSchemaOrgMock).toHaveBeenCalledTimes(1);
  });

  it('passes a Person with the expected name and jobTitle', async () => {
    await mountApp();

    const { calls } = useSchemaOrgMock.mock;

    expect(calls[0]).toBeDefined();

    const [schemaNodes] = calls[0]! as [Array<Record<string, unknown>>];

    expect(schemaNodes[0]).toBeDefined();

    const person = schemaNodes[0]!;

    expect(person).toMatchObject({
      '@id': 'https://alexisbesson.fr/#identity',
      name: 'Alexis Besson',
      jobTitle: 'Lead Front-end JS/TS, Vue 3 / Nuxt',
      image: 'https://alexisbesson.fr/img/Blog/author.jpg',
    });
  });

  it('passes a Person whose sameAs contains the linkedin, github and x profile URLs', async () => {
    await mountApp();

    const { calls } = useSchemaOrgMock.mock;

    expect(calls[0]).toBeDefined();

    const [schemaNodes] = calls[0]! as [Array<Record<string, unknown>>];

    expect(schemaNodes[0]).toBeDefined();

    const person = schemaNodes[0]!;

    expect(person.sameAs).toEqual(
      expect.arrayContaining([
        'https://www.linkedin.com/in/alexis-besson-lead-front',
        'https://github.com/AnTSaSk',
        'https://x.com/AlexisBessonWeb',
      ]),
    );
  });

  // a WebSite node (name, url, inLanguage) alongside Person, no
  // fabricated SearchAction (no real site search exists per GAP-4).
  it('passes a WebSite node with name, url and an EN/FR inLanguage indication', async () => {
    await mountApp();

    const { calls } = useSchemaOrgMock.mock;

    expect(calls[0]).toBeDefined();

    const [schemaNodes] = calls[0]! as [Array<Record<string, unknown>>];
    const website = schemaNodes.find((node) => node['@type'] === 'WebSite');

    expect(website).toBeDefined();
    expect(website).toMatchObject({
      name: 'Alexis Besson',
      url: 'https://alexisbesson.fr',
    });
    expect(['en', 'fr']).toContain(website!.inLanguage);
  });

  it('never includes a potentialAction/SearchAction on the WebSite node', async () => {
    await mountApp();

    const { calls } = useSchemaOrgMock.mock;

    expect(calls[0]).toBeDefined();

    const [schemaNodes] = calls[0]! as [Array<Record<string, unknown>>];
    const website = schemaNodes.find((node) => node['@type'] === 'WebSite');

    expect(website).toBeDefined();
    expect(website).not.toHaveProperty('potentialAction');
  });
});
