// SSR-safe reactive scrollY tracker. No smooth-scroll is ever introduced
// here, so prefers-reduced-motion is respected trivially.
import { computed, onScopeDispose, ref, type ComputedRef, type Ref } from 'vue';

interface UseScrollYReturn {
  scrollY: Ref<number>;
  isScrolled: ComputedRef<boolean>;
  isFooterMin: ComputedRef<boolean>;
}

export const useScrollY = (): UseScrollYReturn => {
  const scrollY = ref(typeof window === 'undefined' ? 0 : window.scrollY);

  if (typeof window !== 'undefined') {
    const handleScroll = (): void => {
      scrollY.value = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    onScopeDispose(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  }

  const isScrolled = computed(() => scrollY.value > 80);
  const isFooterMin = computed(() => scrollY.value > 120);

  return { scrollY, isScrolled, isFooterMin };
};
