import { defineComponent, h, type PropType } from 'vue'
import { RowApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

interface ChildRef {
  id: string
  basePath: string
}

const JUSTIFY: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  spaceBetween: 'justify-between',
  spaceAround: 'justify-around',
  spaceEvenly: 'justify-evenly',
  stretch: 'justify-stretch',
}
const ALIGN: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const MeldRow = defineComponent({
  name: 'MeldRow',
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
      const justify = JUSTIFY[(props.p.justify as string) ?? 'start'] ?? JUSTIFY.start
      const align = ALIGN[(props.p.align as string) ?? 'stretch'] ?? ALIGN.stretch
      return h(
        'div',
        { class: ['flex flex-row flex-wrap gap-2', justify, align], 'data-a2ui': 'Row' },
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

export const rowEntry = defineVueComponent(RowApi, MeldRow)
