import { type Component, defineComponent, h, onMounted, onUnmounted } from 'vue'
import { type A2uiExampleMessage, examples } from '@meldui/a2ui'
import { A2UISurface, type A2uiHandle, provideA2UI } from '@meldui/a2ui/vue'
import '@incremark/theme/styles.css'

/** One collapsible code block explaining part of a story's implementation. */
export interface CodeSection {
  title: string
  code: string
}

/**
 * Wraps a live host component with one or more collapsible code sections that
 * explain how the story is implemented (A2UI messages, theming CSS/vars,
 * streaming/action logic). Mirrors the per-component `<details>` code block so
 * the composed Renderer/Theming stories are documented the same way.
 */
export function liveWithCode(Host: Component, sections: CodeSection[]) {
  const Wrapped = defineComponent({
    name: 'A2uiLiveWithCode',
    setup() {
      return () =>
        h('div', { class: 'flex flex-col gap-3 p-4' }, [
          h(Host),
          ...sections.map((s) =>
            h('details', { class: 'rounded-lg border border-border bg-muted/30' }, [
              h(
                'summary',
                { class: 'cursor-pointer px-3 py-2 text-sm text-muted-foreground' },
                s.title,
              ),
              h('pre', { class: 'overflow-auto px-3 pb-3 text-xs' }, h('code', null, s.code)),
            ]),
          ),
        ])
    },
  })
  return {
    render: () => ({ components: { Wrapped }, template: '<Wrapped />' }),
    parameters: {
      docs: {
        source: {
          code: sections.map((s) => `// ${s.title}\n${s.code}`).join('\n\n'),
          language: 'ts',
        },
      },
    },
  }
}

export interface A2uiStoryOptions {
  onAction?: Parameters<typeof provideA2UI>[0] extends { onAction?: infer F } ? F : never
  onStreamStart?: (processor: A2uiHandle['processor']) => () => void
}

/**
 * Builds a Storybook story that renders an A2UI message sequence with the
 * MeldUI renderer AND shows the exact messages as a code block — so each
 * component is documented with a live render + its source. Used per component.
 */
export function a2uiStory(messages: A2uiExampleMessage[], options: A2uiStoryOptions = {}) {
  const Host = defineComponent({
    name: 'A2uiStoryHost',
    setup() {
      const { processor } = provideA2UI({ onAction: options.onAction })
      let stop: (() => void) | undefined
      onMounted(() => {
        processor.processMessages(messages as never)
        stop = options.onStreamStart?.(processor)
      })
      onUnmounted(() => stop?.())
      const code = JSON.stringify(messages, null, 2)
      return () =>
        h('div', { class: 'flex flex-col gap-3 p-4 max-w-2xl' }, [
          h('div', { class: 'rounded-lg border border-border p-4' }, [
            h(A2UISurface, { surfaceId: 's1' }),
          ]),
          h('details', { class: 'rounded-lg border border-border bg-muted/30' }, [
            h(
              'summary',
              { class: 'cursor-pointer px-3 py-2 text-sm text-muted-foreground' },
              'A2UI messages',
            ),
            h('pre', { class: 'overflow-auto px-3 pb-3 text-xs' }, h('code', null, code)),
          ]),
        ])
    },
  })
  return {
    render: () => ({ components: { Host }, template: '<Host />' }),
    parameters: { docs: { source: { code: JSON.stringify(messages, null, 2), language: 'json' } } },
  }
}

/** Convenience: build a story straight from the named example. */
export function exampleStory(component: string, options?: A2uiStoryOptions) {
  return a2uiStory(examples[component] ?? [], options)
}
