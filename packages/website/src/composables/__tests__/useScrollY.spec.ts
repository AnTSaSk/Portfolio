import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useScrollY', () => {
  let scrollListeners: Array<(event: Event) => void>;
  let matchesReducedMotion: boolean;

  beforeEach(() => {
    scrollListeners = [];
    matchesReducedMotion = false;

    vi.spyOn(window, 'addEventListener').mockImplementation(
      (type: string, listener: unknown) => {
        if (type === 'scroll') {
          scrollListeners.push(listener as (event: Event) => void);
        }
      },
    );
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('reduced-motion')
          ? matchesReducedMotion
          : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const emitScroll = (y: number): void => {
    Object.defineProperty(window, 'scrollY', {
      value: y,
      writable: true,
      configurable: true,
    });
    scrollListeners.forEach((listener) => listener(new Event('scroll')));
  };

  it('exposes a reactive scrollY starting at the current window.scrollY', async () => {
    Object.defineProperty(window, 'scrollY', {
      value: 42,
      writable: true,
      configurable: true,
    });

    const { useScrollY } = await import('../useScrollY');
    const { scrollY } = useScrollY();

    expect(scrollY.value).toBe(42);
  });

  it('updates scrollY reactively when a scroll event fires', async () => {
    const { useScrollY } = await import('../useScrollY');
    const { scrollY } = useScrollY();

    emitScroll(150);

    expect(scrollY.value).toBe(150);
  });

  it('sets isScrolled to false when scrollY is at or below 80', async () => {
    const { useScrollY } = await import('../useScrollY');
    const { isScrolled } = useScrollY();

    emitScroll(80);

    expect(isScrolled.value).toBe(false);
  });

  it('sets isScrolled to true when scrollY is above 80', async () => {
    const { useScrollY } = await import('../useScrollY');
    const { isScrolled } = useScrollY();

    emitScroll(81);

    expect(isScrolled.value).toBe(true);
  });

  it('sets isFooterMin to false when scrollY is at or below 120', async () => {
    const { useScrollY } = await import('../useScrollY');
    const { isFooterMin } = useScrollY();

    emitScroll(120);

    expect(isFooterMin.value).toBe(false);
  });

  it('sets isFooterMin to true when scrollY is above 120', async () => {
    const { useScrollY } = await import('../useScrollY');
    const { isFooterMin } = useScrollY();

    emitScroll(121);

    expect(isFooterMin.value).toBe(true);
  });

  it('registers the scroll listener as passive', async () => {
    const { useScrollY } = await import('../useScrollY');

    useScrollY();

    expect(window.addEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.anything(),
      expect.objectContaining({ passive: true }),
    );
  });

  it('removes the scroll listener on component unmount', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { mount } = await import('@vue/test-utils');
    const { defineComponent, h } = await import('vue');
    const { useScrollY } = await import('../useScrollY');

    const TestComponent = defineComponent({
      setup() {
        useScrollY();

        return () => h('div');
      },
    });
    const wrapper = mount(TestComponent);

    wrapper.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.anything(),
    );
  });

  it('does not set a smooth scroll-behavior on the document when prefers-reduced-motion is set', async () => {
    matchesReducedMotion = true;
    const originalScrollBehavior =
      document.documentElement.style.scrollBehavior;

    const { useScrollY } = await import('../useScrollY');

    useScrollY();

    expect(document.documentElement.style.scrollBehavior).toBe(
      originalScrollBehavior,
    );
  });

  it('does not access window or document at module evaluation time', async () => {
    const windowSpy = vi.spyOn(globalThis, 'window', 'get');
    const documentSpy = vi.spyOn(globalThis, 'document', 'get');

    vi.resetModules();
    await import('../useScrollY');

    expect(windowSpy).not.toHaveBeenCalled();
    expect(documentSpy).not.toHaveBeenCalled();

    windowSpy.mockRestore();
    documentSpy.mockRestore();
  });
});
