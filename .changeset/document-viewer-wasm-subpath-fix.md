---
'@meldui/vue': patch
---

fix(document-viewer): resolve `wasmUrl` against `document.baseURI` instead of `window.location.origin`, so consumers deployed under a subpath (e.g. GitHub Pages project sites) can fetch `pdfium.wasm` from the correct path.
