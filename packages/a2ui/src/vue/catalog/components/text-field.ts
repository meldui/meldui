import { defineComponent, h, type PropType } from 'vue'
import { TextFieldApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Field, FieldLabel, Input, Textarea } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const INPUT_TYPE: Record<string, string> = {
  shortText: 'text',
  number: 'number',
  obscured: 'password',
}

const MeldTextField = defineComponent({
  name: 'MeldTextField',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const p = props.p
      const variant = (p.variant as string) ?? 'shortText'
      const value = (p.value as string) ?? ''
      // `setValue` is a binder-generated setter that writes back to the data model.
      const setValue = p.setValue as ((v: string) => void) | undefined
      const control =
        variant === 'longText'
          ? h(Textarea, {
              modelValue: value,
              'onUpdate:modelValue': (v: string | number) => setValue?.(String(v)),
            })
          : h(Input, {
              type: INPUT_TYPE[variant] ?? 'text',
              modelValue: value,
              'onUpdate:modelValue': (v: string | number) => setValue?.(String(v)),
            })
      return h(Field, { 'data-a2ui': 'TextField' }, () => [
        p.label ? h(FieldLabel, () => p.label as string) : null,
        control,
      ])
    }
  },
})

export const textFieldEntry = defineVueComponent(TextFieldApi, MeldTextField)
