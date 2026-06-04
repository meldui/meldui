#!/usr/bin/env tsx
/**
 * Validates the published catalog artifact:
 *  1. Drift — the committed JSON matches a fresh generation (single source of truth).
 *  2. Schema validity — the catalog compiles as a JSON Schema (draft 2020-12) with
 *     all `$ref`s (incl. A2UI common types) resolvable.
 *  3. Required top-level fields are present.
 *  4. Coverage — every expected component is present and `DataTable` is absent.
 *
 * Exits non-zero on any failure. Run with `pnpm validate-catalog`.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import { COMMON_TYPES_URI } from '../src/constants'
import { MELDUI_COMPONENT_NAMES } from '../src/catalog/index'
import { serializeCatalog } from './generate-catalog'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CATALOG_PATH = resolve(__dirname, '../src/schema/meldui-v1.catalog.json')
const COMMON_TYPES_FIXTURE = resolve(__dirname, './common_types.fixture.json')

const errors: string[] = []
function check(label: string, ok: boolean, detail = '') {
  console.log(`${ok ? '✅' : '❌'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) errors.push(label)
}

function main() {
  // 1. Drift
  const expected = serializeCatalog()
  const committed = existsSync(CATALOG_PATH) ? readFileSync(CATALOG_PATH, 'utf-8') : ''
  check(
    'catalog.json is in sync with definitions (no drift)',
    committed === expected,
    committed === expected ? '' : 'run `pnpm generate-catalog`',
  )

  const catalog = JSON.parse(expected) as {
    $id: string
    catalogId?: string
    components: Record<string, unknown>
    functions: Record<string, unknown>
  }

  // 3. Required top-level fields
  check('has catalogId', typeof catalog.catalogId === 'string')
  check('has components object', catalog.components && typeof catalog.components === 'object')
  check('has functions object', catalog.functions && typeof catalog.functions === 'object')

  // 4. Coverage
  const present = Object.keys(catalog.components ?? {})
  const missing = MELDUI_COMPONENT_NAMES.filter((n) => !present.includes(n))
  check('all expected components present', missing.length === 0, missing.join(', '))
  check('DataTable is excluded', !present.includes('DataTable'))

  // 2. Schema validity (compile as a JSON Schema with common types resolvable)
  try {
    const ajv = new Ajv2020({ strict: false, allErrors: true, validateFormats: true })
    addFormats(ajv)
    const commonTypes = JSON.parse(readFileSync(COMMON_TYPES_FIXTURE, 'utf-8'))
    // Register A2UI common types under the URI the catalog refs resolve against,
    // and the catalog under its own $id.
    ajv.addSchema(commonTypes, COMMON_TYPES_URI)
    ajv.addSchema(catalog, catalog.$id)
    // A2UI common_types references a sibling `catalog.json#/$defs/anyFunction`
    // (relative to common_types' own URI). Register the catalog under that
    // sibling URL too so the back-reference from common types resolves.
    const siblingCatalogUri = COMMON_TYPES_URI.replace(/common_types\.json$/, 'catalog.json')
    ajv.addSchema({ ...catalog, $id: siblingCatalogUri }, siblingCatalogUri)
    // Resolve every component and function through the catalog's $id. getSchema
    // compiles lazily with the catalog as the base URI, so each component's
    // local (`#/$defs/...`) and absolute (common types) refs all resolve.
    const unresolved: string[] = []
    for (const name of Object.keys(catalog.components)) {
      if (!ajv.getSchema(`${catalog.$id}#/components/${name}`))
        unresolved.push(`components/${name}`)
    }
    for (const name of Object.keys(catalog.functions)) {
      if (!ajv.getSchema(`${catalog.$id}#/functions/${name}`)) unresolved.push(`functions/${name}`)
    }
    check(
      'catalog compiles as a valid JSON Schema (refs resolvable)',
      unresolved.length === 0,
      unresolved.join(', '),
    )
  } catch (err) {
    check('catalog compiles as a valid JSON Schema (refs resolvable)', false, String(err))
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} validation failure(s).`)
    process.exit(1)
  }
  console.log(`\n✅ Catalog valid — ${present.length} components.`)
}

main()
