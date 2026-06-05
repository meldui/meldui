import { defineComponent, h, type PropType } from 'vue'
import { CardApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Card, CardContent } from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const MeldCard = defineComponent({
  name: 'MeldCard',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      // `child` is an A2UI ComponentId (a string) resolved in this node's scope.
      const childId = props.p.child as string | undefined
      const basePath = props.context.dataContext.path
      return h(Card, { 'data-a2ui': 'Card' }, () =>
        h(CardContent, { class: 'p-4' }, () =>
          childId ? h(DeferredChild, { surface, id: childId, basePath }) : null,
        ),
      )
    }
  },
})

export const cardEntry = defineVueComponent(CardApi, MeldCard)
