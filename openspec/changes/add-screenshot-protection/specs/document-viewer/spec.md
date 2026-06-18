# document-viewer Specification

## ADDED Requirements

### Requirement: Screenshot Protection Deterrents

The component SHALL expose an opt-in `screenshotProtection` boolean feature flag (default `false`). When enabled, the component SHALL apply a bundle of client-side screen-capture deterrents at the viewer root so they cover every renderer (PDF, image, text, markdown). These deterrents are best-effort only: they SHALL NOT be relied upon to prevent OS screenshots, screen recording, or capture by a user with browser developer tools.

#### Scenario: Disabled by default

- **WHEN** a consumer mounts DocumentViewer without setting `screenshotProtection`
- **THEN** no deterrent behaviour is applied
- **AND** the right-click menu, drag, focus/blur, hotkeys, and printing behave as the browser defaults

#### Scenario: Frosted blur on focus loss or tab hide (Layer 1)

- **WHEN** `screenshotProtection` is enabled AND the window loses focus or the document becomes hidden
- **THEN** the document content is blurred (with no message)
- **AND** the blur is removed when the window regains focus and the document is visible again

#### Scenario: Capture-block panel on screenshot hotkey (Layer 2)

- **WHEN** `screenshotProtection` is enabled AND the page receives a known screenshot / snip / devtools key combination
- **THEN** the component prevents the key's default action and shows a persistent "Protected content" panel with a "Back to document" button
- **AND** the panel remains until the user dismisses it via the button

#### Scenario: Print-blank

- **WHEN** `screenshotProtection` is enabled AND the user invokes print / print-to-PDF
- **THEN** the viewer subtree is blanked in the printed output via a scoped `@media print` rule
- **AND** content outside the protected viewer still prints normally

#### Scenario: Block context menu and drag-out

- **WHEN** `screenshotProtection` is enabled AND the user opens the right-click context menu or starts dragging content out of the viewer
- **THEN** the default action is prevented

#### Scenario: Runtime toggle without remount

- **WHEN** a consumer flips `screenshotProtection` on or off on a mounted viewer
- **THEN** the change takes effect without requiring a `:key` remount

### Requirement: Screenshot Protection Is Purely Additive

The `screenshotProtection` flag SHALL NOT enable, disable, or otherwise alter text selection/copy, printing, or downloading. Those capabilities SHALL remain controlled solely by the existing `selection`, `print`, and `download` feature flags.

#### Scenario: Selection, print, and download unaffected by screenshotProtection

- **WHEN** `screenshotProtection` is enabled while `selection`, `print`, and `download` retain their values
- **THEN** text selection/copy, the in-app print path, and the download control behave exactly as their own flags dictate
- **AND** enabling `screenshotProtection` neither hides nor disables the print or download toolbar controls
- **AND** the print-blank `@media print` behaviour applies regardless of the `print` flag's value
