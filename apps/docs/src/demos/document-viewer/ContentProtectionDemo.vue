<script setup lang="ts">
import { reactive } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Checkbox, DocumentViewer, Label } from '@meldui/vue'
import type { ViewerFeatures } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

// `contentProtection` is read live (unlike plugin-gating flags), so toggling it
// takes effect without a `:key` remount. `selection` / `print` / `download` ARE
// mount-only — but here we keep them fixed and only toggle contentProtection so
// the demo needs no remount.
const features = reactive<ViewerFeatures>({
  contentProtection: true,
  selection: false,
  print: false,
  download: false,
})

const code = `<script setup lang="ts">
import { reactive } from 'vue'
import { DocumentViewer, type ViewerFeatures } from '@meldui/vue'

const features = reactive<ViewerFeatures>({
  contentProtection: true,
  // contentProtection does NOT block these — lock them down yourself:
  selection: false,
  print: false,
  download: false,
})
<\/script>

<template>
  <DocumentViewer source="/doc.pdf" wasm-url="/pdfium.wasm" :features="features" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap items-center gap-4 rounded-md border bg-muted/40 p-3">
        <Label class="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <Checkbox
            :model-value="features.contentProtection ?? false"
            @update:model-value="(v) => (features.contentProtection = !!v)"
          />
          <span>contentProtection (toggles live — no remount)</span>
        </Label>
        <p class="text-xs text-muted-foreground">
          Try: <strong>right-click</strong> the page · <strong>drag</strong> the page ·
          <strong>switch tab / click another window</strong> (overlay appears) ·
          <strong>PrintScreen</strong> on Windows/Chromium (overlay + clipboard cleared).
        </p>
      </div>
      <div class="h-[600px] w-full overflow-hidden rounded-md border">
        <DocumentViewer :source="SAMPLE_PDF" wasm-url="/pdfium.wasm" :features="features" />
      </div>
    </div>
  </DemoBlock>
</template>
