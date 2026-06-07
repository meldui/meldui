import { defineComponent, h, type PropType } from 'vue'
import { DateTimeInputApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Input } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const MeldDateTimeInput = defineComponent({
  name: 'MeldDateTimeInput',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const label = props.p.label as string | undefined
      const value = (props.p.value as string | undefined) ?? ''
      const enableDate = Boolean(props.p.enableDate)
      const enableTime = Boolean(props.p.enableTime)
      const type = enableDate && enableTime ? 'datetime-local' : enableTime ? 'time' : 'date'
      const setValue = props.p.setValue as ((v: string) => void) | undefined
      return h('div', { class: 'space-y-1', 'data-a2ui': 'DateTimeInput' }, [
        label ? h('label', { class: 'text-sm font-medium' }, label) : null,
        h(Input, {
          type,
          modelValue: value,
          'onUpdate:modelValue': (v: string | number) => setValue?.(String(v)),
        }),
      ])
    }
  },
})

export const dateTimeInputEntry = defineVueComponent(DateTimeInputApi, MeldDateTimeInput)
