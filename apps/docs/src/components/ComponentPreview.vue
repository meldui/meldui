<script setup lang="ts">
import { type Component, markRaw, onErrorCaptured, onMounted, provide, shallowRef } from 'vue'
import { DemoPreviewKey } from './demo-preview'

/**
 * Lazy, interactive live preview of a single catalog component.
 *
 * SSR-safe: nothing heavy is imported at module scope, so it server-renders a
 * skeleton placeholder. Mounted via `client:visible`, so the actual demo is
 * only fetched + rendered when the row scrolls near the viewport.
 *
 * - `vue` / `charts`: dynamically import the canonical `*Demo.vue` file. Those
 *   wrap their content in `<DemoBlock>`, which renders chrome-free because we
 *   provide `DemoPreviewKey` here.
 * - `a2ui`: render `A2uiPreviewCell` (which owns the A2UI surface + provider).
 */
const props = defineProps<{
  previewKey: string
  kind: 'vue' | 'charts' | 'a2ui'
}>()

// Chrome-free DemoBlock for every demo rendered beneath this preview.
provide(DemoPreviewKey, true)

// Loader map for all demo files (non-eager: just `() => import()` thunks).
const demoModules = import.meta.glob('../demos/**/*Demo.vue')

const loaded = shallowRef<Component | null>(null)
const errored = shallowRef(false)

async function load() {
  try {
    if (props.kind === 'a2ui') {
      const mod = await import('./A2uiPreviewCell.vue')
      loaded.value = markRaw(mod.default)
      return
    }
    const path = `../demos/${props.previewKey}.vue`
    const loader = demoModules[path]
    if (!loader) {
      errored.value = true
      return
    }
    const mod = (await loader()) as { default: Component }
    loaded.value = markRaw(mod.default)
  } catch {
    errored.value = true
  }
}

onMounted(load)

onErrorCaptured(() => {
  errored.value = true
  return false
})

const componentProps = props.kind === 'a2ui' ? { name: props.previewKey } : {}
</script>

<template>
  <div class="flex min-h-[7rem] w-full items-center justify-center">
    <component :is="loaded" v-if="loaded" v-bind="componentProps" />
    <span v-else-if="errored" class="text-xs text-muted-foreground">
      Preview unavailable — open docs →
    </span>
    <div v-else class="h-16 w-full animate-pulse rounded-md bg-muted/50" aria-hidden="true" />
  </div>
</template>
