// SSR-safe theme composable. Preference is one of light/dark/system, where
// 'system' is only the initial default (no cookie yet) resolved via
// prefers-color-scheme; the user-facing toggle is binary (light <-> dark).
// Source of truth is the 'ab-theme' cookie (readable both server- and
// client-side via Nuxt's useCookie), so the server renders the correct
// data-theme/icon and the client's first paint matches, no hydration
// mismatch for explicit light/dark. Each call reads fresh state, no
// module-level singleton (avoids stale state across independent callers,
// e.g. between tests importing the same module).
import { computed, ref, type ComputedRef, type Ref } from 'vue';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const THEME_COOKIE_KEY = 'ab-theme';
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const isThemePreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system';

// No client hint available (SSR, or matchMedia unsupported): falls back to
// the design's dark default rather than a hardcoded light guess.
const resolveSystemTheme = (): ResolvedTheme => {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? resolveSystemTheme() : preference;

const applyDataTheme = (resolved: ResolvedTheme): void => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme', resolved);
};

interface UseThemeReturn {
  theme: Ref<ThemePreference>;
  resolvedTheme: ComputedRef<ResolvedTheme>;
  toggleTheme: () => void;
  setTheme: (value: ThemePreference) => void;
}

export const useTheme = (): UseThemeReturn => {
  // useCookie is a Nuxt auto-import (ambient global at build time, like
  // useRoute/useI18n elsewhere); a real import from 'nuxt/app' breaks module
  // resolution outside a full Nuxt build (e.g. plain Vitest).
  const themeCookie = useCookie<ThemePreference>(THEME_COOKIE_KEY, {
    default: () => 'system',
    maxAge: THEME_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });

  const theme = ref<ThemePreference>(
    isThemePreference(themeCookie.value) ? themeCookie.value : 'system',
  );

  const resolvedTheme = computed<ResolvedTheme>(() =>
    resolveTheme(theme.value),
  );

  // Render data-theme on <html> from the SSR-resolved value: same computed
  // read on server and client first paint, so hydration never diverges for
  // explicit light/dark. Unhead patches the real DOM attribute client-side.
  useHead({
    htmlAttrs: {
      'data-theme': resolvedTheme,
    },
  });

  const setTheme = (value: ThemePreference): void => {
    theme.value = value;
    themeCookie.value = value;

    applyDataTheme(resolveTheme(value));
  };

  // Binary toggle off the RESOLVED theme (not the raw preference), so a
  // 'system' preference flips to the opposite of what's currently shown in
  // one click instead of stepping through an invisible intermediate state.
  const toggleTheme = (): void => {
    setTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark');
  };

  applyDataTheme(resolvedTheme.value);

  return { theme, resolvedTheme, toggleTheme, setTheme };
};
