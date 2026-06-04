import { COMMON_TYPES_URI } from '../constants'
import type { ComponentDef, JSONSchema } from '../types'

/** A `$ref` into the shared A2UI common types schema (e.g. `DynamicString`). */
export function common(def: string): JSONSchema {
  return { $ref: `${COMMON_TYPES_URI}#/$defs/${def}` }
}

/** A `$ref` into this catalog's local `$defs`. */
export function local(def: string): JSONSchema {
  return { $ref: `#/$defs/${def}` }
}

/**
 * Wraps an authored {@link ComponentDef} into the full A2UI v0.9 component
 * schema: the shared `allOf` prefix (`ComponentCommon`, the catalog's
 * `CatalogComponentCommon`, optionally `Checkable`) plus the component's own
 * object schema with the injected `component` discriminator (`const: name`).
 *
 * This is the single place the boilerplate lives, so every component — Basic
 * primitive or MeldUI-specific — is structurally identical to the official
 * A2UI Basic catalog.
 */
export function defineComponent(name: string, def: ComponentDef): JSONSchema {
  const inner: JSONSchema = {
    type: 'object',
    properties: {
      component: { const: name },
      ...def.properties,
    },
    required: ['component', ...(def.required ?? [])],
  }
  if (def.description) inner.description = def.description

  return {
    type: 'object',
    allOf: [
      common('ComponentCommon'),
      local('CatalogComponentCommon'),
      ...(def.checkable ? [common('Checkable')] : []),
      inner,
    ],
  }
}
