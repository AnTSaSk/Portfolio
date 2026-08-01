import { describe, expect, it } from 'vitest';
import { computed, ref } from 'vue';

import { useTagFilters } from '../useTagFilters';

describe('useTagFilters', () => {
  const allLabel = computed(() => 'Tous');

  it('counts frequency per facet value', () => {
    const values = ref([['a', 'b'], ['a'], ['a', 'c']]);
    const selected = ref<string | null>(null);
    const { items } = useTagFilters({
      values,
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    const byId = Object.fromEntries(items.value.map((i) => [i.id, i.count]));

    expect(byId.a).toBe(3);
    expect(byId.b).toBe(1);
    expect(byId.c).toBe(1);
  });

  it('orders by frequency desc then alphabetically', () => {
    const values = ref([['b'], ['a'], ['a'], ['c'], ['c']]);
    const selected = ref<string | null>(null);
    const { items } = useTagFilters({
      values,
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    // drop the leading "all" item
    const ids = items.value.slice(1).map((i) => i.id);

    expect(ids).toEqual(['a', 'c', 'b']);
  });

  it('drops values below the per-page threshold', () => {
    const values = ref([['a', 'b'], ['a'], ['a']]);
    const selected = ref<string | null>(null);
    const { items } = useTagFilters({
      values,
      selected,
      allLabel,
      threshold: 2,
      cap: 8,
    });

    const ids = items.value.slice(1).map((i) => i.id);

    expect(ids).toEqual(['a']);
    expect(ids).not.toContain('b');
  });

  it('keeps every value when threshold is 1', () => {
    const values = ref([['a'], ['b'], ['c']]);
    const selected = ref<string | null>(null);
    const { items } = useTagFilters({
      values,
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    expect(
      items.value
        .slice(1)
        .map((i) => i.id)
        .sort(),
    ).toEqual(['a', 'b', 'c']);
  });

  it('caps to the top N after ordering', () => {
    const values = ref(
      Array.from({ length: 10 }, (_, n) => [`t${String(n).padStart(2, '0')}`]),
    );
    const selected = ref<string | null>(null);
    const { items } = useTagFilters({
      values,
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    // 1 "all" + 8 filters max
    expect(items.value).toHaveLength(9);
  });

  it('prepends an "all" item reflecting the selection', () => {
    const values = ref([['a'], ['a']]);
    const selected = ref<string | null>(null);
    const { items } = useTagFilters({
      values,
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    expect(items.value[0]).toMatchObject({
      id: 'all',
      label: 'Tous',
      pressed: true,
    });

    selected.value = 'a';
    expect(items.value[0]?.pressed).toBe(false);
    expect(items.value.find((i) => i.id === 'a')?.pressed).toBe(true);
  });

  it('is not visible when 1 or 0 filters remain besides "all"', () => {
    const selected = ref<string | null>(null);

    const one = useTagFilters({
      values: ref([['a'], ['a']]),
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    expect(one.isVisible.value).toBe(false);

    const none = useTagFilters({
      values: ref([[], []]),
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    expect(none.isVisible.value).toBe(false);

    const two = useTagFilters({
      values: ref([['a'], ['b']]),
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    expect(two.isVisible.value).toBe(true);
  });

  it('exposes a numeric count on each filter item', () => {
    const values = ref([['a', 'b'], ['a']]);
    const selected = ref<string | null>(null);
    const { items } = useTagFilters({
      values,
      selected,
      allLabel,
      threshold: 1,
      cap: 8,
    });

    expect(items.value.find((i) => i.id === 'a')?.count).toBe(2);
    expect(items.value.find((i) => i.id === 'b')?.count).toBe(1);
    // the "all" item carries no count
    expect(items.value[0]?.count).toBeUndefined();
  });
});
