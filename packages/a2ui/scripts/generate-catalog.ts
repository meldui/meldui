#!/usr/bin/env tsx
/**
 * Generates the published `src/schema/meldui-v1.catalog.json` from the
 * component definitions in `src/catalog`. The TypeScript definitions are the
 * single source of truth; this artifact is generated, committed, and served
 * via the `@meldui/a2ui/catalog` export. Run with `pnpm generate-catalog`.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildCatalog } from '../src/catalog/build'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const OUT = resolve(__dirname, '../src/schema/meldui-v1.catalog.json')

/** Canonical serialization — must match `validate-catalog.ts` for the drift check. */
export function serializeCatalog(): string {
  return `${JSON.stringify(buildCatalog(), null, 2)}\n`
}

function main() {
  const json = serializeCatalog()
  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, json, 'utf-8')
  const count = Object.keys(buildCatalog().components).length
  console.log(`✅ Generated catalog with ${count} components → ${OUT}`)
}

// Only run when invoked directly (not when imported by validate-catalog.ts).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
