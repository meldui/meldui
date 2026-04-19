<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldBarChart } from '@meldui/charts-vue'
import type { MeldBarChartConfig } from '@meldui/charts-vue'

const config: MeldBarChartConfig = {
  series: [
    { name: 'Q1', data: [44, 55, 41, 67, 22] },
    { name: 'Q2', data: [13, 23, 20, 8, 13] },
    { name: 'Q3', data: [11, 17, 15, 15, 21] },
  ],
  xAxis: { categories: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'] },
  stacked: true,
  horizontal: true,
  legend: { position: 'bottom' },
  colors: 'vibrant',
}

const code = `\u003ctemplate>
  <MeldBarChart
    :config="{
      series: [
        { name: 'Q1', data: [44, 55, 41, 67, 22] },
        { name: 'Q2', data: [13, 23, 20, 8, 13] },
        { name: 'Q3', data: [11, 17, 15, 15, 21] },
      ],
      xAxis: { categories: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'] },
      stacked: true,
      horizontal: true,
      colors: 'vibrant',
    }"
    title="Stacked Horizontal"
  />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldBarChart :config="config" title="Stacked Horizontal" />
    </div>
  </DemoBlock>
</template>
