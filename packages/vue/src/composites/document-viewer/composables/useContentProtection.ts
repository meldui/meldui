/**
 * useContentProtection — client-side capture deterrents.
 *
 * When enabled, this composable applies a small bundle of deterrents against a
 * casual viewer trying to capture or exfiltrate the document:
 *   - Obscure the document (caller renders an overlay from `isObscured`) when
 *     the window loses focus or the tab is hidden — deters switching to a
 *     snipping tool or a screen recorder.
 *   - Best-effort clear the clipboard + briefly obscure on the PrintScreen key.
 *     This only does anything on Windows / Chromium: on Linux the desktop
 *     environment grabs PrintScreen as a global hotkey (the page never sees the
 *     keydown) and on macOS there is no PrintScreen key — both capture straight
 *     to a file, bypassing the clipboard entirely.
 *   - Block the right-click context menu (anti "Save image as").
 *   - Block drag-out of images / text.
 *
 * IMPORTANT: this is a deterrent, NOT a guarantee. Every behaviour here is
 * removable via browser DevTools / by disabling JavaScript, and none of it
 * stops OS screenshots, screen recorders, or a phone photo of the screen.
 *
 * The enabled state is read through a getter so toggling the feature at runtime
 * takes effect without remounting the viewer (mirrors `useTouch`).
 */
import { onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue'

/** How long to keep the overlay up after a PrintScreen key event (ms). */
const PRINT_SCREEN_OBSCURE_MS = 1500

export function useContentProtection(
  elementRef: Ref<HTMLElement | null>,
  getEnabled: () => boolean,
): { isObscured: Ref<boolean> } {
  const isObscured = ref(false)
  let attached: HTMLElement | null = null
  let printScreenTimer: ReturnType<typeof setTimeout> | null = null

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

  // ── Window / document obscuring ────────────────────────────────────────────

  function obscure() {
    if (!getEnabled()) return
    isObscured.value = true
  }

  function reveal() {
    isObscured.value = false
  }

  function handleWindowBlur() {
    obscure()
  }

  function handleWindowFocus() {
    // Don't reveal while the document is still hidden (e.g. focus event fires
    // but the tab is in the background).
    if (document.visibilityState === 'visible') reveal()
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') obscure()
    else if (document.hasFocus()) reveal()
  }

  function isPrintScreen(e: KeyboardEvent): boolean {
    return e.key === 'PrintScreen' || e.code === 'PrintScreen'
  }

  function handlePrintScreen(e: KeyboardEvent) {
    if (!getEnabled() || !isPrintScreen(e)) return
    obscure()
    // Best-effort clipboard clobber — unreliable across browsers/OSes and may
    // reject without a focused document; swallow any failure.
    try {
      void navigator.clipboard?.writeText('').catch(() => {})
    } catch {
      // Clipboard API unavailable — nothing more we can do.
    }
    if (printScreenTimer) clearTimeout(printScreenTimer)
    printScreenTimer = setTimeout(() => {
      if (document.visibilityState === 'visible' && document.hasFocus()) reveal()
    }, PRINT_SCREEN_OBSCURE_MS)
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

  onMounted(() => {
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('keydown', handlePrintScreen)
    window.addEventListener('keyup', handlePrintScreen)
  })

  onBeforeUnmount(() => {
    detach()
    window.removeEventListener('blur', handleWindowBlur)
    window.removeEventListener('focus', handleWindowFocus)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('keydown', handlePrintScreen)
    window.removeEventListener('keyup', handlePrintScreen)
    if (printScreenTimer) clearTimeout(printScreenTimer)
  })

  return { isObscured }
}
