/**
 * @meldui/a2ui/vue — the Vue reference renderer for the MeldUI A2UI catalog.
 *
 * Built on `@a2ui/web_core` (v0.9): a fine-grained, per-component reactive host
 * that maps the MeldUI catalog to `@meldui/vue` components. Call `provideA2UI`
 * in a root `setup()`, feed streamed messages to `processor.processMessages`,
 * and mount `<A2UISurface :surface-id>`.
 */
export {
  provideA2UI,
  type ProvideA2uiOptions,
  type A2uiActionHandler,
  type A2uiHandle,
} from './provideA2UI'
export { A2UISurface } from './A2UISurface'
export { DeferredChild } from './DeferredChild'
export { toVueRef } from './toVueRef'
export { defineVueComponent } from './define'
export { meldVueCatalog, buildVueCatalog, pendingRendererComponents } from './catalog'
export { meldTheme, type MeldTheme } from './theme'
export { A2UI_CONTEXT, type A2uiContext } from './keys'
export type { VueComponentApi, A2uiRenderProps } from './types'
