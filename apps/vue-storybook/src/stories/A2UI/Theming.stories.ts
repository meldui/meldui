/**
 * A2UI theming stories. MeldUI uses semantic theming: the *consuming app* owns
 * the look, the agent only describes structure. These stories demonstrate the
 * two seams an app uses to style rendered surfaces — without the agent changing:
 *
 *  1. Token override — set MeldUI CSS variables (`--primary`, `--radius`, …) on
 *     a container around `<A2UISurface>`; every component inside inherits them.
 *  2. Component restyle — target the per-component `data-a2ui="<Name>"` attribute
 *     to restyle one component type (here: give the Table borders, a header
 *     background, and taller rows).
 */
import { defineComponent, h, onMounted } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { type A2uiExampleMessage, examples } from '@meldui/a2ui'
import { A2UISurface, provideA2UI } from '@meldui/a2ui/vue'
import { liveWithCode } from './_a2ui'

const meta: Meta = {
  title: 'A2UI/Theming',
}
export default meta
type Story = StoryObj

// Prefix every selector in a flat CSS string with `.scope ` so the rules only
// apply inside this panel — otherwise a global `[data-a2ui="Table"]` rule would
// also restyle the "default" panel rendered alongside it.
function scopeCss(css: string, scope: string): string {
  return css.replace(/([^{}]+)\{([^}]*)\}/g, (_m, sel: string, body: string) => {
    const scoped = sel
      .split(',')
      .map((s) => `.${scope} ${s.trim()}`)
      .join(', ')
    return `${scoped} { ${body.trim()} }`
  })
}

let panelUid = 0

/** An isolated A2UI surface (own processor) rendering `messages`, wrapped in a
 *  labelled card. Optional inline `vars` (CSS custom properties) and a scoped
 *  `css` string model what a consuming app would apply around a surface. The
 *  `css` is scoped to this panel so a side-by-side "default" panel is unaffected. */
function surfacePanel(opts: {
  label: string
  messages: A2uiExampleMessage[]
  vars?: Record<string, string>
  css?: string
}) {
  const scope = `a2ui-panel-${(panelUid += 1)}`
  const scopedCss = opts.css ? scopeCss(opts.css, scope) : undefined
  return defineComponent({
    name: 'A2uiThemePanel',
    setup() {
      const { processor } = provideA2UI()
      onMounted(() => processor.processMessages(opts.messages as never))
      return () =>
        h('div', { class: 'flex flex-col gap-2' }, [
          h('div', { class: 'text-xs font-medium text-muted-foreground' }, opts.label),
          h('div', { class: ['rounded-lg border border-border p-4', scope], style: opts.vars }, [
            scopedCss ? h('style', scopedCss) : null,
            h(A2UISurface, { surfaceId: 's1' }),
          ]),
        ])
    },
  })
}

// 1. Token override — same Button messages, MeldUI default vs an app brand.
const BRAND_VARS = { '--primary': '#7c3aed', '--ring': '#7c3aed', '--radius': '1rem' }
const TOKEN_OVERRIDE_CODE = `<!-- The consuming app wraps a surface and overrides MeldUI tokens. -->
<!-- Every rendered component inherits them through the CSS cascade. -->
<div :style="{
  '--primary': '#7c3aed',
  '--ring': '#7c3aed',
  '--radius': '1rem',
}">
  <A2UISurface surface-id="main" />
</div>`

const Default = surfacePanel({ label: 'MeldUI default', messages: examples.Button })
const Branded = surfacePanel({
  label: 'App theme (--primary: #7c3aed, --radius: 1rem)',
  messages: examples.Button,
  vars: BRAND_VARS,
})
const TokenOverrideHost = defineComponent({
  name: 'TokenOverrideHost',
  render: () => h('div', { class: 'flex flex-col gap-6 max-w-2xl' }, [h(Default), h(Branded)]),
})

export const AppThemeOverride: Story = liveWithCode(TokenOverrideHost, [
  { title: 'Host styling (consuming app)', code: TOKEN_OVERRIDE_CODE },
  { title: 'A2UI messages (unchanged)', code: JSON.stringify(examples.Button, null, 2) },
])

// 2. Component restyle — same Table messages, default vs a styled variant.
const TABLE_RESTYLE = `[data-a2ui="Table"] table {
  border: 1px solid var(--border);
  border-radius: 10px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}
[data-a2ui="Table"] thead { background: var(--muted); }
[data-a2ui="Table"] th { font-weight: 600; }
[data-a2ui="Table"] th,
[data-a2ui="Table"] td { padding: 0.875rem 1rem; }
[data-a2ui="Table"] tbody tr:not(:last-child) td { border-bottom: 1px solid var(--border); }`

const PlainTable = surfacePanel({ label: 'MeldUI default Table', messages: examples.Table })
const StyledTable = surfacePanel({
  label: 'App restyle via [data-a2ui="Table"] — border, header bg, taller rows',
  messages: examples.Table,
  css: TABLE_RESTYLE,
})
const RestyleHost = defineComponent({
  name: 'RestyleHost',
  render: () =>
    h('div', { class: 'flex flex-col gap-6 max-w-2xl' }, [h(PlainTable), h(StyledTable)]),
})

export const ComponentRestyle: Story = liveWithCode(RestyleHost, [
  { title: 'Host CSS — targets the data-a2ui attribute', code: TABLE_RESTYLE },
  { title: 'A2UI messages (unchanged)', code: JSON.stringify(examples.Table, null, 2) },
])
