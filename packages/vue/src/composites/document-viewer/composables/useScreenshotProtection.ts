/**
 * useScreenshotProtection — client-side screen-capture deterrents.
 *
 * Two independent visual layers, plus print-blank and pointer hardening:
 *   - Layer 1 — Frosted blur on focus loss / tab hide. The caller applies a
 *     blur to the document content while `isBlurred` is true; it auto-clears
 *     when focus / visibility returns. Deters screen recorders and snipping
 *     tools that steal focus. No message.
 *   - Layer 2 — Persistent block when a screenshot / snip / devtools hotkey is
 *     pressed. `isCaptureBlocked` stays true until the user dismisses it via
 *     `dismiss()` (a "Back to document" button).
 *   - Print-blank — an `@media print` rule blanks the viewer so print-to-PDF
 *     captures nothing (scoped to the protected root).
 *   - Block right-click context menu + drag-out (+ mobile CSS hardening in
 *     DocumentViewer).
 *
 * Additive only: it never changes `selection` / `print` / `download`. Enablement
 * is read through a getter so toggling at runtime needs no `:key` remount.
 *
 * IMPORTANT: this is a deterrent, NOT a guarantee. Every behaviour here is
 * removable via browser DevTools / by disabling JavaScript, and none of it stops
 * OS screenshots, screen recorders, or a phone photo. Most screenshot hotkeys
 * are grabbed by the OS before the page sees them (so Layer 2 is best-effort).
 */
import { onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue'

/**
 * Common screenshot / screen-record / snip / devtools key combinations. Most are
 * grabbed by the OS before the page sees them (best-effort only), but blocking
 * the ones the browser does deliver is cheap.
 */
function matchesScreenshotHotkey(e: KeyboardEvent): boolean {
  const key = e.key
  const mod = e.metaKey || e.ctrlKey

  // PrintScreen, with or without modifiers (Windows / Linux).
  if (key === 'PrintScreen') return true

  // Windows snip / game bar: Win+Shift+S, Win+G.
  if (e.metaKey && e.shiftKey && (key === 'S' || key === 's')) return true
  if (e.metaKey && (key === 'G' || key === 'g')) return true

  // macOS screenshots: Cmd+Shift+3/4/5 (and the 6 used by some keyboards).
  if (e.metaKey && e.shiftKey && ['3', '4', '5', '6'].includes(key)) return true

  // DevTools (a capture/inspection vector): F12, Ctrl/Cmd+Shift+I, +Shift+C, +Shift+J.
  if (key === 'F12') return true
  if (mod && e.shiftKey && ['I', 'i', 'C', 'c', 'J', 'j'].includes(key)) return true

  return false
}

export function useScreenshotProtection(
  elementRef: Ref<HTMLElement | null>,
  getEnabled: () => boolean,
): {
  /** Layer 1 — apply a frosted blur to the document content while true. */
  isBlurred: Ref<boolean>
  /** Layer 2 — show the persistent capture-blocked panel while true. */
  isCaptureBlocked: Ref<boolean>
  /** Dismiss the Layer 2 panel (the "Back to document" button). */
  dismiss: () => void
} {
  const isBlurred = ref(false)
  const isCaptureBlocked = ref(false)
  let attached: HTMLElement | null = null
  let printStyle: HTMLStyleElement | null = null

  // ── Element-level deterrents ───────────────────────────────────────────────

  function handleContextMenu(e: Event) {
    if (!getEnabled()) return
    e.preventDefault()
  }

  function handleDragStart(e: Event) {
    if (!getEnabled()) return
    e.preventDefault()
  }

  function attach(el: HTMLElement) {
    el.addEventListener('contextmenu', handleContextMenu)
    el.addEventListener('dragstart', handleDragStart)
    attached = el
  }

  function detach() {
    if (!attached) return
    attached.removeEventListener('contextmenu', handleContextMenu)
    attached.removeEventListener('dragstart', handleDragStart)
    attached = null
  }

  // ── Layer 1: frosted blur on focus loss / tab hide ─────────────────────────

  function handleWindowBlur() {
    if (getEnabled()) isBlurred.value = true
  }

  function handleWindowFocus() {
    // Only clear if the document is actually visible (focus can fire while the
    // tab is still backgrounded).
    if (document.visibilityState === 'visible') isBlurred.value = false
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      if (getEnabled()) isBlurred.value = true
    } else if (document.hasFocus()) {
      isBlurred.value = false
    }
  }

  // ── Layer 2: persistent block on a screenshot/devtools hotkey ──────────────

  function handleHotkey(e: KeyboardEvent) {
    if (!getEnabled() || !matchesScreenshotHotkey(e)) return
    e.preventDefault()
    e.stopPropagation()
    isCaptureBlocked.value = true
    // NOTE: we deliberately do NOT clobber the clipboard here. It only helps on
    // the narrow Windows path where PrintScreen copies a bitmap to the
    // clipboard, does nothing on Linux/macOS (those screenshots go to a file),
    // and triggers an intrusive clipboard-permission prompt in some browsers
    // (e.g. Firefox). We only show the block panel + preventDefault/stopPropagation.
  }

  /** Dismiss the persistent Layer 2 panel (the "Back to document" button). */
  function dismiss() {
    isCaptureBlocked.value = false
  }

  // ── Print-blank (@media print) ─────────────────────────────────────────────
  //
  // Injected only while enabled and scoped to the protected root via the
  // `data-screenshot-protected` attribute, so a consumer embedding the viewer
  // in a larger page can still print the rest of that page.

  function syncPrintStyle(enabled: boolean) {
    if (enabled && !printStyle) {
      const style = document.createElement('style')
      style.setAttribute('data-screenshot-protection-print', '')
      style.textContent = `@media print {
        [data-screenshot-protected] * { visibility: hidden !important; }
        [data-screenshot-protected]::after {
          content: 'Protected content';
          visibility: visible !important;
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
      }`
      document.head.appendChild(style)
      printStyle = style
    } else if (!enabled && printStyle) {
      printStyle.remove()
      printStyle = null
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  watch(
    elementRef,
    (el, _prev, onCleanup) => {
      detach()
      if (el) {
        attach(el)
        onCleanup(detach)
      }
    },
    { immediate: true },
  )

  // Sync the print style with the enabled state, and clear both layers if the
  // feature is toggled off at runtime.
  watch(
    getEnabled,
    (enabled) => {
      syncPrintStyle(enabled)
      if (!enabled) {
        isBlurred.value = false
        isCaptureBlocked.value = false
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('keydown', handleHotkey, true)
    window.addEventListener('keyup', handleHotkey, true)
  })

  onBeforeUnmount(() => {
    detach()
    window.removeEventListener('blur', handleWindowBlur)
    window.removeEventListener('focus', handleWindowFocus)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('keydown', handleHotkey, true)
    window.removeEventListener('keyup', handleHotkey, true)
    syncPrintStyle(false)
  })

  return { isBlurred, isCaptureBlocked, dismiss }
}
