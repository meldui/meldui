import { defineComponent, h, type PropType } from 'vue'
import { MultiSelect } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface Option {
  label: string
  value: string
}

const MultiSelectApi = meldApi('MultiSelect', {
  label: a2.str.optional(),
  placeholder: a2.str.optional(),
  options: z.array(z.object({ label: a2.str, value: z.string() })),
  value: a2.strList,
  maxSelected: a2.num.optional(),
})

const MeldMultiSelect = defineComponent({
  name: 'MeldMultiSelect',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const label = props.p.label as string | undefined
      const placeholder = props.p.placeholder as string | undefined
      const options = (props.p.options as Option[] | undefined) ?? []
      const selected = (props.p.value as string[] | undefined) ?? []
      const setValue = props.p.setValue as ((v: string[]) => void) | undefined
      return h('div', { class: 'space-y-1', 'data-a2ui': 'MultiSelect' }, [
        label ? h('label', { class: 'text-sm font-medium' }, label) : null,
        h(MultiSelect, {
          modelValue: selected,
          options,
          placeholder,
          'onUpdate:modelValue': (v: string[]) => setValue?.(v),
        }),
      ])
    }
  },
})

export const multiSelectEntry = defineVueComponent(MultiSelectApi, MeldMultiSelect)
