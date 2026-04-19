<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldScatterChart } from '@meldui/charts-vue'
import type { MeldScatterChartConfig } from '@meldui/charts-vue'

const config: MeldScatterChartConfig = {
  series: [
    {
      name: 'Product A',
      data: Array.from({ length: 15 }, () => ({ x: Math.round(Math.random() * 200 + 50), y: Math.round(Math.random() * 150 + 30) })),
    },
    {
      name: 'Product B',
      data: Array.from({ length: 15 }, () => ({ x: Math.round(Math.random() * 200 + 100), y: Math.round(Math.random() * 150 + 60) })),
    },
  ],
  xAxis: { type: 'numeric', title: 'Marketing Spend ($K)' },
  yAxis: { type: 'numeric', title: 'Revenue ($K)' },
  legend: { position: 'bottom' },
  colors: 'corporate',
}

const code = `\u003cscript setup lang="ts">
import { MeldScatterChart } from '@meldui/charts-vue'
import type { MeldScatterChartConfig } from '@meldui/charts-vue'

const config: MeldScatterChartConfig = {
  series: [
    {
      name: 'Product A',
      data: [
        { x: 100, y: 50 }, { x: 150, y: 75 }, { x: 200, y: 100 },
        { x: 250, y: 125 }, { x: 300, y: 150 },
      ],
    },
    {
      name: 'Product B',
      data: [
        { x: 120, y: 60 }, { x: 170, y: 85 }, { x: 220, y: 110 },
        { x: 270, y: 135 }, { x: 320, y: 160 },
      ],
    },
  ],
  xAxis: { type: 'numeric', title: 'Marketing Spend ($K)' },
  yAxis: { type: 'numeric', title: 'Revenue ($K)' },
  colors: 'corporate',
}
\u003c/script>

\u003ctemplate>
  <MeldScatterChart :config="config" title="Spend vs Revenue" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldScatterChart :config="config" title="Spend vs Revenue" />
    </div>
  </DemoBlock>
</template>
