import { defineComponent, h, type PropType } from 'vue'
import { ModalApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Dialog, DialogContent, DialogTrigger } from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const MeldModal = defineComponent({
  name: 'MeldModal',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      const basePath = props.context.dataContext.path
      const trigger = props.p.trigger as string | undefined
      const content = props.p.content as string | undefined
      return h(Dialog, { 'data-a2ui': 'Modal' }, () => [
        trigger
          ? h(DialogTrigger, { asChild: true }, () =>
              h(DeferredChild, { surface, id: trigger, basePath }),
            )
          : null,
        h(DialogContent, () =>
          content ? h(DeferredChild, { surface, id: content, basePath }) : null,
        ),
      ])
    }
  },
})

export const modalEntry = defineVueComponent(ModalApi, MeldModal)
