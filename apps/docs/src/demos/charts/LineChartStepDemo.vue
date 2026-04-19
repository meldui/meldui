<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldLineChart } from '@meldui/charts-vue'
import type { MeldLineChartConfig } from '@meldui/charts-vue'

const config: MeldLineChartConfig = {
  series: [
    { name: 'Deployments', data: [2, 2, 5, 5, 3, 3, 8] },
  ],
  xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  stroke: { curve: 'stepline', width: 2 },
  colors: 'ocean',
}

const code = `\u003ctemplate>
  <MeldLineChart
    :config="{
      series: [{ name: 'Deployments', data: [2, 2, 5, 5, 3, 3, 8] }],
      xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      stroke: { curve: 'stepline', width: 2 },
      colors: 'ocean',
    }"
    title="Step Line"
  />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldLineChart :config="config" title="Step Line" />
    </div>
  </DemoBlock>
</template>
