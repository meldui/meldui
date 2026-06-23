<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

const SAMPLE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Select the chart and click the gear to reconfigure it.' }],
    },
    {
      type: 'meldChart',
      attrs: {
        chartType: 'bar',
        config: {
          series: [{ name: 'Revenue', data: [120, 200, 150, 280, 190, 230] }],
          xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        },
        title: 'Monthly revenue',
      },
    },
    { type: 'paragraph' },
  ],
}

function seed(editor: Editor) {
  editor.commands.setContent(SAMPLE)
}

const code = `<script setup lang="ts">
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

// Insert "Chart" from the / slash menu to pick a type and configure it,
// or seed a pre-configured meldChart node (rendered via @meldui/charts-vue).
function seed(editor: Editor) {
  editor.commands.setContent({
    type: 'doc',
    content: [
      {
        type: 'meldChart',
        attrs: {
          chartType: 'bar',
          config: {
            series: [{ name: 'Revenue', data: [120, 200, 150, 280, 190, 230] }],
            xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
          },
          title: 'Monthly revenue',
        },
      },
    ],
  })
}
<\/script>

<template>
  <MeldEditor @created="seed" />
</template>`
</script>

<template>
  <DemoBlock :code="code" align="start">
    <div class="w-full">
      <MeldEditor @created="seed" />
    </div>
  </DemoBlock>
</template>
