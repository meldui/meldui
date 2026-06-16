---
'@meldui/vue': minor
---

DocumentViewer: uniform toolbar events + non-PDF download fallback

- Every feature action now emits a notify-only event. Added `download`, `print`, `fullscreen-change`, and `interaction-mode-change`, and `zoom-change`/`rotation-change` now also fire for non-PDF document types (image/text/markdown). Events are add-on only — they never override the built-in behavior. The `DocumentViewerEmits` type now also includes `thread-open-requested` (previously emitted but undeclared).
- The download button now works for image/text/markdown sources without a `downloadUrl`: it resolves the `source` to a same-origin `blob:` URL (fetching remote/cross-origin sources into a Blob first, since browsers ignore the `download` attribute on cross-origin hrefs) and downloads it with a smart-derived filename. PDFs and `downloadUrl` behavior are unchanged.
- Removed the unused, never-wired `ViewerPermissions` type. Per-document permissions are expressed via a per-document `features` object plus a `:key` remount (see the updated share-link-viewer guide). This is the only breaking surface, though the type had no runtime effect.
- Fixed the `CreateAnnotationInput` type so it distributes over the `Annotation` union — each variant now correctly keeps its own fields (e.g. `contents` for comments, `segmentRects`/`color` for highlights). Previously `Omit<Annotation, …>` collapsed the union to its common base keys and dropped variant-specific properties.
