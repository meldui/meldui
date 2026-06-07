import { defineComponent, h, type PropType } from 'vue'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface Option {
  label: string
  value: string
}

const ComboboxApi = meldApi('Combobox', {
  label: a2.str.optional(),
  placeholder: a2.str.optional(),
  options: z.array(z.object({ label: a2.str, value: z.string() })),
  value: a2.str,
})

const MeldCombobox = defineComponent({
  name: 'MeldCombobox',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const label = props.p.label as string | undefined
      const placeholder = (props.p.placeholder as string | undefined) ?? 'Select…'
      const options = (props.p.options as Option[] | undefined) ?? []
      const value = (props.p.value as string | undefined) ?? ''
      const setValue = props.p.setValue as ((v: string) => void) | undefined
      return h('div', { class: 'space-y-1', 'data-a2ui': 'Combobox' }, [
        label ? h('label', { class: 'text-sm font-medium' }, label) : null,
        h(
          Combobox,
          {
            modelValue: value,
            'onUpdate:modelValue': (v: unknown) => setValue?.(typeof v === 'string' ? v : ''),
          },
          () => [
            h(ComboboxAnchor, () => h(ComboboxInput, { placeholder })),
            h(ComboboxList, () => [
              h(ComboboxEmpty, () => 'No results.'),
              ...options.map((opt) =>
                h(ComboboxItem, { key: opt.value, value: opt.value }, () => [
                  opt.label,
                  h(ComboboxItemIndicator),
                ]),
              ),
            ]),
          ],
        ),
      ])
    }
  },
})

export const comboboxEntry = defineVueComponent(ComboboxApi, MeldCombobox)
