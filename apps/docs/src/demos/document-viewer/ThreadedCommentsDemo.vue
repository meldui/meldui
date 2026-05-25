<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DocumentViewer } from '@meldui/vue'
import type {
  Annotation,
  CommentThread,
  DocumentViewerInstance,
  ThreadUpdatePayload,
} from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const viewer = ref<DocumentViewerInstance | null>(null)
const log = ref<string[]>([])

const annotations: Annotation[] = [
  {
    id: 't-1',
    type: 'comment',
    pageIndex: 0,
    rect: { origin: { x: 480, y: 660 }, size: { width: 24, height: 24 } },
    contents: 'Section 2 is unclear',
    author: 'alex@example.com',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 't-2',
    type: 'highlight',
    pageIndex: 0,
    rect:         { origin: { x: 120, y: 600 }, size: { width: 360, height: 18 } },
    segmentRects: [{ origin: { x: 120, y: 600 }, size: { width: 360, height: 18 } }],
    color: '#8FCFEF',
    opacity: 0.4,
    selectedText: 'Highlighted passage',
    author: 'sam@example.com',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

const threads: CommentThread[] = [
  {
    annotationId: 't-1',
    resolved: false,
    replies: [
      {
        id: 'r-1',
        annotationId: 't-1',
        authorUserId: 'sam@example.com',
        authorDisplayName: 'Sam',
        content: 'Agreed — propose splitting into 2a and 2b',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
  },
  {
    annotationId: 't-2',
    resolved: true,
    resolvedAt: new Date(Date.now() - 600000).toISOString(),
    resolvedByUserId: 'alex@example.com',
    replies: [],
  },
]

onMounted(async () => {
  await viewer.value?.loadAnnotations(annotations)
  viewer.value?.loadThreads(threads)
})

function onThreadUpdate({ thread, action }: ThreadUpdatePayload) {
  log.value = [`${new Date().toLocaleTimeString()}  ${action} on ${thread.annotationId}`, ...log.value].slice(0, 5)
  // In a real app: persist to backend
  // fetch('/api/threads/' + thread.annotationId, { method: 'PATCH', body: JSON.stringify(thread) })
}

const code = `<script setup lang="ts">
import { DocumentViewer, type ThreadUpdatePayload } from '@meldui/vue'

function onThreadUpdate({ thread, action }: ThreadUpdatePayload) {
  // persist: { thread, action: 'reply-added' | 'reply-deleted' | 'resolved' | 'unresolved' }
}
<\/script>

<template>
  <DocumentViewer
    source="/doc.pdf"
    wasm-url="/pdfium.wasm"
    :features="{ annotations: true, commentThreads: true }"
    :current-user="{ id: 'u-42', displayName: 'You' }"
    @thread-update="onThreadUpdate"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div class="h-[500px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          ref="viewer"
          :source="SAMPLE_PDF"
          wasm-url="/pdfium.wasm"
          :features="{ zoom: true, annotations: true, commentThreads: true, undoRedo: true }"
          :current-user="{ id: 'u-42', displayName: 'You', avatarUrl: '' }"
          @thread-update="onThreadUpdate"
        />
      </div>
      <pre class="max-h-24 overflow-auto rounded-md bg-muted/40 p-2 text-xs">{{ log.join('\n') || 'Thread updates appear here…' }}</pre>
    </div>
  </DemoBlock>
</template>
