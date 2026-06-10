// Captures a static preview image for every component in the catalog. The component
// list is derived from the local content collection (the same selection
// ComponentCatalog.astro uses), then each component's doc page is visited and its first
// rendered demo (the DemoBlock "Example" pane) is shrunk to fit its content, centered, and
// screenshotted as a transparent PNG. Output goes to public/previews/<id>.png, mirroring
// the route tree, which is exactly what ComponentCatalog.astro references.
//
// This is a dev-only maintenance tool: it is not part of `dev`/`build` (those serve the
// committed PNGs). Re-run it to refresh previews after a component's look changes.
//
// Source defaults to the deployed site (no local server needed); override with BASE_URL.
//
// Usage:
//   pnpm --filter docs capture:previews
//   BASE_URL=http://localhost:4321 pnpm --filter docs capture:previews   # local instead

import { chromium } from 'playwright'
import { mkdir, readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_DIR = join(ROOT, 'src', 'content', 'docs')
const OUT_DIR = join(ROOT, 'public', 'previews')

// a2ui slugs that reuse their Vue counterpart's preview image (shared with
// ComponentCatalog.astro). These aren't captured from the a2ui surface — the card points
// at the Vue image instead — so skip them here to avoid generating dead PNGs.
const a2uiPreviewMap = JSON.parse(
  await readFile(join(ROOT, 'src', 'data', 'a2ui-preview-map.json'), 'utf8'),
)

const BASE = (process.env.BASE_URL ?? 'https://meldui.dipayanb.com').replace(/\/$/, '')

// Captured at 1:1 (deviceScaleFactor 1), so a PNG pixel == a CSS pixel. Combined with the
// fit-content shrink below, every preview shows text at the same physical size, and the
// card displays each image centered at its natural size (capped to the card width).
const DSF = Number(process.env.CAP_DSF ?? 1)

// Some catalog pages link to an overview that only shows code (no live demo). Point
// those at a sub-page that renders the component through DemoBlock instead. The
// captured image is still saved under the catalog id (key), so the card resolves it.
const CAPTURE_OVERRIDES = {
  'data-table': '/docs/data-table/basic',
}

// Components whose demo is a fixed-width / multi-pane layout (resizable panels, a sidebar
// shell, a scroll box, a dropzone, a carousel viewport). Shrinking these to fit-content
// squishes the layout to its min-content, so capture them at their natural width instead —
// like charts/data-table. (Content-sized components — accordion, card, inputs… — still get
// the fit-content centering.)
const NATURAL_WIDTH_IDS = new Set([
  'components/resizable',
  'components/sidebar',
  'components/scroll-area',
  'components/context-menu',
  'components/carousel',
  'components/aspect-ratio',
  'components/command',
  'components/card',
  'composites/filters',
  // Its own width is tight (max-w-max ~287px); fit-content instead exposes max-content,
  // which includes the hidden w-[400px] dropdown panels and inflates it to ~480px (small
  // font). Capturing natural keeps the font on par with breadcrumb.
  'components/navigation-menu',
])

// Tall previews (a many-row table, a full document viewer, a filter/command/pagination demo
// with sample content) get height-shrunk by the card's fixed-height image area, so they render
// small with empty sides. Crop these to the card's landscape aspect (~CARD_ASPECT) so they
// fill the card width and read larger. `anchor:'bottom'` keeps the meaningful part in frame —
// e.g. the data-pagination toolbar sits below its sample article grid.
const CARD_ASPECT = 2.4
const CROP_LANDSCAPE = {
  'data-table': {},
  'document-viewer': {},
  'composites/filters': {},
  'components/command': {},
  'components/data-pagination': { anchor: 'bottom' },
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

// --- Component list, derived from local content (no overview page scraping) ---

async function walkMdx(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walkMdx(full)))
    else if (entry.name.endsWith('.mdx')) out.push(full)
  }
  return out
}

// Minimal frontmatter reader for the flat scalar fields we need.
function readFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fm = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return fm
}

// Mirror ComponentCatalog.astro's selectors. Returns Map<id, { href }>.
async function collectComponents() {
  const files = await walkMdx(CONTENT_DIR)
  const seen = new Map()
  for (const file of files) {
    const fm = readFrontmatter(await readFile(file, 'utf8'))
    const id = relative(CONTENT_DIR, file)
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '')
      .replaceAll('\\', '/')
    const isVue = !!fm.componentName && fm.package === '@meldui/vue'
    const isChart = fm.package === '@meldui/charts-vue'
    const a2uiPrefix = 'a2ui/components/'
    // Skip a2ui slugs that borrow a Vue preview image — they need no capture of their own.
    const isA2ui = id.startsWith(a2uiPrefix) && !a2uiPreviewMap[id.slice(a2uiPrefix.length)]
    if (isVue || isChart || isA2ui) seen.set(id, { href: `/docs/${id}` })
  }
  return seen
}

// The DemoBlock "Example" pane. Locally it carries [data-demo-example]; on the deployed
// site it's the first active tab panel's inner wrapper — both resolve to the same
// `div.flex.min-h-[120px].items-center.justify-center`.
const EXAMPLE_SEL = '[data-demo-example], [role="tabpanel"][data-state="active"] > div'

// The example pane's direct children — the demo's own content, our tight capture target.
const INNER_SEL = EXAMPLE_SEL.split(', ')
  .map((s) => `${s} > *`)
  .join(', ')

async function capture(page, id, href) {
  const visit = CAPTURE_OVERRIDES[id] ?? href
  await page.goto(`${BASE}${visit}`, { waitUntil: 'load' })

  // Make backgrounds transparent so the card shows through and the image blends.
  await page.addStyleTag({
    content: `
      html,body,.docs-prose,[role="tabpanel"]{background:transparent !important}
      astro-dev-toolbar,#vue-sonner-toaster{display:none !important}
    `,
  })

  // Wait for the example to render (client:only island → real content with a real height).
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel)
      return !!el && el.children.length > 0 && el.getBoundingClientRect().height > 24
    },
    EXAMPLE_SEL,
    { timeout: 20000 },
  )

  // Fonts must be applied before shooting, else text metrics differ.
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(settleFor(id))

  // Shoot the demo's own content (tight bounding box) transparent, so the card can show it
  // at natural size. Fall back to the example pane if the inner content has no real size.
  const inner = page.locator(INNER_SEL).first()
  const innerBox = await inner.boundingBox().catch(() => null)
  const el =
    innerBox && innerBox.width > 12 && innerBox.height > 12
      ? inner
      : page.locator(EXAMPLE_SEL).first()

  // Many demos render full-width and left-align their content, so a tight-bbox capture came
  // out wide with the content hugging the left — small and off-center once displayed. Shrink
  // the captured element to fit its content (capped) and center it, so previews read
  // consistently: content centered in the card, text at full size.
  // Charts, the data-table grid, document-viewer, and the fixed-width layout components are
  // wide, layout-driven previews that shouldn't be shrunk — capture them at natural width.
  const TRANSFORM =
    !id.startsWith('charts/') &&
    !id.startsWith('document-viewer') &&
    id !== 'data-table' &&
    !NATURAL_WIDTH_IDS.has(id)
  if (TRANSFORM) {
    await el.evaluate((node) => {
      node.style.width = 'fit-content'
      node.style.maxWidth = '30rem'
      node.style.marginInline = 'auto'
    })
    // Width-driven controls (slider, progress, skeleton…) have no intrinsic width and
    // collapse to ~0 under fit-content. Detect that and give them a sensible fixed width.
    const box = await el.boundingBox().catch(() => null)
    if (!box || box.width < 48) {
      await el.evaluate((node) => {
        node.style.width = '18rem'
      })
    }
  }

  const outPath = join(OUT_DIR, `${id}.png`)
  await mkdir(dirname(outPath), { recursive: true })

  // Crop tall previews to a landscape slice (anchored top, or bottom for pagination) so they
  // fill the card width instead of shrinking; everything else is captured at its full box.
  const crop = CROP_LANDSCAPE[id]
  const box = crop ? await el.boundingBox().catch(() => null) : null
  if (crop && box) {
    const h = Math.min(box.height, Math.round(box.width / CARD_ASPECT))
    const y = crop.anchor === 'bottom' ? box.y + box.height - h : box.y
    await page.screenshot({
      path: outPath,
      omitBackground: true,
      fullPage: true,
      clip: { x: box.x, y, width: box.width, height: h },
    })
  } else {
    await el.screenshot({ path: outPath, omitBackground: true })
  }
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
      width: Number(process.env.CAP_WIDTH ?? 1280),
      height: Number(process.env.CAP_HEIGHT ?? 900),
    },
    deviceScaleFactor: DSF,
  })

  let cards = await collectComponents()
  if (ONLY.length) cards = new Map([...cards].filter(([id]) => ONLY.includes(id)))
  console.log(`[capture] ${cards.size} components from ${BASE}`)

  let ok = 0
  const failed = []
  for (const [id, { href }] of cards) {
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
