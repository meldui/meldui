import { defineComponent, h, type PropType } from 'vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

const SidebarApi = meldApi('Sidebar', {
  content: a2.componentId,
  header: a2.componentId.optional(),
  footer: a2.componentId.optional(),
  side: z.enum(['left', 'right']).optional(),
})

/**
 * App-like layout shell: a side panel (header/footer) beside a main content
 * area. Rendered as a lightweight flex layout (the full MeldUI Sidebar
 * provider targets whole-app shells, which is heavier than an A2UI surface
 * needs).
 */
const MeldSidebar = defineComponent({
  name: 'MeldSidebar',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      const basePath = props.context.dataContext.path
      const content = props.p.content as string | undefined
      const header = props.p.header as string | undefined
      const footer = props.p.footer as string | undefined
      const side = (props.p.side as 'left' | 'right') ?? 'left'

      const panel = h(
        'aside',
        { class: 'flex w-48 shrink-0 flex-col gap-2 border-r bg-muted/30 p-3' },
        [
          header ? h(DeferredChild, { surface, id: header, basePath }) : null,
          h('div', { class: 'flex-1' }),
          footer ? h(DeferredChild, { surface, id: footer, basePath }) : null,
        ],
      )
      const main = h('main', { class: 'flex-1 p-4' }, [
        content ? h(DeferredChild, { surface, id: content, basePath }) : null,
      ])

      return h(
        'div',
        {
          class: [
            'flex min-h-40 overflow-hidden rounded-md border',
            side === 'right' ? 'flex-row-reverse' : '',
          ],
          'data-a2ui': 'Sidebar',
        },
        [panel, main],
      )
    }
  },
})

export const sidebarEntry = defineVueComponent(SidebarApi, MeldSidebar)
