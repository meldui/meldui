<script setup lang="ts">
import { onMounted } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { examples } from '@meldui/a2ui'
import { A2UISurface, provideA2UI } from '@meldui/a2ui/vue'
import '@incremark/theme/styles.css'

/**
 * Reusable docs demo: renders a catalog component's canonical A2UI example
 * (live) alongside the exact A2UI messages an agent would emit (code tab).
 * Both come from the single `examples` source in @meldui/a2ui.
 */
const props = defineProps<{ component: string }>()

const messages = examples[props.component] ?? []
const code = JSON.stringify(messages, null, 2)

const { processor } = provideA2UI({
  onAction: (action) => {
    // eslint-disable-next-line no-console
    console.log('[a2ui demo] action', action)
  },
})
onMounted(() => processor.processMessages(messages as never))
</script>

<template>
  <DemoBlock :code="code" lang="json">
    <div class="w-full max-w-xl">
      <A2UISurface surface-id="s1" />
    </div>
  </DemoBlock>
</template>
