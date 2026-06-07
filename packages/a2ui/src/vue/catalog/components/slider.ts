import { defineComponent, h, type PropType } from 'vue'
import { SliderApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Slider } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const MeldSlider = defineComponent({
  name: 'MeldSlider',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const label = props.p.label as string | undefined
      const value = Number(props.p.value ?? 0)
      const min = (props.p.min as number | undefined) ?? 0
      const max = props.p.max as number | undefined
      const setValue = props.p.setValue as ((v: number) => void) | undefined
      return h('div', { class: 'space-y-2', 'data-a2ui': 'Slider' }, [
        label ? h('label', { class: 'text-sm font-medium' }, label) : null,
        h(Slider, {
          modelValue: [value],
          min,
          max,
          'onUpdate:modelValue': (v: number[] | undefined) => {
            if (Array.isArray(v) && v.length > 0) setValue?.(v[0])
          },
        }),
      ])
    }
  },
})

export const sliderEntry = defineVueComponent(SliderApi, MeldSlider)
