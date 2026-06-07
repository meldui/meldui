/**
 * Renders a human-readable Markdown reference for the catalog, derived from the
 * same component definitions that produce `meldui-v1.catalog.json` (single
 * source of truth). The docs site wraps this with frontmatter; keeping the
 * logic here means the package documents itself and the reference never drifts
 * from the contract.
 */
import { A2UI_VERSION, CATALOG_ID } from './constants'
import { basicComponents, richComponents, structuralComponents } from './catalog/index'
import functionsSchema from './catalog/functions.json'
import themeSchema from './catalog/theme-schema.json'
import type { ComponentDef, ComponentDefs, JSONSchema } from './types'

/** Escapes a value for safe use inside an MDX Markdown table cell. */
function cell(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/[{}]/g, (m) => (m === '{' ? '&#123;' : '&#125;'))
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, ' ')
    .trim()
}

/** A short, readable type label for a property schema. */
function typeLabel(schema: JSONSchema): string {
  if (typeof schema.$ref === 'string') {
    const seg = schema.$ref.split('/').pop()
    return seg ?? 'unknown'
  }
  if (Array.isArray(schema.enum)) return 'enum'
  if (Array.isArray(schema.oneOf)) return 'oneOf'
  if (Array.isArray(schema.allOf))
    return (schema.allOf as JSONSchema[]).map(typeLabel).find((t) => t !== 'unknown') ?? 'object'
  if (typeof schema.type === 'string') return schema.type
  return 'object'
}

/** Builds the Description cell, appending enum values and defaults. */
function describe(schema: JSONSchema): string {
  const parts: string[] = []
  if (typeof schema.description === 'string') parts.push(schema.description)
  if (Array.isArray(schema.enum)) {
    parts.push(`One of: ${schema.enum.map((v) => `\`${String(v)}\``).join(', ')}.`)
  }
  if (schema.default !== undefined) parts.push(`Default: \`${String(schema.default)}\`.`)
  return parts.join(' ')
}

function renderComponent(name: string, def: ComponentDef): string {
  const required = new Set(def.required ?? [])
  const lines: string[] = [`#### ${name}`, '']
  if (def.description) lines.push(`${def.description}`, '')

  const props = Object.entries(def.properties)
  if (props.length > 0) {
    lines.push('| Prop | Type | Required | Description |', '| --- | --- | --- | --- |')
    for (const [prop, schema] of props) {
      lines.push(
        `| \`${prop}\` | \`${typeLabel(schema)}\` | ${required.has(prop) ? 'yes' : 'no'} | ${cell(describe(schema))} |`,
      )
    }
    lines.push('')
  }
  if (def.checkable) {
    lines.push('Accepts client-side validation `checks` (A2UI `Checkable`).', '')
  }
  return lines.join('\n')
}

function renderGroup(title: string, defs: ComponentDefs): string {
  const lines = [`### ${title}`, '']
  for (const [name, def] of Object.entries(defs)) lines.push(renderComponent(name, def))
  return lines.join('\n')
}

/** Renders the full catalog reference as a Markdown string (no frontmatter). */
export function renderCatalogMarkdown(): string {
  const functions = functionsSchema as Record<string, JSONSchema>
  const theme = themeSchema as JSONSchema
  const componentCount =
    Object.keys(basicComponents).length +
    Object.keys(structuralComponents).length +
    Object.keys(richComponents).length

  const out: string[] = [
    '> Auto-generated from the catalog definitions. Do not edit by hand — run `pnpm --filter docs generate-a2ui-reference`.',
    '',
    '## Catalog',
    '',
    `- **Catalog ID:** \`${CATALOG_ID}\``,
    `- **A2UI version:** \`${A2UI_VERSION}\``,
    `- **Components:** ${componentCount} · **Functions:** ${Object.keys(functions).length}`,
    '',
    'All components below are advertised under a single `catalogId`. The groups are an authoring/reliability grouping, not separate catalogs.',
    '',
    '## Components',
    '',
    renderGroup('Basic primitives', basicComponents),
    renderGroup('Structural & display', structuralComponents),
    renderGroup('Rich', richComponents),
    '## Functions',
    '',
    'A2UI functions available for data bindings and validation `checks`.',
    '',
    '| Function | Description |',
    '| --- | --- |',
    ...Object.entries(functions).map(
      ([name, fn]) => `| \`${name}\` | ${cell((fn.description as string) ?? '')} |`,
    ),
    '',
    '## Theme',
    '',
    'Theme tokens an agent may set on `createSurface` (renderer maps these onto MeldUI design tokens).',
    '',
    '| Token | Type | Description |',
    '| --- | --- | --- |',
    ...Object.entries((theme.properties as Record<string, JSONSchema>) ?? {}).map(
      ([token, schema]) =>
        `| \`${token}\` | \`${typeLabel(schema)}\` | ${cell((schema.description as string) ?? '')} |`,
    ),
    '',
  ]
  return out.join('\n')
}
