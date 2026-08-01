import { computed, type ComputedRef, type Ref } from 'vue';

export interface TagFilterItem {
  id: string;
  label: string;
  pressed: boolean;
  count?: number;
}

export interface UseTagFiltersOptions {
  values: Ref<string[][]>;
  selected: Ref<string | null>;
  allLabel: Ref<string> | ComputedRef<string>;
  threshold: number;
  cap: number;
}

export interface UseTagFiltersResult {
  items: ComputedRef<TagFilterItem[]>;
  isVisible: ComputedRef<boolean>;
}

export function useTagFilters(
  options: UseTagFiltersOptions,
): UseTagFiltersResult {
  const ranked = computed<Array<{ value: string; count: number }>>(() => {
    const counts = new Map<string, number>();

    for (const facets of options.values.value) {
      for (const value of facets) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .filter((entry) => entry.count >= options.threshold)
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
      .slice(0, options.cap);
  });

  const items = computed<TagFilterItem[]>(() => [
    {
      id: 'all',
      label: options.allLabel.value,
      pressed: options.selected.value === null,
    },
    ...ranked.value.map((entry) => ({
      id: entry.value,
      label: entry.value,
      pressed: options.selected.value === entry.value,
      count: entry.count,
    })),
  ]);

  const isVisible = computed(() => ranked.value.length >= 2);

  return { items, isVisible };
}
