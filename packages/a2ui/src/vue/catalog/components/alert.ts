import { defineComponent, h, type PropType } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

type AlertVariant = 'info' | 'success' | 'warning' | 'destructive'

const AlertApi = meldApi('Alert', {
  title: a2.str.optional(),
  description: a2.str.optional(),
  variant: z.enum(['info', 'success', 'warning', 'destructive']).optional(),
})

const MeldAlert = defineComponent({
  name: 'MeldAlert',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const variant = ((props.p.variant as AlertVariant) ?? 'info') satisfies AlertVariant
      const title = props.p.title as string | undefined
      const description = props.p.description as string | undefined
      return h(Alert, { variant, 'data-a2ui': 'Alert' }, () => [
        title ? h(AlertTitle, () => title) : null,
        description ? h(AlertDescription, () => description) : null,
      ])
    }
  },
})

export const alertEntry = defineVueComponent(AlertApi, MeldAlert)
