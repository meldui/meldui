<script setup lang="ts">
import { onMounted } from 'vue'
import { examples } from '@meldui/a2ui'
import { A2UISurface, provideA2UI } from '@meldui/a2ui/vue'
import '@incremark/theme/styles.css'

/**
 * Renders one A2UI catalog component's canonical example as a live surface.
 * Loaded lazily (client-side only) by ComponentPreview, so the heavy A2UI
 * imports never run during SSR. `provideA2UI` must run synchronously in setup,
 * which is why this lives in its own dynamically-imported component.
 */
const props = defineProps<{ name: string }>()

const messages = examples[props.name] ?? []

const { processor } = provideA2UI({
  onAction: (action) => {
    // eslint-disable-next-line no-console
    console.log('[catalog preview] action', action)
  },
})
onMounted(() => processor.processMessages(messages as never))
</script>

<template>
  <div class="w-full">
    <A2UISurface surface-id="s1" />
  </div>
</template>
