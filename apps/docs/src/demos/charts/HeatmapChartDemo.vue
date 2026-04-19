<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldHeatmapChart } from '@meldui/charts-vue'
import type { MeldHeatmapChartConfig } from '@meldui/charts-vue'

const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const data: [number, number, number][] = []
days.forEach((_, di) => {
  hours.forEach((_, hi) => {
    data.push([hi, di, Math.round(Math.random() * 80 + 10)])
  })
})

const config: MeldHeatmapChartConfig = {
  series: [{ name: 'Activity', data }],
  xAxis: { categories: hours },
  yAxis: { categories: days },
  colors: 'ocean',
}

const code = `\u003cscript setup lang="ts">
import { MeldHeatmapChart } from '@meldui/charts-vue'
import type { MeldHeatmapChartConfig } from '@meldui/charts-vue'

const config: MeldHeatmapChartConfig = {
  series: [{
    name: 'Activity',
    data: [
      [0, 0, 45], [1, 0, 68], [2, 0, 52], // Mon: 9am, 10am, 11am
      [0, 1, 55], [1, 1, 78], [2, 1, 65], // Tue
      // ...
    ],
  }],
  xAxis: { categories: ['9am', '10am', '11am'] },
  yAxis: { categories: ['Mon', 'Tue', 'Wed'] },
  colors: 'ocean',
}
\u003c/script>

\u003ctemplate>
  <MeldHeatmapChart :config="config" title="Weekly Activity" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <MeldHeatmapChart :config="config" title="Weekly Activity" :height="550" />
    </div>
  </DemoBlock>
</template>
