import { defineComponent, h, type PropType } from 'vue'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface ChildRef {
  id: string
  basePath: string
}

const CarouselApi = meldApi('Carousel', {
  children: a2.childList,
  orientation: z.enum(['horizontal', 'vertical']).optional(),
  loop: z.boolean().optional(),
})

const MeldCarousel = defineComponent({
  name: 'MeldCarousel',
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
      const orientation = (props.p.orientation as 'horizontal' | 'vertical') ?? 'horizontal'
      return h(
        Carousel,
        {
          orientation,
          opts: { loop: Boolean(props.p.loop) },
          class: 'w-full max-w-xs',
          'data-a2ui': 'Carousel',
        },
        () => [
          h(CarouselContent, () =>
            children.map((c) =>
              h(CarouselItem, { key: `${c.id}@${c.basePath}` }, () =>
                h(DeferredChild, { surface, id: c.id, basePath: c.basePath }),
              ),
            ),
          ),
          h(CarouselPrevious),
          h(CarouselNext),
        ],
      )
    }
  },
})

export const carouselEntry = defineVueComponent(CarouselApi, MeldCarousel)
