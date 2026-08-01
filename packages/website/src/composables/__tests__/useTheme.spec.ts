import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { customRef } from 'vue';

const THEME_COOKIE_KEY = 'ab-theme';

describe('useTheme', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;
  let mediaQueryListeners: Array<(event: { matches: boolean }) => void>;
  let matchesDark: boolean;
  let cookieStore: Record<string, string | undefined>;

  beforeEach(() => {
    mediaQueryListeners = [];
    matchesDark = false;
    cookieStore = {};
    document.documentElement.removeAttribute('data-theme');

    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('dark') ? matchesDark : false,
      media: query,
      addEventListener: (
        _event: string,
        listener: (e: { matches: boolean }) => void,
      ) => {
        mediaQueryListeners.push(listener);
      },
      removeEventListener: vi.fn(),
    }));
    vi.stubGlobal('matchMedia', matchMediaMock);

    // Mirrors Nuxt's useCookie: a ref backed by a shared cookie store, so the
    // initial value comes from whatever was seeded before useTheme() runs
    // (simulating the SSR-read cookie), and writes persist back to it.
    vi.stubGlobal(
      'useCookie',
      vi.fn((name: string, options?: { default?: () => string }) =>
        customRef((track, trigger) => ({
          get() {
            track();

            return cookieStore[name] ?? options?.default?.();
          },
          set(value: string) {
            cookieStore[name] = value;
            trigger();
          },
        })),
      ),
    );
    vi.stubGlobal('useHead', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults theme preference to "system" when no cookie value exists', async () => {
    const { useTheme } = await import('../useTheme');
    const { theme } = useTheme();

    expect(theme.value).toBe('system');
  });

  it('initializes theme preference from the "ab-theme" cookie', async () => {
    cookieStore[THEME_COOKIE_KEY] = 'dark';

    const { useTheme } = await import('../useTheme');
    const { theme } = useTheme();

    expect(theme.value).toBe('dark');
  });

  it('resolves "system" preference to "dark" when matchMedia reports prefers-color-scheme: dark', async () => {
    matchesDark = true;
    cookieStore[THEME_COOKIE_KEY] = 'system';

    const { useTheme } = await import('../useTheme');
    const { resolvedTheme } = useTheme();

    expect(resolvedTheme.value).toBe('dark');
  });

  it('resolves "system" preference to "light" when matchMedia reports no dark preference', async () => {
    matchesDark = false;
    cookieStore[THEME_COOKIE_KEY] = 'system';

    const { useTheme } = await import('../useTheme');
    const { resolvedTheme } = useTheme();

    expect(resolvedTheme.value).toBe('light');
  });

  it('resolves a non-"system" preference to itself regardless of matchMedia', async () => {
    matchesDark = true;
    cookieStore[THEME_COOKIE_KEY] = 'light';

    const { useTheme } = await import('../useTheme');
    const { resolvedTheme } = useTheme();

    expect(resolvedTheme.value).toBe('light');
  });

  it('resolves "system" preference to "dark" when matchMedia is unavailable (SSR-safe default)', async () => {
    cookieStore[THEME_COOKIE_KEY] = 'system';
    vi.stubGlobal('matchMedia', undefined);

    const { useTheme } = await import('../useTheme');
    const { resolvedTheme } = useTheme();

    expect(resolvedTheme.value).toBe('dark');
  });

  it('toggles the preference between light and dark on successive toggleTheme() calls', async () => {
    cookieStore[THEME_COOKIE_KEY] = 'light';

    const { useTheme } = await import('../useTheme');
    const { theme, toggleTheme } = useTheme();

    expect(theme.value).toBe('light');

    toggleTheme();
    expect(theme.value).toBe('dark');

    toggleTheme();
    expect(theme.value).toBe('light');
  });

  it('toggles from "system" (resolved dark) to explicit light in one call', async () => {
    matchesDark = true;
    cookieStore[THEME_COOKIE_KEY] = 'system';

    const { useTheme } = await import('../useTheme');
    const { theme, resolvedTheme, toggleTheme } = useTheme();

    expect(resolvedTheme.value).toBe('dark');

    toggleTheme();
    expect(theme.value).toBe('light');
    expect(resolvedTheme.value).toBe('light');
  });

  it('toggles from "system" (resolved light) to explicit dark in one call', async () => {
    matchesDark = false;
    cookieStore[THEME_COOKIE_KEY] = 'system';

    const { useTheme } = await import('../useTheme');
    const { theme, resolvedTheme, toggleTheme } = useTheme();

    expect(resolvedTheme.value).toBe('light');

    toggleTheme();
    expect(theme.value).toBe('dark');
    expect(resolvedTheme.value).toBe('dark');
  });

  it('persists the new theme preference to the "ab-theme" cookie on toggleTheme()', async () => {
    cookieStore[THEME_COOKIE_KEY] = 'light';

    const { useTheme } = await import('../useTheme');
    const { toggleTheme } = useTheme();

    toggleTheme();

    expect(cookieStore[THEME_COOKIE_KEY]).toBe('dark');
  });

  it('persists the theme preference to the "ab-theme" cookie via setTheme()', async () => {
    const { useTheme } = await import('../useTheme');
    const { setTheme } = useTheme();

    setTheme('dark');

    expect(cookieStore[THEME_COOKIE_KEY]).toBe('dark');
  });

  it('applies the resolved theme as data-theme attribute on document.documentElement', async () => {
    cookieStore[THEME_COOKIE_KEY] = 'dark';

    const { useTheme } = await import('../useTheme');

    useTheme();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('updates the data-theme attribute on document.documentElement after setTheme()', async () => {
    cookieStore[THEME_COOKIE_KEY] = 'light';

    const { useTheme } = await import('../useTheme');
    const { setTheme } = useTheme();

    setTheme('dark');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('calls useHead with htmlAttrs["data-theme"] bound to resolvedTheme so SSR renders it', async () => {
    cookieStore[THEME_COOKIE_KEY] = 'dark';

    const { useTheme } = await import('../useTheme');
    const { resolvedTheme } = useTheme();

    expect(useHead).toHaveBeenCalledWith(
      expect.objectContaining({
        htmlAttrs: expect.objectContaining({ 'data-theme': resolvedTheme }),
      }),
    );
  });

  it('does not access window, document or localStorage at module evaluation time', async () => {
    const windowSpy = vi.spyOn(globalThis, 'window', 'get');
    const documentSpy = vi.spyOn(globalThis, 'document', 'get');

    vi.resetModules();
    await import('../useTheme');

    expect(windowSpy).not.toHaveBeenCalled();
    expect(documentSpy).not.toHaveBeenCalled();

    windowSpy.mockRestore();
    documentSpy.mockRestore();
  });
});
