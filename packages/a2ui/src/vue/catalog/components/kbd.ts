import { defineComponent, h, type PropType } from 'vue'
import { Kbd, KbdGroup } from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi } from '../schemas'
import type { A2uiRenderProps } from '../../types'

const KbdApi = meldApi('Kbd', { keys: a2.strList })

const MeldKbd = defineComponent({
  name: 'MeldKbd',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const keys = (props.p.keys as string[] | undefined) ?? []
      return h(KbdGroup, { 'data-a2ui': 'Kbd' }, () =>
        keys.map((key, i) => h(Kbd, { key: i }, () => key)),
      )
    }
  },
})

export const kbdEntry = defineVueComponent(KbdApi, MeldKbd)
