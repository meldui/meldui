import { defineComponent, h, type PropType } from 'vue'
import { ButtonApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Button } from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

// A2UI variant → MeldUI Button variant.
const VARIANT: Record<string, 'default' | 'secondary' | 'ghost'> = {
  primary: 'default',
  default: 'secondary',
  borderless: 'ghost',
}

const MeldButton = defineComponent({
  name: 'MeldButton',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      const childId = props.p.child as string | undefined
      const basePath = props.context.dataContext.path
      const variant = VARIANT[(props.p.variant as string) ?? 'default'] ?? 'secondary'
      // `action` is resolved by the binder into a ready-to-call closure that
      // dispatches the A2UI client action through the surface.
      const action = props.p.action as (() => void) | undefined
      return h(Button, { variant, 'data-a2ui': 'Button', onClick: () => action?.() }, () =>
        childId ? h(DeferredChild, { surface, id: childId, basePath }) : null,
      )
    }
  },
})

export const buttonEntry = defineVueComponent(ButtonApi, MeldButton)
