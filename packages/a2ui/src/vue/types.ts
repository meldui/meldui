import type { Component } from 'vue'
import type { ComponentApi, ComponentContext } from '@a2ui/web_core/v0_9'

/**
 * Props every MeldUI render component receives from the host: the fully
 * resolved property snapshot from web_core's GenericBinder (`p`) and the
 * component's `ComponentContext` (for data scope / actions).
 */
export interface A2uiRenderProps {
  /** Resolved props: DYNAMIC → primitives, ACTION → `() => void`, ChildList → `{id,basePath}[]`, plus `set<Prop>` setters. */
  p: Record<string, unknown>
  context: ComponentContext
}

/**
 * A web_core `ComponentApi` (name + Zod schema) extended with the Vue
 * component that renders it. This is the renderer-facing catalog entry; it
 * mirrors the official React renderer's `ReactComponentImplementation`.
 */
export interface VueComponentApi extends ComponentApi {
  render: Component
}
