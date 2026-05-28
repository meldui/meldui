/**
 * v-meld-scroll — auto-hiding native scrollbar for the scroll containers we
 * don't own (EmbedPDF's `<Viewport>` and `<ThumbnailsPane>`, whose internal
 * scroll element can't be swapped for MeldUI's `<ScrollArea>`).
 *
 * It mirrors reka-ui's `ScrollArea` `type="hover"` behaviour (which our
 * `<ScrollArea>` uses by default) so the native bar feels identical to the
 * component used everywhere else in the viewer:
 *   - pointerenter → clear any pending hide, reveal instantly
 *   - pointerleave → hide `HIDE_DELAY` ms later
 *
 * It deliberately does NOT listen to `scroll`. An earlier version tied the
 * hide timer to the last scroll event, but momentum/inertial scrolling and
 * EmbedPDF's virtualization keep emitting `scroll` after the pointer has left,
 * which repeatedly reset the timer and left the bar lingering. reka's hover
 * type is purely pointer-driven for exactly this reason.
 *
 * Visibility is exposed as the `data-scroll-visible` attribute, consumed by
 * `.meldscroll[data-scroll-visible]::-webkit-scrollbar-thumb` in the theme
 * CSS (themes/default.css). `HIDE_DELAY` matches reka's default
 * `scrollHideDelay` (600 ms).
 *
 * Applied to a component, the directive lands on its single root element —
 * which is exactly the `overflow:auto` div for both EmbedPDF components.
 */
import type { Directive } from 'vue'

const HIDE_DELAY = 600

const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()
const cleanups = new WeakMap<HTMLElement, () => void>()

export const vMeldScroll: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('meldscroll')

    const clearHideTimer = () => {
      const existing = timers.get(el)
      if (existing) {
        clearTimeout(existing)
        timers.delete(el)
      }
    }

    const onPointerEnter = () => {
      clearHideTimer()
      el.setAttribute('data-scroll-visible', '')
    }

    const onPointerLeave = () => {
      clearHideTimer()
      timers.set(
        el,
        setTimeout(() => {
          el.removeAttribute('data-scroll-visible')
          timers.delete(el)
        }, HIDE_DELAY),
      )
    }

    el.addEventListener('pointerenter', onPointerEnter)
    el.addEventListener('pointerleave', onPointerLeave)
    cleanups.set(el, () => {
      el.removeEventListener('pointerenter', onPointerEnter)
      el.removeEventListener('pointerleave', onPointerLeave)
      clearHideTimer()
    })
  },
  unmounted(el) {
    cleanups.get(el)?.()
    cleanups.delete(el)
    el.removeAttribute('data-scroll-visible')
  },
}
