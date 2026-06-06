/**
 * @meldui/a2ui — the MeldUI A2UI catalog contract.
 *
 * This entry exposes the catalog identity, the component definitions, and a
 * `buildCatalog()` helper / `catalog` object for typed/programmatic use. The
 * generated, framework-agnostic JSON artifact is available via the
 * `@meldui/a2ui/catalog` subpath export.
 *
 * The Vue reference renderer ships separately (see the `add-a2ui-vue-renderer`
 * change); this package, today, is the portable contract only.
 */

export { A2UI_VERSION, CATALOG_ID, COMMON_TYPES_URI } from './constants'
export type { CatalogDocument, ComponentDef, ComponentDefs, JSONSchema } from './types'
export {
  COMPONENT_DEFS,
  COMPONENT_TIERS,
  MELDUI_COMPONENT_NAMES,
  basicComponents,
  structuralComponents,
  richComponents,
} from './catalog/index'
export { defineComponent } from './catalog/common'
export { buildCatalog } from './catalog/build'
export { renderCatalogMarkdown } from './docs'

export { examples, surfaceExample, type A2uiExampleMessage } from './examples'

import { buildCatalog } from './catalog/build'

/** The assembled MeldUI A2UI catalog document (same content as the published JSON). */
export const catalog = buildCatalog()
