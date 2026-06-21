---
'@meldui/vue': minor
---

DocumentViewer: add opt-in `screenshotProtection` feature flag

A new `features.screenshotProtection` boolean (default `false`) applies a bundle of client-side screen-capture deterrents at the viewer root, covering PDF, image, text, and markdown sources alike:

- **Frosted blur on leave** — content is blurred behind a brand scrim when the window loses focus or the tab is hidden, and un-blurs when focus returns.
- **Capture-block panel** — common screenshot/snip/devtools combos (`PrintScreen`, `Win+Shift+S`, `Win+G`, `Cmd+Shift+3/4/5`, `F12`, `Ctrl/Cmd+Shift+I/C/J`) are intercepted, showing a persistent "Protected content" panel with a "Back to document" button.
- **Print-blank** — printing / print-to-PDF blanks the viewer via a scoped `@media print` rule, so the rest of the host page still prints.
- **Block context menu & drag-out** — right-click is suppressed and dragging images/text out of the viewer is cancelled (plus mobile long-press save hardening).

The flag is **purely additive and fully orthogonal** — it does not change text selection/copy, the in-app print button, or download (those keep their own flags). It is also **runtime-toggleable** (read live, no `:key` remount needed) since it touches no mount-only plugin.

This is a deterrent, not a guarantee: it cannot stop OS-level screenshots, screen recorders, phone photos, or a technical user with DevTools. Most OS screenshot hotkeys are grabbed before the page sees them. See the Screenshot Protection docs for the full limitations.
