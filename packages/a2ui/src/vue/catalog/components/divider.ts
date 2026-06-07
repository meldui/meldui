import { defineComponent, h, type PropType } from 'vue'
import { DividerApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Separator } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const MeldDivider = defineComponent({
  name: 'MeldDivider',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () =>
      h(Separator, {
        orientation: (props.p.axis as 'horizontal' | 'vertical') ?? 'horizontal',
        'data-a2ui': 'Divider',
      })
  },
})

export const dividerEntry = defineVueComponent(DividerApi, MeldDivider)
