<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Button, DocumentViewer } from '@meldui/vue'
import type { DocumentViewerInstance } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const viewer = ref<DocumentViewerInstance | null>(null)
const ephemeralId = ref<string | null>(null)

// Pretend these are AI-generated citations into the document.
const CITATIONS = [
  { page: 0, rect: { origin: { x: 100, y: 640 }, size: { width: 360, height: 18 } }, label: 'Cite §1 (page 1)' },
  { page: 2, rect: { origin: { x: 80, y: 500 }, size: { width: 420, height: 18 } }, label: 'Cite §2.3 (page 3)' },
  { page: 5, rect: { origin: { x: 120, y: 720 }, size: { width: 300, height: 18 } }, label: 'Cite §4.1 (page 6)' },
]

async function showCitation(c: (typeof CITATIONS)[number]) {
  if (ephemeralId.value) {
    await viewer.value?.deleteAnnotation(ephemeralId.value)
    ephemeralId.value = null
  }
  const created = await viewer.value?.createAnnotation({
    type: 'highlight',
    pageIndex: c.page,
    rect: c.rect,
    segmentRects: [c.rect],
    color: '#92E89E',
    opacity: 0.5,
    metadata: { is_ephemeral: true, citation_id: c.label },
  })
  if (created) {
    ephemeralId.value = created.id
    viewer.value?.navigateToAnnotation(created.id)
  }
}

async function clearCitation() {
  if (ephemeralId.value) {
    await viewer.value?.deleteAnnotation(ephemeralId.value)
    ephemeralId.value = null
  }
}

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { DocumentViewer, type DocumentViewerInstance } from '@meldui/vue'

const viewer = ref<DocumentViewerInstance | null>(null)

async function showCitation(c: Citation) {
  const created = await viewer.value?.createAnnotation({
    type: 'highlight',
    pageIndex: c.page,
    rect: c.rect,
    segmentRects: [c.rect],
    color: '#92E89E',
    opacity: 0.5,
    metadata: { is_ephemeral: true, citation_id: c.id },
  })
  viewer.value?.navigateToAnnotation(created.id)
}
<\/script>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        <Button v-for="c in CITATIONS" :key="c.label" size="sm" variant="outline" @click="showCitation(c)">
          {{ c.label }}
        </Button>
        <Button size="sm" variant="ghost" :disabled="!ephemeralId" @click="clearCitation">Clear</Button>
      </div>
      <div class="h-[500px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          ref="viewer"
          :source="SAMPLE_PDF"
          wasm-url="/pdfium.wasm"
          :features="{ zoom: true, annotations: true }"
        />
      </div>
    </div>
  </DemoBlock>
</template>
