import { defineComponent, h, type PropType } from 'vue'
import { TextApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

const TAG: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  caption: 'p',
  body: 'p',
}

const CLASS: Record<string, string> = {
  h1: 'scroll-m-20 text-3xl font-bold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold tracking-tight',
  h4: 'text-lg font-semibold',
  h5: 'text-base font-semibold',
  caption: 'text-sm text-muted-foreground',
  body: 'text-sm leading-relaxed',
}

const MeldText = defineComponent({
  name: 'MeldText',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const variant = (props.p.variant as string) ?? 'body'
      return h(
        TAG[variant] ?? 'p',
        { class: CLASS[variant] ?? CLASS.body },
        (props.p.text as string) ?? '',
      )
    }
  },
})

export const textEntry = defineVueComponent(TextApi, MeldText)
