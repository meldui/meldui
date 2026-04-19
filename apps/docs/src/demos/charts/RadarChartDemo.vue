<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldRadarChart } from '@meldui/charts-vue'
import type { MeldRadarChartConfig } from '@meldui/charts-vue'

const config: MeldRadarChartConfig = {
  series: [
    { name: 'Candidate A', data: [85, 90, 75, 80, 88, 78] },
    { name: 'Candidate B', data: [78, 85, 88, 90, 82, 85] },
  ],
  xAxis: { categories: ['JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js', 'Testing'] },
  yAxis: { max: 100 },
  legend: { position: 'bottom' },
  colors: 'corporate',
}

const code = `\u003cscript setup lang="ts">
import { MeldRadarChart } from '@meldui/charts-vue'
import type { MeldRadarChartConfig } from '@meldui/charts-vue'

const config: MeldRadarChartConfig = {
  series: [
    { name: 'Candidate A', data: [85, 90, 75, 80, 88, 78] },
    { name: 'Candidate B', data: [78, 85, 88, 90, 82, 85] },
  ],
  xAxis: { categories: ['JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js', 'Testing'] },
  yAxis: { max: 100 },
  legend: { position: 'bottom' },
  colors: 'corporate',
}
\u003c/script>

\u003ctemplate>
  <MeldRadarChart :config="config" title="Skill Comparison" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldRadarChart :config="config" title="Skill Comparison" />
    </div>
  </DemoBlock>
</template>
