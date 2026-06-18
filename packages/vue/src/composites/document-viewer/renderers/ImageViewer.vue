<script setup lang="ts">
/**
 * ImageViewer — renders an image source inside the viewer.
 *
 * Supports zoom (via `scale` prop) and rotation. Non-PDF features
 * (annotations, search, outline, thumbnails) are not applicable.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { sourceToUrl } from '../utils/documentType'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { DocumentSource } from '../types'

interface Props {
  source: DocumentSource
  scale?: number
  rotation?: 0 | 90 | 180 | 270
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  scale: 1,
  rotation: 0,
  alt: 'Document',
})

const emit = defineEmits<{
  (e: 'loaded', payload: { width: number; height: number }): void
  (e: 'error', payload: { error: string }): void
}>()

const imageUrl = ref<string>('')
let revokeFn: (() => void) | null = null

watch(
  () => props.source,
  (source) => {
    revokeFn?.()
    const resolved = sourceToUrl(source)
    imageUrl.value = resolved.url
    revokeFn = resolved.revoke
  },
  { immediate: true },
)

onBeforeUnmount(() => revokeFn?.())

const transform = computed(() => `scale(${props.scale}) rotate(${props.rotation}deg)`)

function handleLoad(e: Event) {
  const img = e.target as HTMLImageElement
  emit('loaded', { width: img.naturalWidth, height: img.naturalHeight })
}

function handleError() {
  emit('error', { error: 'Failed to load image' })
}
</script>

<template>
  <ScrollArea class="image-viewer h-full w-full bg-muted">
    <div class="flex min-h-full min-w-full items-center justify-center p-8">
      <img
        :src="imageUrl"
        :alt="alt"
        :style="{
          transform,
          transformOrigin: 'center',
          transition: 'transform 200ms ease-out',
        }"
        draggable="false"
        class="max-w-full max-h-full object-contain select-none"
        @load="handleLoad"
        @error="handleError"
      />
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>

<style scoped>
/*
 * Fit & center fix for the image inside reka-ui's ScrollArea.
 *
 * `ScrollAreaViewport` wraps slotted content in a div that only sets
 * `min-width: fit-content`; its height stays `auto`. A percentage height
 * resolves only against a parent with a *definite* height, so that auto-height
 * wrapper silently nullifies the `min-h-full` / `max-h-full` below it — the
 * image then lays out at its intrinsic height (taller than the viewport)
 * instead of fitting, which made zoom-out / rotation look bottom-anchored
 * rather than centered.
 *
 * Forcing both the injected wrapper AND our flex stage to `height: 100%` gives
 * the image a definite-height ancestor chain, so `max-h-full` clamps it to the
 * viewport and `items-center` centers it. Scoped to the image viewer only.
 */
.image-viewer :deep([data-slot='scroll-area-viewport'] > div:not([data-slot])),
.image-viewer
  :deep([data-slot='scroll-area-viewport'] > div:not([data-slot]) > div:not([data-slot])) {
  height: 100%;
}
</style>
