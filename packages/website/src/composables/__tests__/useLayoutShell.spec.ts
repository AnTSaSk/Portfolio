import { describe, expect, it, vi } from 'vitest';

import { navigateToMock } from '@/__tests__/setup/nuxt-macros';

vi.stubGlobal('useRoute', () => ({ path: '/' }));

describe('useLayoutShell', () => {
  it('exposes the shared shell state consumed by both layouts', async () => {
    const { useLayoutShell } = await import('../useLayoutShell');
    const shell = useLayoutShell();

    expect(shell.currentLocale.value).toBe('en');
    expect(shell.homeHref.value).toBe('/');
    expect(shell.socialLinks.value.map((link) => link.icon)).toEqual([
      'github',
      'linkedin',
      'x',
    ]);
    expect(shell.links.value).toHaveLength(4);
    expect(typeof shell.toggleTheme).toBe('function');
  });

  it('navigates to the switched locale path on language change', async () => {
    const { useLayoutShell } = await import('../useLayoutShell');
    const shell = useLayoutShell();

    shell.onChangeLang('fr');

    expect(navigateToMock).toHaveBeenCalledWith('/fr');
  });
});
