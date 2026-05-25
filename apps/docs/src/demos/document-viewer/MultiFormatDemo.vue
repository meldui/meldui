<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Button } from '@meldui/vue'
import { DocumentViewer } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
const SAMPLE_IMAGE = 'https://picsum.photos/seed/docviewer/800/1000'
const SAMPLE_TEXT_CONTENT = `Sample text document\n=====================\n\nThis is a plain-text document rendered by TextViewer.\n\nIt supports the same toolbar + side-panel chrome as PDF rendering,\nincluding search (Ctrl+F) and download.`
const SAMPLE_MARKDOWN_CONTENT = `# Sample Markdown\n\nThis is **markdown** rendered by \`MarkdownViewer\`.\n\n- Headings, lists, code\n- Search via the toolbar\n- Print works (uses native print dialog)\n\n## Code\n\n\`\`\`ts\nimport { DocumentViewer } from '@meldui/vue'\n\`\`\`\n\n> Block quotes render too.`

type Format = 'pdf' | 'image' | 'text' | 'markdown'
const format = ref<Format>('pdf')

const sample = computed(() => {
  switch (format.value) {
    case 'pdf':      return { source: SAMPLE_PDF, mimeType: 'application/pdf' }
    case 'image':    return { source: SAMPLE_IMAGE, mimeType: 'image/jpeg' }
    case 'text':     return { source: new Blob([SAMPLE_TEXT_CONTENT], { type: 'text/plain' }), mimeType: 'text/plain' }
    case 'markdown': return { source: new Blob([SAMPLE_MARKDOWN_CONTENT], { type: 'text/markdown' }), mimeType: 'text/markdown' }
  }
})

const code = `<script setup lang="ts">
import { DocumentViewer } from '@meldui/vue'
<\/script>

<template>
  <!-- PDF -->
  <DocumentViewer source="/doc.pdf" mime-type="application/pdf" wasm-url="/pdfium.wasm" />

  <!-- Image -->
  <DocumentViewer source="/diagram.png" mime-type="image/png" />

  <!-- Text or Markdown -->
  <DocumentViewer source="/notes.md" mime-type="text/markdown" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div class="flex gap-2">
        <Button :variant="format === 'pdf' ? 'default' : 'outline'" size="sm" @click="format = 'pdf'">PDF</Button>
        <Button :variant="format === 'image' ? 'default' : 'outline'" size="sm" @click="format = 'image'">Image</Button>
        <Button :variant="format === 'text' ? 'default' : 'outline'" size="sm" @click="format = 'text'">Text</Button>
        <Button :variant="format === 'markdown' ? 'default' : 'outline'" size="sm" @click="format = 'markdown'">Markdown</Button>
      </div>
      <div class="h-[600px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          :key="format"
          :source="sample.source"
          :mime-type="sample.mimeType"
          wasm-url="/pdfium.wasm"
          :features="{ zoom: true, search: true, download: true, print: true }"
        />
      </div>
    </div>
  </DemoBlock>
</template>
