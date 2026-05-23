<script setup lang="ts">
/**
 * MeldImageRenderer — renders an image source inside the viewer.
 *
 * Supports zoom (via `scale` prop) and rotation. Non-PDF features
 * (annotations, search, outline, thumbnails) are not applicable.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { sourceToUrl } from '../utils/documentType'
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
  <div
    class="meld-image-renderer flex h-full items-center justify-center overflow-auto bg-muted p-8"
  >
    <img
      :src="imageUrl"
      :alt="alt"
      :style="{
        transform,
        transformOrigin: 'center center',
        transition: 'transform 200ms ease-out',
      }"
      class="max-w-full max-h-full object-contain"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>
