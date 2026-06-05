import { defineComponent, h, type PropType } from 'vue'
import { ListApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

interface ChildRef {
  id: string
  basePath: string
}

const ALIGN: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const MeldList = defineComponent({
  name: 'MeldList',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      const basePath = props.context.dataContext.path
      const raw = (props.p.children as Array<string | ChildRef> | undefined) ?? []
      const children: ChildRef[] = raw.map((c) => (typeof c === 'string' ? { id: c, basePath } : c))
      const direction = props.p.direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
      const align = ALIGN[(props.p.align as string) ?? 'stretch'] ?? ALIGN.stretch
      return h(
        'div',
        { class: ['flex gap-2', direction, align], 'data-a2ui': 'List' },
        children.map((c) =>
          h(DeferredChild, {
            key: `${c.id}@${c.basePath}`,
            surface,
            id: c.id,
            basePath: c.basePath,
          }),
        ),
      )
    }
  },
})

export const listEntry = defineVueComponent(ListApi, MeldList)
