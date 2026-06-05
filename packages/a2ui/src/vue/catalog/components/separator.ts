import { defineComponent, h, type PropType } from 'vue'
import { Separator } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

const SeparatorApi = meldApi('Separator', {
  axis: z.enum(['horizontal', 'vertical']).optional(),
  label: a2.str.optional(),
})

const MeldSeparator = defineComponent({
  name: 'MeldSeparator',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const orientation = (props.p.axis as 'horizontal' | 'vertical') ?? 'horizontal'
      const label = props.p.label as string | undefined
      if (label && orientation === 'horizontal') {
        return h('div', { class: 'flex items-center gap-2', 'data-a2ui': 'Separator' }, [
          h(Separator, { class: 'flex-1' }),
          h('span', { class: 'shrink-0 text-xs text-muted-foreground' }, label),
          h(Separator, { class: 'flex-1' }),
        ])
      }
      return h(Separator, { orientation, 'data-a2ui': 'Separator' })
    }
  },
})

export const separatorEntry = defineVueComponent(SeparatorApi, MeldSeparator)
