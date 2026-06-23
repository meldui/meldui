<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

function cell(text: string, header = false) {
  return {
    type: header ? 'tableHeader' : 'tableCell',
    content: [{ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] }],
  }
}

const SAMPLE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hover the table to reveal row and column controls.' }],
    },
    {
      type: 'table',
      content: [
        { type: 'tableRow', content: [cell('Quarter', true), cell('Revenue', true), cell('Growth', true)] },
        { type: 'tableRow', content: [cell('Q1'), cell('$120k'), cell('+8%')] },
        { type: 'tableRow', content: [cell('Q2'), cell('$200k'), cell('+12%')] },
      ],
    },
  ],
}

function seed(editor: Editor) {
  editor.commands.setContent(SAMPLE)
}

const code = `<script setup lang="ts">
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

// Insert a table from the / slash menu, or seed one as JSON.
function seed(editor: Editor) {
  editor.commands.setContent({
    type: 'doc',
    content: [
      {
        type: 'table',
        content: [
          { type: 'tableRow', content: [/* tableHeader cells */] },
          { type: 'tableRow', content: [/* tableCell cells */] },
        ],
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
