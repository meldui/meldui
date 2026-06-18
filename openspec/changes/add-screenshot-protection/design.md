## Context

The DocumentViewer renders confidential documents in the browser. A consumer asked for a way to deter a reader from screenshotting/exfiltrating an open document, modelled on common "screenshot protection" features. The honest engineering position is that **a browser cannot prevent capture of its own rendered content** — OS screenshots (`Cmd+Shift+4`, `Win+Shift+S`, Linux `PrintScreen`), screen recorders, and phone photos all defeat any in-page guard, and any JavaScript/CSS deterrent is removable via DevTools. Most screenshot hotkeys are grabbed by the desktop environment before the page sees them. The only override-proof browser mechanism is DRM-protected media (EME/CDM + HDCP), which applies to `<video>`/`<audio>` only, not PDF/canvas/DOM.

Comparable products take the same approach: a broad screenshot-hotkey interception + a block panel, a blur-on-window-blur effect, an `@media print` blank page, and `contextmenu`/`user-drag` CSS — often on top of server-rendered page images (no text layer). Notably, where they apply `user-select:none` it is blanket CSS on the content, **not** gated by the screenshot flag — i.e. selection is not coupled to screenshot protection. Such products openly note this kind of protection "does not work in 100% of use cases" and recommend pairing with a watermark (a separate feature).

Given that, this change deliberately ships _deterrents against casual capture_ — not a security control — and leans on documentation to set expectations.

## Goals / Non-Goals

**Goals:**

- A single opt-in flag that raises friction for casual capture/exfiltration across all four renderers, at parity with comparable products.
- Honest, prominent documentation of the limits.
- Zero impact on existing consumers (default off) and no new dependencies.

**Non-Goals:**

- Watermarking (forensic or decorative).
- DRM / EME / HDCP-protected rendering or any tamper-resistant guarantee.
- Switching to image-based rendering (the "pixels only" model) — we keep EmbedPDF's text layer.
- Coupling to / mutating `selection`, `print`, or `download` — these keep their own flags.
- Attempt logging, a configuration object, or per-deterrent toggles.
- Any toolbar or programmatic-API change.

## Decisions

### D1. Root-level DOM concern, not an EmbedPDF plugin

Wired in `DocumentViewer.vue` against the root element, not in `pluginRegistry.ts`. Covers PDF, image, text, and markdown uniformly and avoids coupling to EmbedPDF. `buildPlugins` is untouched.

### D2. Name `screenshotProtection`

Matches the common `enableScreenshotProtection`-style term (discoverability) and clearly describes intent now that the feature is a pure capture-deterrent bundle. The "doesn't actually block all screenshots" honesty is handled by docs leading with the limitations. (An earlier draft used `contentProtection`; renamed before release, so no consumer breakage.)

### D3. Single boolean, no config object

One `screenshotProtection?: boolean`. The deterrents are cheap and complementary; per-deterrent toggles and overlay-copy customisation add surface area for little value. Easy to extend later.

### D4. Purely additive — never mutates selection/print/download

`screenshotProtection` does not flip or gate any other flag, so there is no `effectiveFeatures` interception. Consumers compose explicitly (e.g. `{ screenshotProtection: true, selection: false, print: false, download: false }`). This keeps each control orthogonal and — critically — avoids two conflicts that coupling would create: (a) disabling selection breaks the highlight/annotation tools, and (b) selection is a mount-only plugin flag while `screenshotProtection` is runtime-live, so coupling would produce a half-applied state on a live toggle. This matches how comparable products behave — they do not gate selection by the flag either.

### D5. Keep EmbedPDF; selection stays independent

We retain EmbedPDF's live text layer (search/selection/annotations keep working). A consumer who wants "no copyable text" sets `selection: false` themselves. Print-to-PDF is defeated by a scoped `@media print` blank rule that does **not** touch the `print` flag (so it works whether or not the in-app Print button is shown).

### D6. Live (getter-based) enablement

The composable reads enablement through a getter (like `useTouch` reads `enabled`), so toggling on a mounted viewer takes effect without a `:key` remount. This is safe precisely because the flag no longer touches mount-only plugin flags.

## Risks / Trade-offs

- **False sense of security.** Mitigation: the docs page leads with an explicit "deterrent, not a guarantee" callout enumerating what it cannot stop (Linux/macOS/Windows OS screenshots, recorders, phone photos, DevTools), noting that no browser-based protection is 100%.
- **Hotkey interception is largely cosmetic.** Most combos are OS-grabbed before the page sees them; only browser-delivered combos (e.g. `F12`) actually fire the overlay. Documented.
- **Real DOM text remains** unless the consumer also sets `selection: false` — the trade-off of keeping EmbedPDF instead of image rendering. Documented in the text-layer note.

Note: an early draft also clobbered the clipboard on a screenshot hotkey; this was removed because it triggers an intrusive clipboard-permission prompt in some browsers and provides no benefit on Linux/macOS (file-based captures).

## Migration Plan

Additive and default-off; no migration needed. Ship in a `@meldui/vue` minor release.

## Open Questions

- If a concrete need arises, should the overlay copy / individual deterrents become configurable (reopening D3)? Deferred until requested.
- Forensic watermarking (the complementary half of most such products) is intentionally out of scope here; revisit as a separate change if leak _traceability_ (vs. deterrence) is needed.
