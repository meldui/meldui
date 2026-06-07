import { defineComponent, h, type PropType } from 'vue'
import { ChoicePickerApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Checkbox, RadioGroup, RadioGroupItem } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

interface Option {
  label: string
  value: string
}

const MeldChoicePicker = defineComponent({
  name: 'MeldChoicePicker',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const label = props.p.label as string | undefined
      const options = (props.p.options as Option[] | undefined) ?? []
      const selected = (props.p.value as string[] | undefined) ?? []
      const setValue = props.p.setValue as ((v: string[]) => void) | undefined
      const multiple = props.p.variant === 'multipleSelection'

      const header = label ? h('div', { class: 'text-sm font-medium' }, label) : null

      if (multiple) {
        return h('div', { class: 'space-y-2', 'data-a2ui': 'ChoicePicker' }, [
          header,
          ...options.map((opt) =>
            h('label', { key: opt.value, class: 'flex items-center gap-2 text-sm' }, [
              h(Checkbox, {
                modelValue: selected.includes(opt.value),
                'onUpdate:modelValue': (v: boolean | 'indeterminate') => {
                  const next =
                    v === true ? [...selected, opt.value] : selected.filter((s) => s !== opt.value)
                  setValue?.(next)
                },
              }),
              h('span', opt.label),
            ]),
          ),
        ])
      }

      return h('div', { class: 'space-y-2', 'data-a2ui': 'ChoicePicker' }, [
        header,
        h(
          RadioGroup,
          {
            modelValue: selected[0] ?? '',
            'onUpdate:modelValue': (v: unknown) => setValue?.(typeof v === 'string' ? [v] : []),
          },
          () =>
            options.map((opt) =>
              h('label', { key: opt.value, class: 'flex items-center gap-2 text-sm' }, [
                h(RadioGroupItem, { value: opt.value }),
                h('span', opt.label),
              ]),
            ),
        ),
      ])
    }
  },
})

export const choicePickerEntry = defineVueComponent(ChoicePickerApi, MeldChoicePicker)
