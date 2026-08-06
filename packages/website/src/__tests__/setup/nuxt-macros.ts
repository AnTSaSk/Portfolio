import { vi } from 'vitest';
import { ref } from 'vue';

// Shared test harness: stubs Nuxt compiler macros/auto-imports so page SFCs
// can be mounted in isolation with @vue/test-utils (no Nuxt runtime).
// Individual spec files may override any of these globals locally
// (module-level vi.stubGlobal runs after this setup file, per vitest lifecycle).

export const definePageMetaMock = vi.fn();
export const useSeoMetaMock = vi.fn();
export const useHeadMock = vi.fn();
export const useLocaleHeadMock = vi.fn(() => ({
  htmlAttrs: {},
  link: [],
  meta: [],
}));
export const useLocalePathMock = vi.fn((path: string) => path);
export const useSwitchLocalePathMock = vi.fn((target: string) => `/${target}`);
export const navigateToMock = vi.fn();
export const useCookieMock = vi.fn(
  <T>(_name: string, options?: { default?: () => T }) =>
    ref(options?.default ? options.default() : null),
);
export const useSiteConfigMock = vi.fn(() => ({
  url: 'https://alexisbesson.fr',
  name: 'Alexis Besson',
}));
export const definePersonMock = vi.fn(
  (person: Record<string, unknown>) => person,
);
export const useSchemaOrgMock = vi.fn();
export const useBreadcrumbItemsMock = vi.fn(() => ref([]));
export const useI18nMock = vi.fn(() => ({
  locale: ref('en'),
  t: (key: string) => key,
}));
vi.stubGlobal('definePageMeta', definePageMetaMock);
vi.stubGlobal('useSeoMeta', useSeoMetaMock);
vi.stubGlobal('useHead', useHeadMock);
vi.stubGlobal('useLocaleHead', useLocaleHeadMock);
vi.stubGlobal('useLocalePath', () => useLocalePathMock);
vi.stubGlobal('useSwitchLocalePath', () => useSwitchLocalePathMock);
vi.stubGlobal('navigateTo', navigateToMock);
vi.stubGlobal('useCookie', useCookieMock);
vi.stubGlobal('useSiteConfig', useSiteConfigMock);
vi.stubGlobal('definePerson', definePersonMock);
vi.stubGlobal('useSchemaOrg', useSchemaOrgMock);
vi.stubGlobal('useBreadcrumbItems', useBreadcrumbItemsMock);
vi.stubGlobal('useI18n', useI18nMock);
