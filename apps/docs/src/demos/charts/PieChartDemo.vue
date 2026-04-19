<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldPieChart } from '@meldui/charts-vue'
import type { MeldPieChartConfig } from '@meldui/charts-vue'

const config: MeldPieChartConfig = {
  series: [
    { name: 'Chrome', data: [65.52] },
    { name: 'Safari', data: [18.33] },
    { name: 'Edge', data: [5.21] },
    { name: 'Firefox', data: [3.19] },
    { name: 'Other', data: [7.75] },
  ],
  showLabels: false,
  colors: 'vibrant',
}

const code = `\u003cscript setup lang="ts">
import { MeldPieChart } from '@meldui/charts-vue'
import type { MeldPieChartConfig } from '@meldui/charts-vue'

const config: MeldPieChartConfig = {
  series: [
    { name: 'Chrome', data: [65.52] },
    { name: 'Safari', data: [18.33] },
    { name: 'Edge', data: [5.21] },
    { name: 'Firefox', data: [3.19] },
    { name: 'Other', data: [7.75] },
  ],
  showLabels: false,
  colors: 'vibrant',
}
\u003c/script>

\u003ctemplate>
  <MeldPieChart :config="config" title="Browser Market Share" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldPieChart :config="config" title="Browser Market Share" />
    </div>
  </DemoBlock>
</template>
