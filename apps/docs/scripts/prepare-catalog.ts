/**
 * Copies the published A2UI catalog from `@meldui/a2ui` into the docs site's
 * public assets so it is hosted at the canonical `catalogId` URL
 * (https://meldui.dipayanb.com/a2ui/v1/catalog.json).
 *
 * Runs at build time (after the package is built, guaranteed by Turbo's `^build`
 * ordering). Re-copying every build keeps the hosted file in sync with the
 * package — it never drifts from the published contract. Failures are warnings,
 * not errors (mirrors `prepare-assets`), so `dev` works before a package build.
 */
import { copyFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'

const require = createRequire(import.meta.url)
const dest = 'public/a2ui/v1/catalog.json'

try {
  const src = require.resolve('@meldui/a2ui/catalog')
  await mkdir(dirname(dest), { recursive: true })
  await copyFile(src, dest)
  console.log(`[docs] copied A2UI catalog → ${dest}`)
} catch (e) {
  console.warn('[docs] could not copy A2UI catalog:', (e as Error).message)
  process.exit(0)
}
