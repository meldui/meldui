import type { Component } from 'vue'
import type { ComponentApi } from '@a2ui/web_core/v0_9'
import type { VueComponentApi } from './types'

/**
 * Pairs a web_core `ComponentApi` (name + Zod schema) with the Vue component
 * that renders it. Use with web_core's exported `*Api` for Basic primitives,
 * or with a locally-authored `{ name, schema }` for MeldUI components.
 */
export function defineVueComponent(api: ComponentApi, render: Component): VueComponentApi {
  return { name: api.name, schema: api.schema, render }
}
