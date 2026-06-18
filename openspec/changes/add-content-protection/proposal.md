## Why

A consuming app (doqo) wants to optionally discourage a _viewer/reader_ from casually capturing or exfiltrating a confidential document while it's open — the use case marketed by tools like peony.ink as "screenshot protection."

Two realities bound this:

1. **No pure-browser technique is tamper-proof.** Every client-side guard (event `preventDefault`, CSS, an overlay) is removable via DevTools or by disabling JavaScript, because the document pixels live in the DOM/canvas on the user's machine. The only override-proof approach is DRM-protected media (EME + Widevine/PlayReady/FairPlay + HDCP), which only applies to `<video>` streams and would require re-architecting pages into a protected media pipeline — out of scope.
2. **Copy, print, and download are already controllable** via the existing `selection`, `print`, and `download` feature flags. This change must not duplicate or re-link them.

So the honest, proportionate offering is a single opt-in flag that bundles a few _casual-capture deterrents_, paired with documentation that states plainly what it does and does not prevent.

## What Changes

Add a new boolean feature flag `contentProtection` to the DocumentViewer `features` prop (default `false`). When enabled, the viewer applies four client-side deterrents at the component root (covering PDF, image, text, and markdown sources):

- **Obscure on leave** — cover the document with an overlay when the window loses focus or the tab is hidden; restore on focus.
- **PrintScreen deterrent** — on the `PrintScreen` key, best-effort clear the clipboard and briefly obscure (Windows/Chromium only).
- **Block context menu** — suppress right-click (anti "Save image as").
- **Block drag-out** — cancel `dragstart`.

Explicitly out of scope: watermarking, DRM/EME, blocking copy/print/download (kept on their existing flags), any configuration object (single boolean by design), and any toolbar change.

## Capabilities

### Modified Capabilities

- `document-viewer`: add the `contentProtection` feature flag and its deterrent behaviours to the feature opt-in model.

### New Capabilities

<!-- None. This extends the existing document-viewer capability. -->

## Impact

- **Code**: one new flag on `ViewerFeatures` (`types/index.ts`) + `DEFAULT_FEATURES` entry (`plugins/pluginRegistry.ts`); one new composable `composables/useContentProtection.ts`; small wiring + overlay in `DocumentViewer.vue`. No EmbedPDF plugin, no toolbar changes.
- **Docs**: new `content-protection.mdx` page (with a prominent limitations callout), a `contentProtection` row in `features.mdx`, and a nav entry.
- **New deps**: none.
- **Breaking changes**: none — default `false`, so existing consumers are unaffected.
- **Released as**: `@meldui/vue` minor version bump.
