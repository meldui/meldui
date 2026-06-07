/**
 * Types for authoring the MeldUI A2UI catalog. The catalog is a JSON-Schema
 * document; these types keep the per-component definitions honest at author
 * time without pulling in a full JSON-Schema type library.
 */

/** A loose JSON-Schema fragment. */
export type JSONSchema = Record<string, unknown>

/**
 * The authored, co-located definition of a single catalog component. This is
 * the single source of truth; `buildCatalog()` wraps it into the full A2UI
 * v0.9 component schema (the shared `allOf` prefix + the `component`
 * discriminator) and the codegen script emits the published catalog from it.
 */
export interface ComponentDef {
  /** Optional human/LLM-facing description of the component. */
  description?: string
  /**
   * Whether the component accepts client-side validation `checks` (i.e. mixes
   * in the A2UI `Checkable` schema). True for interactive inputs.
   */
  checkable?: boolean
  /**
   * The component's own properties (JSON-Schema). The `component` discriminator
   * is injected by `buildCatalog()` and MUST NOT be included here.
   */
  properties: Record<string, JSONSchema>
  /**
   * Required property names, excluding `component` (which is always required
   * and injected by `buildCatalog()`).
   */
  required?: string[]
}

/** A map of component name → its authored definition. */
export type ComponentDefs = Record<string, ComponentDef>

/** The assembled A2UI v0.9 catalog document. */
export interface CatalogDocument extends JSONSchema {
  $schema: string
  $id: string
  catalogId: string
  components: Record<string, JSONSchema>
  functions: Record<string, JSONSchema>
  $defs: Record<string, JSONSchema>
}
