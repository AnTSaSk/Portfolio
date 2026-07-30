<template>
  <div v-if="reveal" class="a-image__frame" :class="{ '-revealed': revealed }">
    <div class="a-image__ph">
      <slot name="placeholder" />
    </div>
    <component
      :is="imageComponent"
      v-if="imageComponent"
      :src="src"
      :alt="alt"
      :sizes="sizes"
      :densities="densities"
      :format="format"
      :width="width"
      :height="height"
      :fetchpriority="fetchpriority"
      :loading="loading"
      custom
    >
      <template #default="{ src: resolvedSrc, isLoaded, imgAttrs }">
        <RevealBridge :loaded="isLoaded" @reveal="revealed = true" />
        <img
          ref="imgEl"
          class="a-image -reveal"
          :class="fitModifier"
          v-bind="imgAttrs"
          :src="resolvedSrc"
          :alt="alt"
          @error="onError($event)"
        />
      </template>
    </component>
    <picture v-else-if="sources && sources.length > 0">
      <source
        v-for="source in sources"
        :key="source.srcset"
        :srcset="source.srcset"
        :type="source.type"
        :media="source.media"
      />
      <img
        ref="imgEl"
        class="a-image -reveal"
        :class="fitModifier"
        :src="src"
        :alt="alt"
        :srcset="srcset"
        :sizes="sizes"
        :width="width"
        :height="height"
        :loading="loading"
        :decoding="decoding"
        :fetchpriority="fetchpriority"
        @load="onLoad($event)"
        @error="onError($event)"
      />
    </picture>
    <img
      v-else
      ref="imgEl"
      class="a-image -reveal"
      :class="fitModifier"
      :src="src"
      :alt="alt"
      :srcset="srcset"
      :sizes="sizes"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
      @load="onLoad($event)"
      @error="onError($event)"
    />
  </div>

  <template v-else>
    <component
      :is="imageComponent"
      v-if="imageComponent"
      :src="src"
      :alt="alt"
      :sizes="sizes"
      :densities="densities"
      :format="format"
      :width="width"
      :height="height"
      :fetchpriority="fetchpriority"
      :loading="loading"
      custom
    >
      <template #default="{ src: resolvedSrc, imgAttrs }">
        <img
          class="a-image"
          :class="fitModifier"
          v-bind="imgAttrs"
          :src="resolvedSrc"
          :alt="alt"
          @error="emit('error', $event)"
        />
      </template>
    </component>
    <picture v-else-if="sources && sources.length > 0">
      <source
        v-for="source in sources"
        :key="source.srcset"
        :srcset="source.srcset"
        :type="source.type"
        :media="source.media"
      />
      <img
        class="a-image"
        :class="fitModifier"
        :src="src"
        :alt="alt"
        :srcset="srcset"
        :sizes="sizes"
        :width="width"
        :height="height"
        :loading="loading"
        :decoding="decoding"
        :fetchpriority="fetchpriority"
        @error="emit('error', $event)"
      />
    </picture>

    <img
      v-else
      class="a-image"
      :class="fitModifier"
      :src="src"
      :alt="alt"
      :srcset="srcset"
      :sizes="sizes"
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
      @error="emit('error', $event)"
    />
  </template>
</template>

<script setup lang="ts">
  import {
    computed,
    defineComponent,
    onMounted,
    ref,
    watch,
    type Component,
  } from 'vue';

  // Bridges NuxtImg's `custom` slot `isLoaded` (a slot-scope value, not
  // reachable by a setup watcher) to the reveal state.
  const RevealBridge = defineComponent({
    name: 'RevealBridge',
    props: { loaded: { type: Boolean, required: true } },
    emits: { reveal: null },
    setup(props, { emit }) {
      watch(
        () => props.loaded,
        (value) => {
          if (value) {
            emit('reveal');
          }
        },
        { immediate: true },
      );
      return () => null;
    },
  });

  export interface ImageSource {
    srcset: string;
    type?: string;
    media?: string;
  }

  export type ImageFit = 'cover' | 'contain' | 'none';

  export interface Props {
    src: string;
    alt: string;
    srcset?: string;
    sizes?: string;
    width?: number | string;
    height?: number | string;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'sync' | 'auto';
    fetchpriority?: 'high' | 'low' | 'auto';
    sources?: ImageSource[];
    fit?: ImageFit;
    reveal?: boolean;
    imageComponent?: Component;
    densities?: string;
    format?: string;
  }

  defineOptions({ name: 'AtomImage' });

  const emit = defineEmits<{
    error: [event: Event];
    load: [event: Event];
  }>();

  const props = withDefaults(defineProps<Props>(), {
    srcset: undefined,
    sizes: undefined,
    width: undefined,
    height: undefined,
    loading: 'lazy',
    decoding: 'async',
    fetchpriority: undefined,
    sources: undefined,
    fit: 'cover',
    reveal: false,
    imageComponent: undefined,
    densities: undefined,
    format: undefined,
  });

  const fitModifier = computed(() =>
    props.fit === 'cover' ? undefined : `-${props.fit}`,
  );

  const imgEl = ref<HTMLImageElement | null>(null);
  const revealed = ref(false);

  const onLoad = (event: Event): void => {
    revealed.value = true;
    emit('load', event);
  };

  const onError = (event: Event): void => {
    revealed.value = false;
    emit('error', event);
  };

  // A cached image can finish before hydration, so its load event never
  // fires on the client; naturalWidth separates a real hit from a broken one.
  const syncFromCache = (): void => {
    const el = imgEl.value;
    if (el?.complete && el.naturalWidth > 0) {
      revealed.value = true;
    }
  };

  onMounted(syncFromCache);

  watch(
    () => props.src,
    () => {
      revealed.value = false;
      syncFromCache();
    },
  );
</script>

<style src="./style.css" />
