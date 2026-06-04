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

export { basicComponents, structuralComponents, richComponents }
