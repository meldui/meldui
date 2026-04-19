<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldMixedChart } from '@meldui/charts-vue'
import type { MeldMixedChartConfig } from '@meldui/charts-vue'

const config: MeldMixedChartConfig = {
  series: [
    { name: 'Revenue', type: 'bar', data: [120, 140, 135, 160, 155, 180, 175] },
    { name: 'Profit Margin %', type: 'line', data: [33, 36, 33, 38, 35, 39, 37] },
  ],
  xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  legend: { position: 'bottom' },
  colors: 'vibrant',
}

const code = `\u003cscript setup lang="ts">
import { MeldMixedChart } from '@meldui/charts-vue'
import type { MeldMixedChartConfig } from '@meldui/charts-vue'

const config: MeldMixedChartConfig = {
  series: [
    { name: 'Revenue', type: 'bar', data: [120, 140, 135, 160, 155, 180, 175] },
    { name: 'Profit Margin %', type: 'line', data: [33, 36, 33, 38, 35, 39, 37] },
  ],
  xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  legend: { position: 'bottom' },
  colors: 'vibrant',
}
\u003c/script>

\u003ctemplate>
  <MeldMixedChart :config="config" title="Revenue & Margin" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldMixedChart :config="config" title="Revenue & Margin" />
    </div>
  </DemoBlock>
</template>
