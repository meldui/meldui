<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldBarChart } from '@meldui/charts-vue'
import type { MeldBarChartConfig } from '@meldui/charts-vue'

const config: MeldBarChartConfig = {
  series: [
    { name: 'Desktop', data: [44, 55, 57, 56, 61, 58, 63] },
    { name: 'Mobile', data: [76, 85, 101, 98, 87, 105, 91] },
  ],
  xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  legend: { position: 'bottom' },
}

const code = `\u003cscript setup lang="ts">
import { MeldBarChart } from '@meldui/charts-vue'
import type { MeldBarChartConfig } from '@meldui/charts-vue'

const config: MeldBarChartConfig = {
  series: [
    { name: 'Desktop', data: [44, 55, 57, 56, 61, 58, 63] },
    { name: 'Mobile', data: [76, 85, 101, 98, 87, 105, 91] },
  ],
  xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  legend: { position: 'bottom' },
}
\u003c/script>

\u003ctemplate>
  <MeldBarChart :config="config" title="Traffic by Device" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldBarChart :config="config" title="Traffic by Device" />
    </div>
  </DemoBlock>
</template>
