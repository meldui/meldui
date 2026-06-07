<script setup lang="ts">
import { defineComponent, h, onMounted, ref } from 'vue'
import { CATALOG_ID } from '@meldui/a2ui'
import { A2UISurface, provideA2UI } from '@meldui/a2ui/vue'
import { Button, Textarea } from '@meldui/vue'
import '@incremark/theme/styles.css'

/**
 * Interactive A2UI playground: edit raw A2UI v0.9 messages and press Render to
 * see them rendered live with MeldUI components. Each render mounts a fresh
 * surface (the render panel is keyed), so re-running starts clean.
 */
const DEFAULT_MESSAGES = [
  { version: 'v0.9', createSurface: { surfaceId: 's1', catalogId: CATALOG_ID } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 's1',
      components: [
        { id: 'root', component: 'Card', child: 'col' },
        { id: 'col', component: 'Column', children: ['h', 'p', 'row'] },
        { id: 'h', component: 'Text', text: 'A2UI Playground', variant: 'h4' },
        {
          id: 'p',
          component: 'Markdown',
          content: 'Edit the messages above and press **Render**.',
        },
        { id: 'row', component: 'Row', children: ['b1', 'b2'] },
        { id: 'b1', component: 'Badge', label: 'Live' },
        { id: 'b2', component: 'Badge', label: 'Editable', variant: 'secondary' },
      ],
    },
  },
]

/** Renders one fresh surface for the given messages (its own processor). */
const SurfaceOnce = defineComponent({
  name: 'A2uiSurfaceOnce',
  props: { messages: { type: Array, required: true } },
  setup(props) {
    const { processor } = provideA2UI()
    onMounted(() => processor.processMessages(props.messages as never))
    return () => h(A2UISurface, { surfaceId: 's1' })
  },
})

const text = ref(JSON.stringify(DEFAULT_MESSAGES, null, 2))
const messages = ref<unknown[]>(DEFAULT_MESSAGES)
const error = ref('')
const renderKey = ref(0)

function run() {
  try {
    const parsed = JSON.parse(text.value)
    messages.value = Array.isArray(parsed) ? parsed : [parsed]
    error.value = ''
    renderKey.value += 1
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}
</script>

<template>
  <div class="my-6 flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Textarea
        v-model="text"
        wrap="off"
        spellcheck="false"
        class="h-[360px] w-full resize-y overflow-auto whitespace-pre font-mono text-xs"
      />
      <div class="flex items-center gap-3">
        <Button @click="run">Render</Button>
        <span v-if="error" class="text-sm text-destructive">{{ error }}</span>
      </div>
    </div>
    <div class="rounded-lg border border-border p-4">
      <component :is="SurfaceOnce" :key="renderKey" :messages="messages" />
    </div>
  </div>
</template>
