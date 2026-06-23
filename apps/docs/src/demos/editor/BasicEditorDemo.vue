<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

const SAMPLE = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Hello, MeldEditor' }] },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Select text for the bubble menu, or type ' },
        { type: 'text', marks: [{ type: 'code' }], text: '/' },
        { type: 'text', text: ' to open the slash menu.' },
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

function seed(editor: Editor) {
  editor.commands.setContent({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Hello, MeldEditor' }] },
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
