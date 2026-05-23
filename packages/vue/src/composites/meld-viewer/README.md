# MeldViewer

A reusable, framework-agnostic document viewer composite for `@meldui/vue`, built on [EmbedPDF](https://www.embedpdf.com/) (PDFium WASM, headless plugin architecture).

> **Full docs**: see `apps/docs/src/content/docs/meld-viewer/` for the complete reference site (overview, getting started, every plugin, every use case, programmatic API, theming, bundle/perf, troubleshooting, and migration guides).

## What's here

- PDF rendering via EmbedPDF (continuous scroll, virtualization, search, outline, thumbnails, annotations, etc.)
- Image, plain-text, and markdown rendering for multi-format consumers
- Native EmbedPDF annotations with a programmatic CRUD API
- Threaded comments overlay (replies + resolved state) anchored to annotation UUIDs
- Feature opt-in via a single `features` prop — disabled plugins are tree-shaken

## Quick start

```vue
<script setup lang="ts">
import { MeldViewer, type MeldViewerInstance } from '@meldui/vue'
import { ref } from 'vue'

const viewer = ref<MeldViewerInstance | null>(null)
</script>

<template>
  <MeldViewer
    ref="viewer"
    source="/sample.pdf"
    wasm-url="/pdfium.wasm"
    :features="{ zoom: true, search: true, annotations: true }"
  />
</template>
```

## PDFium WASM self-hosting

EmbedPDF ships PDFium as a WebAssembly binary inside `@embedpdf/pdfium`. Copy it into your public dir at build time and point MeldViewer at it via `wasmUrl`:

```bash
# Add to your build script (example for a Phoenix app)
cp node_modules/@embedpdf/pdfium/dist/pdfium.wasm priv/static/pdfium.wasm
```

Then pass `wasm-url="/pdfium.wasm"` to the component.

## Why self-host?

- Same origin as your app (no CDN dependency, no CORS, no third-party domain)
- Works in air-gapped / enterprise environments
- Cached independently of your JS bundle
- See `docs/bundle-and-perf.mdx` for the full bundle strategy

## Status

Phase 1 covers feature parity with typical viewer needs + programmatic annotation API. Phase 2 adds redaction, stamps, signature, forms, and attachments (each opt-in).

See `openspec/changes/meld-viewer/` for the canonical implementation status.
