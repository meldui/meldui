import { defineComponent, h, type PropType } from 'vue'
import { ScrollArea } from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

const ScrollAreaApi = meldApi('ScrollArea', {
  child: a2.componentId,
  maxHeight: z.string().optional(),
  orientation: z.enum(['vertical', 'horizontal', 'both']).optional(),
})

const MeldScrollArea = defineComponent({
  name: 'MeldScrollArea',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      const basePath = props.context.dataContext.path
      const childId = props.p.child as string | undefined
      const maxHeight = props.p.maxHeight as string | undefined
      return h(
        ScrollArea,
        {
          // reka's ScrollArea scrolls only with a definite height on the root
          // (its viewport is size-full); map the A2UI `maxHeight` to a height.
          class: 'rounded-md border p-3',
          style: maxHeight ? { height: maxHeight } : undefined,
          'data-a2ui': 'ScrollArea',
        },
        () => (childId ? h(DeferredChild, { surface, id: childId, basePath }) : null),
      )
    }
  },
})

export const scrollAreaEntry = defineVueComponent(ScrollAreaApi, MeldScrollArea)
