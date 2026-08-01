// Tracks the currently active heading via IntersectionObserver. SSR-safe and
// resilient when IntersectionObserver is unavailable (no-op, no throw).
import {
  onMounted,
  onUnmounted,
  ref,
  toValue,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue';

interface UseTocTrackingReturn {
  activeId: Ref<string | null>;
}

// Detection line sits just below the sticky header so a heading turns active
// as it reaches the top of the viewport, not when it appears at the bottom.
const HEADER_OFFSET = 100;

export const useTocTracking = (
  headingIds: MaybeRefOrGetter<string[]>,
): UseTocTrackingReturn => {
  const activeId = ref<string | null>(null);
  let observer: IntersectionObserver | undefined;

  onMounted(() => {
    const ids = toValue(headingIds);

    if (typeof IntersectionObserver === 'undefined' || ids.length === 0) {
      return;
    }

    activeId.value = ids[0] ?? null;
    const visible = new Set<string>();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { id } = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        });

        // Active = the last heading whose top has crossed the detection line,
        // i.e. the first one still visible in document order.
        const current = ids.find((id) => visible.has(id));

        if (current) {
          activeId.value = current;
        }
      },
      { rootMargin: `-${HEADER_OFFSET}px 0px -70% 0px` },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);

      if (el) {
        observer?.observe(el);
      }
    });
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { activeId };
};
