---
'@meldui/vue': patch
---

DocumentViewer: enable rotation for image documents

The rotate controls were gated to PDFs only, so images couldn't be rotated even though the renderer already supported it. The toolbar's rotate group (and its mobile-overflow items) now show for image documents as well as PDFs, reusing the existing `features.rotate` flag. `ImageViewer`'s transform origin was changed from `top left` to `center` so 90°/270° rotations stay centered and visible. Text/markdown remain non-rotatable (their renderers don't apply rotation).
