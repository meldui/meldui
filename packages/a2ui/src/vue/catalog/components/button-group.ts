import { defineComponent, h, type PropType } from 'vue'
import { ButtonGroup } from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface ChildRef {
  id: string
  basePath: string
}

const ButtonGroupApi = meldApi('ButtonGroup', {
  children: a2.childList,
  orientation: z.enum(['horizontal', 'vertical']).optional(),
})

const MeldButtonGroup = defineComponent({
  name: 'MeldButtonGroup',
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
      return h(
        ButtonGroup,
        {
          orientation: (props.p.orientation as 'horizontal' | 'vertical') ?? 'horizontal',
          'data-a2ui': 'ButtonGroup',
        },
        () =>
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

export const buttonGroupEntry = defineVueComponent(ButtonGroupApi, MeldButtonGroup)
