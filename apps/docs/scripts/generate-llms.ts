/**
 * Generate llms.txt and llms-full.txt from MDX content files
 *
 * Run: npx tsx scripts/generate-llms.ts
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const CONTENT_DIR = join(import.meta.dirname, '../src/content/docs')
const PUBLIC_DIR = join(import.meta.dirname, '../public')

interface PageInfo {
  title: string
  description: string
  category: string
  path: string
  props?: { name: string; type: string; default?: string; description: string }[]
  events?: { name: string; payload: string; description: string }[]
  slots?: { name: string; description: string }[]
  content: string
}

function parseFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const yaml = match[1]
  const result: Record<string, any> = {}

  // Simple YAML parser for our frontmatter
  let currentKey = ''
  let currentArray: any[] | null = null

  for (const line of yaml.split('\n')) {
    const keyMatch = line.match(/^(\w+):\s*(.*)$/)
    if (keyMatch && !line.startsWith('  ')) {
      if (currentArray && currentKey) {
        result[currentKey] = currentArray
      }
      currentKey = keyMatch[1]
      const value = keyMatch[2].trim()
      if (value === '') {
        currentArray = null
      } else if (value.startsWith("'") || value.startsWith('"')) {
        result[currentKey] = value.replace(/^['"]|['"]$/g, '')
        currentArray = null
      } else if (value === 'true' || value === 'false') {
        result[currentKey] = value === 'true'
        currentArray = null
      } else if (!isNaN(Number(value))) {
        result[currentKey] = Number(value)
        currentArray = null
      } else {
        result[currentKey] = value
        currentArray = null
      }
    } else if (line.trim().startsWith('- name:')) {
      if (!currentArray) currentArray = []
      currentArray.push({ name: line.trim().replace('- name: ', '') })
    } else if (line.trim().startsWith('type:') && currentArray?.length) {
      currentArray[currentArray.length - 1].type = line
        .trim()
        .replace('type: ', '')
        .replace(/^['"]|['"]$/g, '')
    } else if (line.trim().startsWith('description:') && currentArray?.length) {
      currentArray[currentArray.length - 1].description = line.trim().replace('description: ', '')
    } else if (line.trim().startsWith('default:') && currentArray?.length) {
      currentArray[currentArray.length - 1].default = line
        .trim()
        .replace('default: ', '')
        .replace(/^['"]|['"]$/g, '')
    } else if (line.trim().startsWith('payload:') && currentArray?.length) {
      currentArray[currentArray.length - 1].payload = line.trim().replace('payload: ', '')
    }
  }
  if (currentArray && currentKey) {
    result[currentKey] = currentArray
  }

  return result
}

function getBodyContent(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/)
  if (!match) return ''
  // Remove import lines and component tags
  return match[1]
    .replace(/^import\s+.*$/gm, '')
    .replace(/<\w+Demo[^/]*\/>/g, '')
    .replace(/<\w+Demo[^>]*>[\s\S]*?<\/\w+Demo>/g, '')
    .replace(/client:only="vue"/g, '')
    .trim()
}

function walkDir(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...walkDir(full))
    } else if (entry.endsWith('.mdx')) {
      files.push(full)
    }
  }
  return files
}

function fileToUrlPath(filePath: string): string {
  let rel = relative(CONTENT_DIR, filePath)
    .replace(/\.mdx$/, '')
    .replace(/index$/, '')
    .replace(/\/$/, '')
  return `/docs/${rel}`
}

// Collect all pages
const pages: PageInfo[] = []

for (const file of walkDir(CONTENT_DIR)) {
  const content = readFileSync(file, 'utf-8')
  const fm = parseFrontmatter(content)
  if (!fm.title) continue

  pages.push({
    title: fm.title,
    description: fm.description || '',
    category: fm.category || '',
    path: fileToUrlPath(file),
    props: fm.props,
    events: fm.events,
    slots: fm.slots,
    content: getBodyContent(content),
  })
}

// Sort by category then title
pages.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))

// Generate llms.txt (summary)
const llmsTxt = `# MeldUI

> A Vue 3 component library built on shadcn-vue with Tailwind CSS v4, providing consistent and beautiful UI components.

MeldUI is a design system monorepo that re-exports and customizes shadcn components. It consists of three packages: \`@meldui/vue\` for UI components, \`@meldui/tabler-vue\` for icons, and \`@meldui/charts-vue\` for data visualization. Uses Tailwind CSS v4 (NOT v3) with CSS-first configuration.

## Critical: Common Mistakes

1. **Using Tailwind CSS v3 syntax** - Do NOT create \`tailwind.config.js\`. Use CSS-first config with \`@import "tailwindcss"\`
2. **Wrong icon imports** - Icons are in \`@meldui/tabler-vue\`, NOT \`@meldui/vue\`
3. **Wrong chart imports** - Charts are in \`@meldui/charts-vue\`, NOT \`@meldui/vue\`
4. **Missing theme import** - Must import \`@meldui/vue/themes/default\` in your CSS
5. **Missing Tailwind source directive** - Add \`@source "../node_modules/@meldui/vue/dist/*.mjs";\`

## Packages

- [@meldui/vue](${pages.find((p) => p.path.includes('installation'))?.path || '/docs/getting-started/installation'}): Core UI components
- [@meldui/tabler-vue](${pages.find((p) => p.path.includes('icons'))?.path || '/docs/getting-started/icons'}): 5000+ Tabler icons with custom defaults
- [@meldui/charts-vue](${pages.find((p) => p.path.includes('charts/installation'))?.path || '/docs/charts/installation'}): Apache ECharts components

## Pages

${pages.map((p) => `- [${p.title}](${p.path}): ${p.description}`).join('\n')}
`

writeFileSync(join(PUBLIC_DIR, 'llms.txt'), llmsTxt)
console.log(`Generated llms.txt (${pages.length} pages)`)

// Generate llms-full.txt (full API docs)
let llmsFullTxt = llmsTxt + '\n---\n\n# Full API Reference\n\n'

for (const page of pages) {
  llmsFullTxt += `## ${page.title}\n\n`
  if (page.description) llmsFullTxt += `${page.description}\n\n`

  if (page.props?.length) {
    llmsFullTxt += '### Props\n\n'
    llmsFullTxt +=
      '| Prop | Type | Default | Description |\n|------|------|---------|-------------|\n'
    for (const prop of page.props) {
      llmsFullTxt += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.default ? `\`${prop.default}\`` : '-'} | ${prop.description} |\n`
    }
    llmsFullTxt += '\n'
  }

  if (page.events?.length) {
    llmsFullTxt += '### Events\n\n'
    llmsFullTxt += '| Event | Payload | Description |\n|-------|---------|-------------|\n'
    for (const event of page.events) {
      llmsFullTxt += `| \`${event.name}\` | \`${event.payload}\` | ${event.description} |\n`
    }
    llmsFullTxt += '\n'
  }

  if (page.slots?.length) {
    llmsFullTxt += '### Slots\n\n'
    llmsFullTxt += '| Slot | Description |\n|------|-------------|\n'
    for (const slot of page.slots) {
      llmsFullTxt += `| \`${slot.name}\` | ${slot.description} |\n`
    }
    llmsFullTxt += '\n'
  }

  // Include markdown content (tables, sub-components, etc.)
  if (page.content) {
    llmsFullTxt += page.content + '\n\n'
  }

  llmsFullTxt += '---\n\n'
}

writeFileSync(join(PUBLIC_DIR, 'llms-full.txt'), llmsFullTxt)
console.log(`Generated llms-full.txt (${Math.round(llmsFullTxt.length / 1024)}KB)`)
