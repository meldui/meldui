<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldAreaChart } from '@meldui/charts-vue'
import type { MeldAreaChartConfig } from '@meldui/charts-vue'

const config: MeldAreaChartConfig = {
  series: [
    { name: 'Organic', data: [120, 132, 151, 134, 190, 230, 210] },
    { name: 'Direct', data: [85, 91, 94, 99, 103, 109, 115] },
    { name: 'Social', data: [40, 45, 52, 48, 61, 75, 81] },
  ],
  xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  stacked: true,
  stroke: { curve: 'smooth', width: 2 },
  legend: { position: 'bottom' },
}

const code = `\u003cscript setup lang="ts">
import { MeldAreaChart } from '@meldui/charts-vue'
import type { MeldAreaChartConfig } from '@meldui/charts-vue'

const config: MeldAreaChartConfig = {
  series: [
    { name: 'Organic', data: [120, 132, 151, 134, 190, 230, 210] },
    { name: 'Direct', data: [85, 91, 94, 99, 103, 109, 115] },
    { name: 'Social', data: [40, 45, 52, 48, 61, 75, 81] },
  ],
  xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  stacked: true,
  stroke: { curve: 'smooth', width: 2 },
  legend: { position: 'bottom' },
}
\u003c/script>

\u003ctemplate>
  <MeldAreaChart :config="config" title="Traffic Sources" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldAreaChart :config="config" title="Traffic Sources" />
    </div>
  </DemoBlock>
</template>
