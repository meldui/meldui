import { CATALOG_ID } from '../constants'
import type { CatalogDocument, JSONSchema } from '../types'
import { defineComponent } from './common'
import functionsSchema from './functions.json'
import { COMPONENT_DEFS } from './index'
import themeSchema from './theme-schema.json'

/**
 * Local `$defs` shared across components. `CatalogComponentCommon` mirrors the
 * official Basic catalog (the `weight` flex-grow hint for Row/Column children).
 */
const CatalogComponentCommon: JSONSchema = {
  type: 'object',
  properties: {
    weight: {
      type: 'number',
      description:
        "The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.",
    },
  },
}

/**
 * Assemble the complete MeldUI A2UI v0.9 catalog document from the
 * component definitions, functions, and theme schema. This is the single
 * source of truth; the published `meldui-v1.catalog.json` is generated from
 * its output (see `scripts/generate-catalog.ts`).
 */
export function buildCatalog(): CatalogDocument {
  const components: Record<string, JSONSchema> = {}
  for (const [name, def] of Object.entries(COMPONENT_DEFS)) {
    components[name] = defineComponent(name, def)
  }

  const functions = functionsSchema as Record<string, JSONSchema>

  const anyComponent = {
    oneOf: Object.keys(components).map((name) => ({ $ref: `#/components/${name}` })),
  }
  const anyFunction = {
    oneOf: Object.keys(functions).map((name) => ({ $ref: `#/functions/${name}` })),
  }

  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: CATALOG_ID,
    title: 'MeldUI Catalog',
    description:
      'The MeldUI A2UI catalog: A2UI v0.9 Basic primitives plus MeldUI structural, display, and rich components, renderable by the @meldui/a2ui Vue renderer.',
    catalogId: CATALOG_ID,
    components,
    functions,
    $defs: {
      CatalogComponentCommon,
      theme: themeSchema as JSONSchema,
      anyComponent,
      anyFunction,
    },
  }
}
