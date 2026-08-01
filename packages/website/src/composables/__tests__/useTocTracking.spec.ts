import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, type Ref } from 'vue';

type ObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void;

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = [];

  callback: ObserverCallback;

  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();

  constructor(callback: ObserverCallback) {
    this.callback = callback;
    IntersectionObserverMock.instances.push(this);
  }
}

describe('useTocTracking', () => {
  beforeEach(() => {
    IntersectionObserverMock.instances = [];
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  const mountWithHeadings = async (
    ids: string[],
  ): Promise<{
    wrapper: ReturnType<typeof mount>;
    getActiveId: () => Ref<string | null>;
  }> => {
    ids.forEach((id) => {
      const section = document.createElement('section');

      section.id = id;
      document.body.appendChild(section);
    });

    const { useTocTracking } = await import('../useTocTracking');
    const captured: { activeId: Ref<string | null> } = {
      activeId: { value: null } as Ref<string | null>,
    };

    const TestComponent = defineComponent({
      setup() {
        const result = useTocTracking(ids);

        captured.activeId = result.activeId;

        return () => h('div');
      },
    });

    const wrapper = mount(TestComponent, { attachTo: document.body });

    return {
      wrapper,
      getActiveId: (): Ref<string | null> => captured.activeId,
    };
  };

  it('sets activeId to the id of the section reported as intersecting', async () => {
    const { getActiveId } = await mountWithHeadings(['intro', 'details']);
    const observer = IntersectionObserverMock.instances[0];

    expect(observer).toBeDefined();

    const introEl = document.getElementById('intro') as Element;

    observer!.callback(
      [{ target: introEl, isIntersecting: true } as IntersectionObserverEntry],
      observer as unknown as IntersectionObserver,
    );

    expect(getActiveId().value).toBe('intro');
  });

  // The topmost intersecting section wins: the active item is the heading
  // at the top of the viewport, not the bottom.
  it('sets activeId to the first intersecting section in document order when several intersect together', async () => {
    const { getActiveId } = await mountWithHeadings(['intro', 'details']);
    const observer = IntersectionObserverMock.instances[0];

    expect(observer).toBeDefined();

    const introEl = document.getElementById('intro') as Element;
    const detailsEl = document.getElementById('details') as Element;

    observer!.callback(
      [
        { target: introEl, isIntersecting: true },
        { target: detailsEl, isIntersecting: true },
      ] as IntersectionObserverEntry[],
      observer as unknown as IntersectionObserver,
    );

    expect(getActiveId().value).toBe('intro');
  });

  it('disconnects the IntersectionObserver on unmount', async () => {
    const { wrapper } = await mountWithHeadings(['intro']);
    const observer = IntersectionObserverMock.instances[0];

    expect(observer).toBeDefined();

    wrapper.unmount();

    expect(observer!.disconnect).toHaveBeenCalled();
  });

  it('keeps activeId at null and does not throw when headingIds is empty', async () => {
    const { getActiveId, wrapper } = await mountWithHeadings([]);

    expect(getActiveId().value).toBeNull();
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it('keeps activeId at null and does not throw when IntersectionObserver is unavailable', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    const section = document.createElement('section');

    section.id = 'intro';
    document.body.appendChild(section);

    const { useTocTracking } = await import('../useTocTracking');
    const captured: { activeId: Ref<string | null> } = {
      activeId: { value: null } as Ref<string | null>,
    };

    const TestComponent = defineComponent({
      setup() {
        const result = useTocTracking(['intro']);

        captured.activeId = result.activeId;

        return () => h('div');
      },
    });

    expect(() =>
      mount(TestComponent, { attachTo: document.body }),
    ).not.toThrow();
    expect(captured.activeId.value).toBeNull();
  });
});
