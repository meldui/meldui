<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Button, DocumentViewer } from '@meldui/vue'
import type { DocumentViewerInstance } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const viewer = ref<DocumentViewerInstance | null>(null)
const status = ref('')

async function saveAsCopy() {
  status.value = 'Baking…'
  const buffer = await viewer.value?.saveAsCopy()
  if (!buffer) {
    status.value = 'No document loaded'
    return
  }
  const blob = new Blob([buffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'annotated-copy.pdf'
  a.click()
  URL.revokeObjectURL(url)
  status.value = `Downloaded annotated-copy.pdf (${(blob.size / 1024).toFixed(0)} KB)`
}

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { DocumentViewer, type DocumentViewerInstance } from '@meldui/vue'

const viewer = ref<DocumentViewerInstance | null>(null)

async function saveAsCopy() {
  const buffer = await viewer.value?.saveAsCopy()
  const blob = new Blob([buffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  // download or POST to backend
}
<\/script>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div class="flex items-center gap-2">
        <Button size="sm" @click="saveAsCopy">Save annotated copy</Button>
        <span v-if="status" class="text-xs text-muted-foreground">{{ status }}</span>
      </div>
      <div class="text-xs text-muted-foreground">
        Highlight some text or add a comment, then click <em>Save annotated copy</em> — the downloaded PDF has the annotations baked in (interoperable with any PDF reader).
      </div>
      <div class="h-[500px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          ref="viewer"
          :source="SAMPLE_PDF"
          wasm-url="/pdfium.wasm"
          :features="{ zoom: true, annotations: true, download: true }"
        />
      </div>
    </div>
  </DemoBlock>
</template>
