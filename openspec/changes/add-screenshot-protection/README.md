# add-screenshot-protection

Add an opt-in `screenshotProtection` flag to the DocumentViewer: a bundle of client-side screen-capture **deterrents** (frosted blur on blur/tab-hide, screenshot/devtools hotkey block panel, `@media print` blank, block right-click + drag-out). A deterrent against casual capture only — not a guarantee, not DRM, no watermark. **Purely additive**: it does not change `selection` / `print` / `download` (compose those flags separately).
