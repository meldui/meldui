import { defineComponent, h, type Component, type PropType } from 'vue'
import {
  MeldAreaChart,
  MeldBarChart,
  MeldLineChart,
  MeldPieChart,
  MeldScatterChart,
} from '@meldui/charts-vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

const COMP: Record<string, Component> = {
  line: MeldLineChart,
  bar: MeldBarChart,
  area: MeldAreaChart,
  pie: MeldPieChart,
  scatter: MeldScatterChart,
}

const ChartApi = meldApi('Chart', {
  chartType: z.enum(['line', 'bar', 'area', 'pie', 'scatter']),
  data: a2.dataBinding,
  title: a2.str.optional(),
})

const MeldChart = defineComponent({
  name: 'MeldChart',
  props: {
    p: { type: Object as PropType<A2uiRenderProps['p']>, required: true },
    context: { type: Object as PropType<A2uiRenderProps['context']>, required: true },
  },
  setup(props) {
    return () => {
      const chartType = (props.p.chartType as string) ?? 'line'
      // `data` is a DataBinding to a chart config ({ series, xAxis, ... });
      // resolve defensively against the raw binding.
      let config = props.p.data as Record<string, unknown> | undefined
      if (!config || !('series' in config)) {
        config = props.context.dataContext.resolveDynamicValue(props.p.data as never) as Record<
          string,
          unknown
        >
      }
      const title = props.p.title as string | undefined
      const ChartComponent = COMP[chartType] ?? MeldLineChart
      const hasData = config && Array.isArray((config as { series?: unknown }).series)
      return h('div', { class: 'w-full', 'data-a2ui': 'Chart' }, [
        hasData ? h(ChartComponent, { config, title }) : null,
      ])
    }
  },
})

export const chartEntry = defineVueComponent(ChartApi, MeldChart)
