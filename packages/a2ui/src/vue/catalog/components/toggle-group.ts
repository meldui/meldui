import { defineComponent, h, type PropType } from 'vue'
import { ToggleGroup, ToggleGroupItem } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface Option {
  label: string
  value: string
}

const ToggleGroupApi = meldApi('ToggleGroup', {
  options: z.array(z.object({ label: a2.str, value: z.string() })),
  value: a2.strList,
  variant: z.enum(['single', 'multiple']).optional(),
})

const MeldToggleGroup = defineComponent({
  name: 'MeldToggleGroup',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const options = (props.p.options as Option[] | undefined) ?? []
      const selected = (props.p.value as string[] | undefined) ?? []
      const setValue = props.p.setValue as ((v: string[]) => void) | undefined
      const type = props.p.variant === 'multiple' ? 'multiple' : 'single'
      const modelValue = type === 'multiple' ? selected : (selected[0] ?? '')
      return h(
        ToggleGroup,
        {
          type,
          variant: 'outline',
          modelValue,
          'data-a2ui': 'ToggleGroup',
          'onUpdate:modelValue': (v: unknown) => {
            const next = Array.isArray(v)
              ? v.filter((x): x is string => typeof x === 'string')
              : typeof v === 'string'
                ? [v]
                : []
            setValue?.(next)
          },
        },
        () =>
          options.map((opt) =>
            h(ToggleGroupItem, { key: opt.value, value: opt.value }, () => opt.label),
          ),
      )
    }
  },
})

export const toggleGroupEntry = defineVueComponent(ToggleGroupApi, MeldToggleGroup)
