<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldLineChart } from '@meldui/charts-vue'
import type { MeldLineChartConfig } from '@meldui/charts-vue'

const config: MeldLineChartConfig = {
  series: [
    { name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] },
    { name: 'Expenses', data: [20, 30, 35, 40, 39, 50, 60] },
  ],
  xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  stroke: { curve: 'smooth', width: 3 },
  legend: { position: 'bottom' },
}

const code = `\u003cscript setup lang="ts">
import { MeldLineChart } from '@meldui/charts-vue'
import type { MeldLineChartConfig } from '@meldui/charts-vue'

const config: MeldLineChartConfig = {
  series: [
    { name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] },
    { name: 'Expenses', data: [20, 30, 35, 40, 39, 50, 60] },
  ],
  xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  stroke: { curve: 'smooth', width: 3 },
  legend: { position: 'bottom' },
}
\u003c/script>

\u003ctemplate>
  <MeldLineChart :config="config" title="Weekly Performance" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldLineChart :config="config" title="Weekly Performance" />
    </div>
  </DemoBlock>
</template>
