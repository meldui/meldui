<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldDonutChart } from '@meldui/charts-vue'
import type { MeldDonutChartConfig } from '@meldui/charts-vue'

const config: MeldDonutChartConfig = {
  series: [
    { name: 'North America', data: [42.5] },
    { name: 'Europe', data: [28.3] },
    { name: 'Asia Pacific', data: [19.8] },
    { name: 'Latin America', data: [6.2] },
    { name: 'Other', data: [3.2] },
  ],
  showLabels: false,
  colors: 'corporate',
}

const code = `\u003cscript setup lang="ts">
import { MeldDonutChart } from '@meldui/charts-vue'
import type { MeldDonutChartConfig } from '@meldui/charts-vue'

const config: MeldDonutChartConfig = {
  series: [
    { name: 'North America', data: [42.5] },
    { name: 'Europe', data: [28.3] },
    { name: 'Asia Pacific', data: [19.8] },
    { name: 'Latin America', data: [6.2] },
    { name: 'Other', data: [3.2] },
  ],
  showLabels: false,
  colors: 'corporate',
}
\u003c/script>

\u003ctemplate>
  <MeldDonutChart :config="config" title="Revenue by Region" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldDonutChart :config="config" title="Revenue by Region" />
    </div>
  </DemoBlock>
</template>
