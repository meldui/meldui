/**
 * Generates the A2UI catalog reference MDX page from @meldui/a2ui's catalog
 * definitions (single source of truth). Run via `pnpm generate-a2ui-reference`
 * (also part of the docs `build`). The output is committed so it is browseable
 * and diffable, and regenerated whenever the catalog changes.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { renderCatalogMarkdown } from '@meldui/a2ui'

const OUT = join(import.meta.dirname, '../src/content/docs/a2ui/reference.mdx')

const frontmatter = `---
title: Catalog Reference
description: The components, functions, and theme tokens in the MeldUI A2UI catalog, generated from the contract.
category: a2ui
package: '@meldui/a2ui'
order: 2
---

`

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, frontmatter + renderCatalogMarkdown(), 'utf-8')
console.log(`✅ Generated A2UI catalog reference → ${OUT}`)
