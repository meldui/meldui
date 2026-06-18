# document-viewer Specification

## ADDED Requirements

### Requirement: Content Protection Deterrents

The component SHALL expose an opt-in `contentProtection` boolean feature flag (default `false`). When enabled, the component SHALL apply a bundle of client-side capture deterrents at the viewer root so they cover every renderer (PDF, image, text, markdown). These deterrents are best-effort only: they SHALL NOT be relied upon to prevent OS screenshots, screen recording, or capture by a user with browser developer tools.

#### Scenario: Disabled by default

- **WHEN** a consumer mounts DocumentViewer without setting `contentProtection`
- **THEN** no capture-deterrent behaviour is applied
- **AND** the right-click menu, drag, focus/blur, and PrintScreen behave as the browser defaults

#### Scenario: Obscure on focus loss or tab hide

- **WHEN** `contentProtection` is enabled AND the window loses focus or the document becomes hidden
- **THEN** the document content is covered by an overlay
- **AND** the overlay is removed when the window regains focus and the document is visible again

#### Scenario: PrintScreen deterrent

- **WHEN** `contentProtection` is enabled AND the user presses the `PrintScreen` key
- **THEN** the component best-effort clears the clipboard
- **AND** the document content is briefly obscured
- **AND** any failure of the clipboard operation is swallowed without error

#### Scenario: Block context menu and drag-out

- **WHEN** `contentProtection` is enabled AND the user opens the right-click context menu or starts dragging content out of the viewer
- **THEN** the default action is prevented

#### Scenario: Runtime toggle without remount

- **WHEN** a consumer flips `contentProtection` on or off on a mounted viewer
- **THEN** the change takes effect without requiring a `:key` remount

### Requirement: Content Protection Does Not Gate Copy, Print, or Download

The `contentProtection` flag SHALL NOT enable or disable text selection/copy, printing, or downloading. Those capabilities SHALL remain controlled solely by the existing `selection`, `print`, and `download` feature flags.

#### Scenario: Copy/print/download unaffected by contentProtection

- **WHEN** `contentProtection` is enabled while `selection`, `print`, and `download` retain their values
- **THEN** text selection/copy, the print path, and the download control behave exactly as their own flags dictate
- **AND** enabling `contentProtection` neither hides nor disables the print or download toolbar controls
