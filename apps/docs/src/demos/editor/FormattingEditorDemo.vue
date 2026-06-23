<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

const SAMPLE = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Heading 1' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Heading 2' }] },
    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Heading 3' }] },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Plain text with ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
        { type: 'text', text: ', ' },
        { type: 'text', marks: [{ type: 'italic' }], text: 'italic' },
        { type: 'text', text: ', and ' },
        { type: 'text', marks: [{ type: 'code' }], text: 'inline code' },
        { type: 'text', text: '.' },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bullet list item' }] }],
        },
      ],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ordered list item' }] }],
        },
      ],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A finished task' }] }],
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A pending task' }] }],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'A blockquote captures a quote.' }] },
      ],
    },
    {
      type: 'codeBlock',
      content: [{ type: 'text', text: 'const editor = new MeldEditor()' }],
    },
    { type: 'horizontalRule' },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: "Type '/' on a new line to insert any of these blocks." }],
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

// Every block below is reachable from the / slash menu:
// Text, Heading 1/2/3, Bullet List, Ordered List, Task List,
// Blockquote, Code Block, Horizontal Rule.
function seed(editor: Editor) {
  editor.commands.setContent({
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Heading 1' }] },
      { type: 'bulletList', content: [/* … */] },
      { type: 'taskList', content: [/* … */] },
      { type: 'codeBlock', content: [{ type: 'text', text: 'const x = 1' }] },
      { type: 'horizontalRule' },
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
