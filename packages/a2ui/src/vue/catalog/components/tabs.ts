import { defineComponent, h, type PropType } from 'vue'
import { TabsApi } from '@a2ui/web_core/v0_9/basic_catalog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@meldui/vue'
import { DeferredChild } from '../../DeferredChild'
import { defineVueComponent } from '../../define'
import type { A2uiRenderProps } from '../../types'

interface TabItem {
  title: string
  child: string
}

const MeldTabs = defineComponent({
  name: 'MeldTabs',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const surface = props.context.dataContext.surface
      const basePath = props.context.dataContext.path
      const tabs = (props.p.tabs as TabItem[] | undefined) ?? []
      return h(Tabs, { defaultValue: '0', class: 'w-full', 'data-a2ui': 'Tabs' }, () => [
        h(TabsList, () =>
          tabs.map((t, i) => h(TabsTrigger, { key: i, value: String(i) }, () => t.title)),
        ),
        ...tabs.map((t, i) =>
          h(TabsContent, { key: i, value: String(i) }, () =>
            h(DeferredChild, { surface, id: t.child, basePath }),
          ),
        ),
      ])
    }
  },
})

export const tabsEntry = defineVueComponent(TabsApi, MeldTabs)
