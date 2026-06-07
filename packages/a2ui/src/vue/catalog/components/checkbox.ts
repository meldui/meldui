import { defineComponent, h, type PropType } from 'vue'
import { CheckBoxApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Checkbox } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const MeldCheckBox = defineComponent({
  name: 'MeldCheckBox',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const value = Boolean(props.p.value)
      const label = props.p.label as string | undefined
      const setValue = props.p.setValue as ((v: boolean) => void) | undefined
      return h('label', { class: 'flex items-center gap-2 text-sm', 'data-a2ui': 'CheckBox' }, [
        h(Checkbox, {
          modelValue: value,
          'onUpdate:modelValue': (v: boolean | 'indeterminate') => setValue?.(v === true),
        }),
        label ? h('span', label) : null,
      ])
    }
  },
})

export const checkBoxEntry = defineVueComponent(CheckBoxApi, MeldCheckBox)
