<script setup lang="ts">
import { reactive } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Checkbox, DocumentViewer, Label } from '@meldui/vue'
import type { ViewerFeatures } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const features = reactive<ViewerFeatures>({
  zoom: true,
  rotate: false,
  spread: false,
  pan: false,
  fullscreen: false,
  search: true,
  selection: true,
  outline: true,
  thumbnails: true,
  print: true,
  download: true,
  annotations: true,
  commentThreads: true,
  undoRedo: true,
  keyboardShortcuts: true,
  touchGestures: false,
})

const flagGroups = [
  { label: 'View',     keys: ['zoom', 'rotate', 'spread', 'pan', 'fullscreen'] as const },
  { label: 'Search',   keys: ['search', 'selection'] as const },
  { label: 'Panels',   keys: ['outline', 'thumbnails'] as const },
  { label: 'Export',   keys: ['print', 'download'] as const },
  { label: 'Annotate', keys: ['annotations', 'commentThreads', 'undoRedo'] as const },
  { label: 'Input',    keys: ['keyboardShortcuts', 'touchGestures'] as const },
]

const code = `<script setup lang="ts">
import { reactive } from 'vue'
import { DocumentViewer, type ViewerFeatures } from '@meldui/vue'

const features = reactive<ViewerFeatures>({
  zoom: true, search: true, annotations: true, /* ... */
})
<\/script>

<template>
  <DocumentViewer source="/doc.pdf" wasm-url="/pdfium.wasm" :features="features" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <div v-for="group in flagGroups" :key="group.label" class="flex flex-col gap-1">
          <div class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{{ group.label }}</div>
          <Label v-for="key in group.keys" :key="key" class="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox :model-value="features[key] ?? false" @update:model-value="(v) => (features[key] = !!v)" />
            <span>{{ key }}</span>
          </Label>
        </div>
      </div>
      <div class="h-[600px] w-full overflow-hidden rounded-md border">
        <DocumentViewer :source="SAMPLE_PDF" wasm-url="/pdfium.wasm" :features="features" />
      </div>
    </div>
  </DemoBlock>
</template>
