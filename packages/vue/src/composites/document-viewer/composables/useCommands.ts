/**
 * Command catalog for DocumentViewer — registered with `@embedpdf/plugin-commands`
 * so all keyboard shortcuts (and any toolbar action that wants to opt in)
 * resolve through a single central registry.
 *
 * Why this exists: the audit against the EmbedPDF Vue docs flagged that we
 * were hand-rolling a `document.addEventListener('keydown', ...)` switch in
 * `useKeyboard.ts` when EmbedPDF's Commands plugin is the canonical
 * registry. Commands carry shortcuts and an action that runs against the
 * plugin registry; the keyboard binder (`useCommandsKeyboard`) is a thin
 * ~20-line bridge that maps DOM key events to `getCommandByShortcut →
 * execute`.
 *
 * Shape: this composable doesn't *use* anything reactive — it returns a
 * plain array of `Command` definitions built from the callbacks the host
 * component supplies. The actual `registerCommand()` calls happen inside
 * `PdfController` where the plugin capability is available.
 */
import type { Command } from '@embedpdf/plugin-commands'

/**
 * Callbacks for every command DocumentViewer registers.
 *
 * Engine actions (zoom, page nav, rotate, fullscreen) live close to the
 * controller and could be implemented directly via the plugin registry —
 * but routing them through callbacks keeps the command catalog plugin-host
 * agnostic and matches the pattern used by UI commands. The cost is one
 * extra hop; the benefit is one consistent shape.
 */
export interface CommandCallbacks {
  // Page navigation
  prevPage: () => void
  nextPage: () => void
  firstPage: () => void
  lastPage: () => void
  // Zoom
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  // Rotation
  rotateClockwise: () => void
  rotateCounterClockwise: () => void
  // Fullscreen
  toggleFullscreen: () => void
  // Search popover (DocumentViewer-level UI state)
  openSearch: () => void
  // Panels (DocumentViewer-level UI state)
  toggleComments: () => void
  toggleOutline: () => void
  toggleThumbnails: () => void
  // Misc
  escape: () => void
  // History
  undo: () => void
  redo: () => void
}

/** Build the full Command array for `registerCommand`. */
export function buildCommands(cb: CommandCallbacks): Command[] {
  return [
    {
      id: 'page.prev',
      label: 'Previous page',
      shortcuts: ['arrowleft'],
      action: () => cb.prevPage(),
    },
    {
      id: 'page.next',
      label: 'Next page',
      shortcuts: ['arrowright'],
      action: () => cb.nextPage(),
    },
    {
      id: 'page.first',
      label: 'First page',
      shortcuts: ['home'],
      action: () => cb.firstPage(),
    },
    {
      id: 'page.last',
      label: 'Last page',
      shortcuts: ['end'],
      action: () => cb.lastPage(),
    },
    {
      id: 'zoom.in',
      label: 'Zoom in',
      shortcuts: ['+', '='],
      action: () => cb.zoomIn(),
    },
    {
      id: 'zoom.out',
      label: 'Zoom out',
      shortcuts: ['-', '_'],
      action: () => cb.zoomOut(),
    },
    {
      id: 'zoom.reset',
      label: 'Reset zoom',
      shortcuts: ['0'],
      action: () => cb.resetZoom(),
    },
    {
      id: 'rotate.cw',
      label: 'Rotate clockwise',
      shortcuts: ['r'],
      action: () => cb.rotateClockwise(),
    },
    {
      id: 'rotate.ccw',
      label: 'Rotate counter-clockwise',
      shortcuts: ['shift+r'],
      action: () => cb.rotateCounterClockwise(),
    },
    {
      id: 'fullscreen.toggle',
      label: 'Toggle fullscreen',
      shortcuts: ['f11'],
      action: () => cb.toggleFullscreen(),
    },
    {
      id: 'search.open',
      label: 'Search',
      shortcuts: ['ctrl+f', 'meta+f'],
      action: () => cb.openSearch(),
    },
    {
      id: 'panel.comments.toggle',
      label: 'Toggle comments panel',
      shortcuts: ['c'],
      action: () => cb.toggleComments(),
    },
    {
      id: 'panel.outline.toggle',
      label: 'Toggle outline panel',
      shortcuts: ['o'],
      action: () => cb.toggleOutline(),
    },
    {
      id: 'panel.thumbnails.toggle',
      label: 'Toggle thumbnails panel',
      shortcuts: ['t'],
      action: () => cb.toggleThumbnails(),
    },
    {
      id: 'escape',
      label: 'Close popovers',
      shortcuts: ['escape'],
      action: () => cb.escape(),
    },
    {
      id: 'history.undo',
      label: 'Undo',
      shortcuts: ['ctrl+z', 'meta+z'],
      action: () => cb.undo(),
    },
    {
      id: 'history.redo',
      label: 'Redo',
      // Cover both common conventions: Ctrl+Y (Windows) and Ctrl+Shift+Z (mac).
      shortcuts: ['ctrl+y', 'meta+y', 'ctrl+shift+z', 'meta+shift+z'],
      action: () => cb.redo(),
    },
  ]
}
