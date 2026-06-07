import { defineComponent, h, type PropType } from 'vue'
import { z } from 'zod'
import { DynamicStringSchema } from '@a2ui/web_core/v0_9'
import { IncremarkContent, ThemeProvider } from '@incremark/vue'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

/**
 * MeldUI-specific catalog component. Renders Markdown via `@incremark/vue`,
 * which tolerates incomplete/streamed Markdown (unterminated emphasis, half
 * code fences) — the primary path for streamed agent text.
 *
 * Consumers must import the incremark theme styles once:
 * `import '@incremark/theme/styles.css'`.
 */
export const MarkdownApi = {
  name: 'Markdown',
  schema: z.object({ content: DynamicStringSchema }),
}

const MeldMarkdown = defineComponent({
  name: 'MeldMarkdown',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    const options = { gfm: true }
    return () =>
      h('div', { class: 'incremark-root text-sm', 'data-a2ui': 'Markdown' }, [
        h(ThemeProvider, { theme: 'default' }, () => [
          h(IncremarkContent, {
            content: (props.p.content as string) ?? '',
            isFinished: true,
            incremarkOptions: options,
          }),
        ]),
      ])
  },
})

export const markdownEntry = defineVueComponent(MarkdownApi, MeldMarkdown)
