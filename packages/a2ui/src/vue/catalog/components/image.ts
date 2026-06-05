import { defineComponent, h, type PropType } from 'vue'
import { ImageApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const FIT: Record<string, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  scaleDown: 'object-scale-down',
}
const VARIANT: Record<string, string> = {
  icon: 'size-8',
  avatar: 'size-10 rounded-full',
  smallFeature: 'max-w-32',
  mediumFeature: 'max-w-sm',
  largeFeature: 'max-w-lg',
  header: 'w-full',
}

const MeldImage = defineComponent({
  name: 'MeldImage',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () =>
      h('img', {
        src: props.p.url as string,
        alt: (props.p.description as string) ?? '',
        class: [
          'rounded-md',
          FIT[(props.p.fit as string) ?? 'fill'] ?? FIT.fill,
          VARIANT[(props.p.variant as string) ?? 'mediumFeature'] ?? VARIANT.mediumFeature,
        ],
        'data-a2ui': 'Image',
      })
  },
})

export const imageEntry = defineVueComponent(ImageApi, MeldImage)
