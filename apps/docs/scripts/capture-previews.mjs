// Captures a static preview image for every component listed in the catalog
// overview pages. It reads the catalog cards as the source of truth, then visits
// each component's real doc page and screenshots its first rendered demo (the
// `[data-demo-example]` pane in DemoBlock). Output goes to public/previews/<id>.png,
// mirroring the route tree, which is exactly what ComponentCatalog.astro references.
//
// Usage:
//   pnpm --filter docs dev        # in one terminal (serves http://localhost:4321)
//   pnpm --filter docs capture:previews
//
// Optional: BASE_URL=http://localhost:4321 to point at a different server.

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = (process.env.BASE_URL ?? 'http://localhost:4321').replace(/\/$/, '')
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'previews')

const CATALOG_PAGES = ['/docs/components', '/docs/charts', '/docs/a2ui/components']

// Some catalog pages link to an overview that only shows code (no live demo). Point
// those at a sub-page that renders the component through DemoBlock instead. The
// captured image is still saved under the catalog id (key), so the card resolves it.
const CAPTURE_OVERRIDES = {
  'data-table': '/docs/data-table/basic',
}

// Optional ONLY=id1,id2 to (re)capture just a subset.
const ONLY = (process.env.ONLY ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// Extra settle time (ms) after the demo renders, before screenshotting. Charts
// animate and the PDF viewer needs time to rasterize, so give them more.
function settleFor(id) {
  if (id.startsWith('document-viewer')) return 4000
  if (id.startsWith('charts/')) return 1600
  return 900
}

async function collectCards(page) {
  const seen = new Map() // id -> href
  for (const path of CATALOG_PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'load' })
    const hrefs = await page.$$eval('a[data-card]', (els) =>
      els.map((el) => el.getAttribute('href')).filter(Boolean),
    )
    for (const href of hrefs) {
      const id = href.replace(/^\/docs\//, '').replace(/\/$/, '')
      if (!seen.has(id)) seen.set(id, href)
    }
  }
  return seen
}

async function capture(page, id, href) {
  const visit = CAPTURE_OVERRIDES[id] ?? href
  await page.goto(`${BASE}${visit}`, { waitUntil: 'load' })

  // The Astro dev toolbar is fixed at the viewport bottom and leaks into element
  // screenshots of taller components. Hide it (and any toast layer) before shooting.
  await page.addStyleTag({
    content: 'astro-dev-toolbar,#vue-sonner-toaster{display:none!important}',
  })

  // Demos are `client:only="vue"` islands — wait until the first example pane has
  // hydrated and actually has rendered content with a real height.
  await page.waitForFunction(
    () => {
      const el = document.querySelector('[data-demo-example]')
      return !!el && el.children.length > 0 && el.getBoundingClientRect().height > 24
    },
    { timeout: 20000 },
  )

  await page.waitForTimeout(settleFor(id))

  // Prefer the demo's own content (tight bounding box) over the padded, centered
  // pane so narrow components fill the card instead of floating in whitespace.
  // Fall back to the pane if the inner content has no real size.
  const inner = page.locator('[data-demo-example] > *').first()
  const innerBox = await inner.boundingBox().catch(() => null)
  const el =
    innerBox && innerBox.width > 16 && innerBox.height > 16
      ? inner
      : page.locator('[data-demo-example]').first()
  const outPath = join(OUT_DIR, `${id}.png`)
  await mkdir(dirname(outPath), { recursive: true })
  await el.screenshot({ path: outPath })
  return outPath
}

async function main() {
  // Playwright's bundled Chromium has no prebuilt for some newer Linux distros,
  // so default to the system Chrome via the `chrome` channel. Override with
  // PLAYWRIGHT_CHANNEL (e.g. "msedge") or PLAYWRIGHT_EXECUTABLE_PATH.
  const launchOpts = process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : { channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' }
  const browser = await chromium.launch(launchOpts)
  const page = await browser.newPage({
    viewport: {
      width: Number(process.env.CAP_WIDTH ?? 640),
      height: Number(process.env.CAP_HEIGHT ?? 900),
    },
    deviceScaleFactor: 2,
  })

  let cards = await collectCards(page)
  if (ONLY.length) cards = new Map([...cards].filter(([id]) => ONLY.includes(id)))
  console.log(`[capture] ${cards.size} components across ${CATALOG_PAGES.length} catalog pages`)

  let ok = 0
  const failed = []
  for (const [id, href] of cards) {
    try {
      await capture(page, id, href)
      ok++
      process.stdout.write(`  ✓ ${id}\n`)
    } catch (err) {
      failed.push(id)
      process.stdout.write(`  ✗ ${id} — ${err.message.split('\n')[0]}\n`)
    }
  }

  await browser.close()
  console.log(`\n[capture] done: ${ok} captured, ${failed.length} failed`)
  if (failed.length) {
    console.log('[capture] failed ids:\n  ' + failed.join('\n  '))
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
