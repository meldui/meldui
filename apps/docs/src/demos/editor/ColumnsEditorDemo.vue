<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

function column(heading: string, body: string) {
  return {
    type: 'column',
    content: [
      { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: heading }] },
      { type: 'paragraph', content: [{ type: 'text', text: body }] },
    ],
  }
}

const SAMPLE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hover a column block to add, remove, or flatten columns.' }],
    },
    {
      type: 'columnBlock',
      content: [
        column('Left column', 'Place any blocks side by side — text, lists, images, even charts.'),
        column('Right column', 'Pick 2 or 3 columns from the slash menu; each column holds its own content.'),
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

// Pick "2 Columns" or "3 Columns" from the / slash menu, or seed a
// columnBlock (content: column{2,}) directly.
function seed(editor: Editor) {
  editor.commands.setContent({
    type: 'doc',
    content: [
      {
        type: 'columnBlock',
        content: [
          { type: 'column', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Left' }] }] },
          { type: 'column', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Right' }] }] },
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
