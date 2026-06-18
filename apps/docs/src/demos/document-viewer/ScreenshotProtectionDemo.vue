<script setup lang="ts">
import { reactive } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Checkbox, DocumentViewer, Label } from '@meldui/vue'
import type { ViewerFeatures } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

// `screenshotProtection` is additive and read live, so toggling it takes effect
// without a `:key` remount. It does NOT change `selection` / `print` /
// `download` — those are set independently here to also block copy/print.
const features = reactive<ViewerFeatures>({
  screenshotProtection: true,
  selection: false,
  print: false,
  download: false,
})

const code = `<script setup lang="ts">
import { reactive } from 'vue'
import { DocumentViewer, type ViewerFeatures } from '@meldui/vue'

const features = reactive<ViewerFeatures>({
  screenshotProtection: true,
  // screenshotProtection is orthogonal — set these yourself to block copy/print:
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
            :model-value="features.screenshotProtection ?? false"
            @update:model-value="(v) => (features.screenshotProtection = !!v)"
          />
          <span>screenshotProtection (toggles live — no remount)</span>
        </Label>
        <p class="text-xs text-muted-foreground">
          Try: <strong>right-click</strong> the page · <strong>drag</strong> the page ·
          <strong>switch tab / click another window</strong> (content blurs) ·
          a screenshot/devtools <strong>hotkey</strong> the browser delivers, e.g.
          <strong>F12</strong> ("Protected content" panel + "Back to document") ·
          <strong>Ctrl+P</strong> (blank page).
        </p>
      </div>
      <div class="h-[600px] w-full overflow-hidden rounded-md border">
        <DocumentViewer :source="SAMPLE_PDF" wasm-url="/pdfium.wasm" :features="features" />
      </div>
    </div>
  </DemoBlock>
</template>
