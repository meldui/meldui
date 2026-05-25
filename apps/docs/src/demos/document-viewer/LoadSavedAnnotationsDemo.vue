<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DocumentViewer } from '@meldui/vue'
import type { Annotation, DocumentViewerInstance } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const viewer = ref<DocumentViewerInstance | null>(null)
const status = ref('Waiting for document load…')

// Pretend these came from your backend.
const SAVED: Annotation[] = [
  {
    id: 'a-1',
    type: 'highlight',
    pageIndex: 0,
    rect:         { origin: { x: 120, y: 660 }, size: { width: 350, height: 18 } },
    segmentRects: [{ origin: { x: 120, y: 660 }, size: { width: 350, height: 18 } }],
    color: '#FFCD45',
    opacity: 0.4,
    selectedText: 'Important sentence from a previous review',
    author: 'alex@example.com',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'a-2',
    type: 'comment',
    pageIndex: 0,
    rect: { origin: { x: 500, y: 600 }, size: { width: 24, height: 24 } },
    contents: 'Worth re-reading next sprint',
    author: 'sam@example.com',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

onMounted(async () => {
  // Simulate fetch latency
  await new Promise((r) => setTimeout(r, 800))
  await viewer.value?.loadAnnotations(SAVED)
  status.value = `Seeded ${SAVED.length} annotations`
})

const code = `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DocumentViewer, type Annotation, type DocumentViewerInstance } from '@meldui/vue'

const viewer = ref<DocumentViewerInstance | null>(null)

onMounted(async () => {
  const saved: Annotation[] = await fetch('/api/annotations?docId=42').then(r => r.json())
  await viewer.value?.loadAnnotations(saved)
})
<\/script>

<template>
  <DocumentViewer ref="viewer" source="/doc.pdf" wasm-url="/pdfium.wasm" :features="{ annotations: true, commentThreads: true }" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-2">
      <div class="text-xs text-muted-foreground">{{ status }}</div>
      <div class="h-[600px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          ref="viewer"
          :source="SAMPLE_PDF"
          wasm-url="/pdfium.wasm"
          :features="{ zoom: true, annotations: true, commentThreads: true }"
        />
      </div>
    </div>
  </DemoBlock>
</template>
