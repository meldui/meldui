## Context

The DocumentViewer renders confidential documents in the browser. A consumer asked for a way to deter a reader from screenshotting/exfiltrating an open document. The honest engineering position is that **a browser cannot prevent capture of its own rendered content** — OS screenshots (`Cmd+Shift+4`, `Win+Shift+S`), screen recorders, and phone photos all defeat any in-page guard, and any JavaScript/CSS deterrent is removable via DevTools. The only override-proof browser mechanism is DRM-protected media (EME/CDM + HDCP), which applies to `<video>`/`<audio>` only, not PDF/canvas/DOM.

Given that, this change deliberately ships _deterrents against casual capture_, not a security control, and leans on documentation to set expectations. This mirrors what comparable "browser screenshot protection" products actually deliver.

## Goals / Non-Goals

**Goals:**

- A single opt-in flag that raises friction for casual capture/exfiltration across all four renderers.
- Honest, prominent documentation of the limits.
- Zero impact on existing consumers (default off) and no new dependencies.

**Non-Goals:**

- Watermarking (forensic or decorative).
- DRM / EME / HDCP-protected rendering or any tamper-resistant guarantee.
- Blocking copy, print, or download — these already have the `selection`, `print`, and `download` flags; re-implementing them here would hide that control.
- A configuration object or per-deterrent toggles.
- Any toolbar or programmatic-API change.

## Decisions

### D1. Root-level DOM concern, not an EmbedPDF plugin

Content protection is wired in `DocumentViewer.vue` against the root element, not in `pluginRegistry.ts`. This covers PDF, image, text, and markdown uniformly and avoids coupling to EmbedPDF (which only renders the PDF case). `buildPlugins` is untouched.

### D2. Name `contentProtection`, not `screenshotProtection`

The suite does not actually prevent screenshots. `screenshotProtection` would over-promise and invite a false sense of security; `contentProtection` accurately names a bundle of capture deterrents and matches the existing flat-noun vocabulary (`selection`, `print`, `download`).

**Alternative considered:** `screenshotProtection` — rejected as misleading.

### D3. Single boolean, no config object

Kept as one `contentProtection?: boolean`. The deterrents are cheap and complementary; per-deterrent toggles and overlay-copy customisation add surface area for little value. Easy to extend later if a concrete need appears.

### D4. Independent from selection/print/download

`contentProtection` does not flip or gate `selection`/`print`/`download`. Consumers compose them explicitly (e.g. `{ contentProtection: true, selection: false, print: false, download: false }`). This keeps each control discoverable and orthogonal.

### D5. Live (getter-based) enablement

The composable reads enablement through a getter (like `useTouch` reads `enabled`), so toggling `contentProtection` on a mounted viewer takes effect without a `:key` remount — unlike plugin-gating flags which are mount-only.

## Risks / Trade-offs

- **False sense of security.** Mitigation: the dedicated docs page leads with an explicit "deterrent, not a guarantee" callout enumerating what it cannot stop (OS screenshots, recorders, phone photos, DevTools).
- **PrintScreen clipboard clobber has a real side effect** — it wipes the user's clipboard, and only on Windows/Chromium. Accepted as part of the bundle and documented; it's the one behaviour with a user-visible downside.
- **`blurOnLeave` false positives** — notifications, alt-tab, and opening DevTools also obscure the document. Accepted as the cost of the deterrent and documented.

## Migration Plan

Additive and default-off; no migration needed. Ship in a `@meldui/vue` minor release.

## Open Questions

- If a concrete need arises, should the overlay copy and individual deterrents become configurable (reopening D3)? Deferred until requested.
