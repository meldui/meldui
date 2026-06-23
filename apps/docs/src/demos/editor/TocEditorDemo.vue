<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

function heading(level: number, text: string) {
  return { type: 'heading', attrs: { level }, content: [{ type: 'text', text }] }
}

function para(text: string) {
  return { type: 'paragraph', content: [{ type: 'text', text }] }
}

const SAMPLE = {
  type: 'doc',
  content: [
    { type: 'tableOfContentsNode' },
    heading(1, 'Introduction'),
    para('The table of contents above is built from these headings and updates as you edit them.'),
    heading(2, 'Installation'),
    para('Add the package and import the styles once at your app root.'),
    heading(2, 'Usage'),
    para('Seed content from the created handler and listen for update:json.'),
    heading(3, 'Advanced'),
    para('Register custom blocks and extra slash commands.'),
  ],
}

function seed(editor: Editor) {
  editor.commands.setContent(SAMPLE)
}

const code = `<script setup lang="ts">
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

// Insert "Table of Contents" from the / slash menu. It auto-populates
// from the document's headings and scrolls to them on click.
function seed(editor: Editor) {
  editor.commands.setContent({
    type: 'doc',
    content: [
      { type: 'tableOfContentsNode' },
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Introduction' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Usage' }] },
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
