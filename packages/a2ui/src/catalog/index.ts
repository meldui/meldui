import type { ComponentDefs } from '../types'
import { basicComponents } from './components/basic'
import { richComponents } from './components/rich'
import { structuralComponents } from './components/structural'

/**
 * All MeldUI catalog component definitions, in catalog (display) order:
 * Basic primitives → structural & display → rich. This is the single source
 * of truth from which the published catalog is generated.
 */
export const COMPONENT_DEFS: ComponentDefs = {
  ...basicComponents,
  ...structuralComponents,
  ...richComponents,
}

/** Component names included in the MeldUI catalog, in order. */
export const MELDUI_COMPONENT_NAMES = Object.keys(COMPONENT_DEFS)

/**
 * Catalog components grouped into their reliability tiers, in display order.
 * Derived from the three authoring modules so it never drifts from the catalog.
 * Used by docs/Storybook to render per-tier galleries.
 */
export const COMPONENT_TIERS: ReadonlyArray<{ name: string; components: string[] }> = [
  { name: 'Basic primitives', components: Object.keys(basicComponents) },
  { name: 'Structural & display', components: Object.keys(structuralComponents) },
  { name: 'Rich', components: Object.keys(richComponents) },
]

export { basicComponents, structuralComponents, richComponents }
