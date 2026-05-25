/**
 * useTouch — viewer touch gesture composable.
 *
 * EmbedPDF's Zoom plugin handles pinch-to-zoom natively. This composable adds:
 *   - Horizontal swipe → previous / next page (in single-page view modes)
 *   - Double-tap → toggle between fit-width and actual-size zoom
 *
 * Disabled when more than one finger is on the screen so it doesn't fight
 * pinch-zoom.
 */
import { onBeforeUnmount, type Ref, watch } from 'vue'

export interface TouchHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onDoubleTap?: () => void
}

export interface TouchOptions {
  /** Minimum horizontal travel for a swipe (pixels). */
  swipeThreshold?: number
  /** Maximum vertical drift to still count as a horizontal swipe. */
  swipeMaxVerticalDrift?: number
  /** Window between taps to count as a double-tap (ms). */
  doubleTapWindow?: number
  enabled?: boolean
}

const DEFAULTS = {
  swipeThreshold: 60,
  swipeMaxVerticalDrift: 60,
  doubleTapWindow: 300,
}

export function useTouch(
  elementRef: Ref<HTMLElement | null>,
  handlers: TouchHandlers,
  options: TouchOptions = {},
) {
  let lastTapTime = 0
  let startX = 0
  let startY = 0
  let startTime = 0
  let pointerCount = 0
  let attached: HTMLElement | null = null

  const opts = { ...DEFAULTS, ...options }

  function handleTouchStart(e: TouchEvent) {
    pointerCount = e.touches.length
    if (pointerCount > 1) return
    const touch = e.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    startTime = Date.now()
  }

  function handleTouchEnd(e: TouchEvent) {
    if (opts.enabled === false) return
    if (pointerCount > 1) {
      pointerCount = e.touches.length
      return
    }

    const touch = e.changedTouches[0]
    const dx = touch.clientX - startX
    const dy = touch.clientY - startY
    const elapsed = Date.now() - startTime

    // Swipe detection
    if (
      Math.abs(dx) >= opts.swipeThreshold &&
      Math.abs(dy) <= opts.swipeMaxVerticalDrift &&
      elapsed < 500
    ) {
      if (dx < 0) handlers.onSwipeLeft?.()
      else handlers.onSwipeRight?.()
      return
    }

    // Double-tap detection (only if no significant movement)
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && elapsed < 250) {
      const now = Date.now()
      if (now - lastTapTime < opts.doubleTapWindow) {
        handlers.onDoubleTap?.()
        lastTapTime = 0
      } else {
        lastTapTime = now
      }
    }
  }

  function attach(el: HTMLElement) {
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    attached = el
  }

  function detach() {
    if (!attached) return
    attached.removeEventListener('touchstart', handleTouchStart)
    attached.removeEventListener('touchend', handleTouchEnd)
    attached = null
  }

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

  onBeforeUnmount(detach)
}
