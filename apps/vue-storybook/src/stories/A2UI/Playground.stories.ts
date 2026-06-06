/**
 * A2UI JSON playground. Paste a raw A2UI v0.9 message sequence on the left, press
 * Render, and watch `@meldui/a2ui/vue` render it into MeldUI components on the
 * right. Each render mounts a fresh surface (the renderer panel is keyed), so
 * editing and re-running starts clean.
 */
import { defineComponent, h, onMounted, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CATALOG_ID } from '@meldui/a2ui'
import { A2UISurface, provideA2UI } from '@meldui/a2ui/vue'
import { Button, Textarea } from '@meldui/vue'
import '@incremark/theme/styles.css'

const meta: Meta = {
  title: 'A2UI/Playground',
}
export default meta
type Story = StoryObj

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
const DEFAULT_JSON = JSON.stringify(DEFAULT_MESSAGES, null, 2)

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

const PlaygroundHost = defineComponent({
  name: 'A2uiPlaygroundHost',
  setup() {
    const text = ref(DEFAULT_JSON)
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

    return () =>
      h('div', { class: 'flex flex-col gap-4 p-4' }, [
        h('div', { class: 'flex flex-col gap-2' }, [
          h(Textarea, {
            modelValue: text.value,
            'onUpdate:modelValue': (v: string | number) => {
              text.value = String(v)
            },
            wrap: 'off',
            spellcheck: false,
            class: 'h-[360px] w-full resize-y overflow-auto whitespace-pre font-mono text-xs',
          }),
          h('div', { class: 'flex items-center gap-3' }, [
            h(Button, { onClick: run }, () => 'Render'),
            error.value ? h('span', { class: 'text-sm text-destructive' }, error.value) : null,
          ]),
        ]),
        h('div', { class: 'rounded-lg border border-border p-4' }, [
          h(SurfaceOnce, { key: renderKey.value, messages: messages.value }),
        ]),
      ])
  },
})

export const Playground: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => ({ components: { PlaygroundHost }, template: '<PlaygroundHost />' }),
}
