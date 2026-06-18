## Why

A consuming app (doqo) wants to optionally discourage a _viewer/reader_ from casually capturing or exfiltrating a confidential document while it's open — the "screenshot protection" use case offered by various document-sharing tools.

Two realities bound this:

1. **No pure-browser technique is tamper-proof.** Every client-side guard (event `preventDefault`, CSS, an overlay) is removable via DevTools or by disabling JavaScript, and most OS screenshot hotkeys are grabbed by the desktop environment before the page ever sees them. The only override-proof approach is DRM-protected media (EME + Widevine/PlayReady/FairPlay + HDCP), which only applies to `<video>` streams and would require re-architecting pages into a protected media pipeline — out of scope. No browser-based screenshot protection works in 100% of use cases.
2. **Copy, print, and download are already controllable** via the existing `selection`, `print`, and `download` feature flags. This change is purely additive and must not duplicate or re-link them.

So the honest, proportionate offering is a single opt-in flag that bundles a set of _casual-capture deterrents_ (the common industry approach), paired with documentation that states plainly what it does and does not prevent.

## What Changes

Add a new boolean feature flag `screenshotProtection` to the DocumentViewer `features` prop (default `false`). When enabled, the viewer applies these client-side deterrents at the component root (covering PDF, image, text, and markdown sources):

- **Obscure on leave** — cover the document with a "Protected content" overlay when the window loses focus or the tab is hidden; restore on focus.
- **Hotkey block panel** — intercept common screenshot / snip / devtools combos (`PrintScreen` ±modifiers, `Win+Shift+S`, `Win+G`, `Cmd+Shift+3/4/5`, `F12`, `Ctrl/Cmd+Shift+I/C/J`) and show a persistent "Protected content" panel with a "Back to document" button.
- **Print-blank** — inject a scoped `@media print` rule that blanks the viewer on print / print-to-PDF (does NOT touch the `print` flag).
- **Block context menu** — suppress right-click.
- **Block drag-out** — cancel `dragstart`, plus mobile long-press / image-drag CSS hardening.

The flag is **purely additive and read live** (toggling at runtime needs no `:key` remount). Explicitly out of scope: watermarking, DRM/EME, coupling to / mutating `selection`/`print`/`download`, attempt logging, and any configuration object (single boolean by design).

## Capabilities

### Modified Capabilities

- `document-viewer`: add the `screenshotProtection` feature flag and its deterrent behaviours to the feature opt-in model.

### New Capabilities

<!-- None. This extends the existing document-viewer capability. -->

## Impact

- **Code**: one new flag on `ViewerFeatures` (`types/index.ts`) + `DEFAULT_FEATURES` entry (`plugins/pluginRegistry.ts`); one new composable `composables/useScreenshotProtection.ts`; small wiring + overlay + CSS hardening in `DocumentViewer.vue`. No EmbedPDF plugin, no toolbar changes, no `effectiveFeatures` interception.
- **Docs**: new `screenshot-protection.mdx` page (with a prominent limitations callout + text-layer note), a `screenshotProtection` row in `features.mdx`, and a nav entry.
- **New deps**: none (hotkeys handled by a plain key matcher, not `react-hotkeys-hook`).
- **Breaking changes**: none — default `false`, so existing consumers are unaffected.
- **Released as**: `@meldui/vue` minor version bump.
