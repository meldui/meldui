import { defineComponent, h, type PropType } from 'vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface Item {
  title: string
  child: string
}

const AccordionApi = meldApi('Accordion', {
  items: z.array(z.object({ title: a2.str, child: a2.componentId })),
  type: z.enum(['single', 'multiple']).optional(),
})

const MeldAccordion = defineComponent({
  name: 'MeldAccordion',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      const basePath = props.context.dataContext.path
      const items = (props.p.items as Item[] | undefined) ?? []
      const type = props.p.type === 'multiple' ? 'multiple' : 'single'
      return h(
        Accordion,
        {
          type,
          ...(type === 'single' ? { collapsible: true } : {}),
          class: 'w-full',
          'data-a2ui': 'Accordion',
        },
        () =>
          items.map((it, i) =>
            h(AccordionItem, { key: i, value: String(i) }, () => [
              h(AccordionTrigger, () => it.title),
              h(AccordionContent, () => h(DeferredChild, { surface, id: it.child, basePath })),
            ]),
          ),
      )
    }
  },
})

export const accordionEntry = defineVueComponent(AccordionApi, MeldAccordion)
