/**
 * A2UI Renderer (vertical slice)
 *
 * Demonstrates `@meldui/a2ui/vue` rendering streamed A2UI v0.9 messages into
 * MeldUI components: Text, Markdown (incremental), Column layout, Card, Button
 * (action round-trip), and a data-bound TextField. Other catalog components are
 * added in a follow-up pass.
 */
import { defineComponent, h, onMounted, onUnmounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CATALOG_ID } from '@meldui/a2ui'
import { A2UISurface, type A2uiHandle, provideA2UI } from '@meldui/a2ui/vue'
import '@incremark/theme/styles.css'

const meta: Meta = {
  title: 'A2UI/Renderer',
}
export default meta
type Story = StoryObj

type A2uiMessage = Record<string, unknown>

/** Builds the host component that wires the renderer and feeds it `messages`. */
function makeSurface(
  messages: A2uiMessage[],
  onStreamStart?: (processor: A2uiHandle['processor']) => () => void,
) {
  return defineComponent({
    name: 'A2uiStoryHost',
    setup() {
      const { processor } = provideA2UI({
        onAction: (action) => {
          // Simulate the agent reacting to a client action.
          if (action.name === 'greet') {
            const surface = processor.model.getSurface('s1')
            const name = (action.context?.name as string)?.trim() || 'stranger'
            surface?.dataModel.set('/greeting', `Hello, **${name}**! 👋`)
          }
        },
      })
      let stopStream: (() => void) | undefined
      onMounted(() => {
        processor.processMessages(messages as never)
        stopStream = onStreamStart?.(processor)
      })
      onUnmounted(() => stopStream?.())
      return () => h('div', { class: 'p-6 max-w-xl' }, [h(A2UISurface, { surfaceId: 's1' })])
    },
  })
}

const galleryMessages: A2uiMessage[] = [
  { version: 'v0.9', createSurface: { surfaceId: 's1', catalogId: CATALOG_ID } },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 's1',
      path: '/',
      value: { name: '', greeting: '_Type a name, then press Greet._' },
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 's1',
      components: [
        { id: 'root', component: 'Column', children: ['title', 'intro', 'card'] },
        { id: 'title', component: 'Text', text: 'A2UI → MeldUI', variant: 'h3' },
        {
          id: 'intro',
          component: 'Markdown',
          content:
            'A streamed agent UI, rendered with **MeldUI** components.\n\n- `Text`, `Markdown`, `Column`\n- `Card`, `Button`, `TextField`',
        },
        { id: 'card', component: 'Card', child: 'cardCol' },
        {
          id: 'cardCol',
          component: 'Column',
          children: ['label', 'name', 'greetBtn', 'greetText'],
        },
        { id: 'label', component: 'Text', text: 'Enter your name:', variant: 'caption' },
        { id: 'name', component: 'TextField', label: 'Name', value: { path: '/name' } },
        {
          id: 'greetBtn',
          component: 'Button',
          child: 'greetBtnLabel',
          variant: 'primary',
          action: { event: { name: 'greet', context: { name: { path: '/name' } } } },
        },
        { id: 'greetBtnLabel', component: 'Text', text: 'Greet' },
        { id: 'greetText', component: 'Markdown', content: { path: '/greeting' } },
      ],
    },
  },
]

export const Gallery: Story = {
  render: () => ({
    components: { Host: makeSurface(galleryMessages) },
    template: '<Host />',
  }),
}

const streamMessages: A2uiMessage[] = [
  { version: 'v0.9', createSurface: { surfaceId: 's1', catalogId: CATALOG_ID } },
  { version: 'v0.9', updateDataModel: { surfaceId: 's1', path: '/', value: { content: '' } } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 's1',
      components: [
        { id: 'root', component: 'Column', children: ['heading', 'md'] },
        { id: 'heading', component: 'Text', text: 'Streaming Markdown', variant: 'h4' },
        { id: 'md', component: 'Markdown', content: { path: '/content' } },
      ],
    },
  },
]

const STREAM_TOKENS = [
  '# Streamed\n\n',
  'This markdown arrives ',
  '**token by token**, ',
  'with a `code` span ',
  'and a list:\n\n',
  '- first\n',
  '- second\n',
  '- third\n\n',
  '```ts\nconst x = 1\n',
  '```\n\nDone.',
]

export const StreamingMarkdown: Story = {
  render: () => ({
    components: {
      Host: makeSurface(streamMessages, (processor) => {
        const surface = processor.model.getSurface('s1')
        let acc = ''
        let i = 0
        const timer = setInterval(() => {
          if (i >= STREAM_TOKENS.length) {
            clearInterval(timer)
            return
          }
          acc += STREAM_TOKENS[i++]
          surface?.dataModel.set('/content', acc)
        }, 400)
        return () => clearInterval(timer)
      }),
    },
    template: '<Host />',
  }),
}
