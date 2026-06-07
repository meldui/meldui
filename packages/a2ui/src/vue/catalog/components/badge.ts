import { defineComponent, h, type PropType } from 'vue'
import { Badge } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

const BadgeApi = meldApi('Badge', {
  label: a2.str,
  variant: z
    .enum(['default', 'secondary', 'destructive', 'success', 'warning', 'info', 'neutral'])
    .optional(),
})

const MeldBadge = defineComponent({
  name: 'MeldBadge',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () =>
      h(
        Badge,
        { variant: (props.p.variant as BadgeVariant) ?? 'default', 'data-a2ui': 'Badge' },
        () => (props.p.label as string) ?? '',
      )
  },
})

export const badgeEntry = defineVueComponent(BadgeApi, MeldBadge)
