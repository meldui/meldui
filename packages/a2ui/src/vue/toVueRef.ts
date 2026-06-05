import { customRef, onScopeDispose, type Ref } from 'vue'
import { effect, type Signal } from '@a2ui/web_core/v0_9'

/**
 * Bridges a single web_core Preact `Signal` into a Vue ref — the Vue analog of
 * Angular's `toAngularSignal` and React's `useSyncExternalStore`. The Preact
 * `effect` re-triggers Vue's dependency tracking when the signal changes; the
 * effect is disposed when the owning scope unmounts.
 *
 * The core renderer resolves whole prop snapshots via `GenericBinder` (see
 * `useA2uiNode`), but this is exported for one-off signal bridging.
 */
export function toVueRef<T>(signal: Signal<T>): Ref<T> {
  let stop: (() => void) | undefined
  const r = customRef<T>((track, trigger) => {
    stop = effect(() => {
      // Touch the signal so the effect re-runs (and re-triggers Vue) on change.
      void signal.value
      trigger()
    })
    return {
      get() {
        track()
        return signal.peek()
      },
      set() {
        /* read-only bridge */
      },
    }
  })
  onScopeDispose(() => stop?.())
  return r
}
