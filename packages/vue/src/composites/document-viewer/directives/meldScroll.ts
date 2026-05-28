/**
 * v-meld-scroll — auto-hiding native scrollbar for the scroll containers we
 * don't own (EmbedPDF's `<Viewport>` and `<ThumbnailsPane>`, whose internal
 * scroll element can't be swapped for MeldUI's `<ScrollArea>`).
 *
 * It mirrors reka-ui's `ScrollArea` behaviour so the native bar feels the
 * same as the component used everywhere else in the viewer:
 *   - reveal on hover (handled in CSS via `.meldscroll:hover`)
 *   - reveal while actively scrolling, then fade out `HIDE_DELAY` ms after the
 *     last scroll event (handled here by toggling `data-scrolling`)
 *
 * `HIDE_DELAY` matches reka's default `scrollHideDelay` (600 ms). The actual
 * scrollbar painting lives in DocumentViewer.vue's unscoped `<style>` so the
 * whole treatment stays inside the DocumentViewer boundary.
 *
 * Applied to a component, the directive lands on its single root element —
 * which is exactly the `overflow:auto` div for both EmbedPDF components.
 */
import type { Directive } from 'vue'

const HIDE_DELAY = 600

const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()
const handlers = new WeakMap<HTMLElement, () => void>()

export const vMeldScroll: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('meldscroll')
    const onScroll = () => {
      el.setAttribute('data-scrolling', '')
      const existing = timers.get(el)
      if (existing) clearTimeout(existing)
      timers.set(
        el,
        setTimeout(() => el.removeAttribute('data-scrolling'), HIDE_DELAY),
      )
    }
    handlers.set(el, onScroll)
    el.addEventListener('scroll', onScroll, { passive: true })
  },
  unmounted(el) {
    const onScroll = handlers.get(el)
    if (onScroll) el.removeEventListener('scroll', onScroll)
    const existing = timers.get(el)
    if (existing) clearTimeout(existing)
    timers.delete(el)
    handlers.delete(el)
  },
}
