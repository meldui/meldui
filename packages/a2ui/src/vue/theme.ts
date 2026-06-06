/**
 * Default A2UI theme for MeldUI surfaces.
 *
 * MeldUI uses **semantic theming**: render components consume MeldUI's OKLCH
 * design tokens (`--primary`, `--primary-foreground`, `--ring`, …) through their
 * Tailwind classes, so a surface inherits the consuming app's (or MeldUI's
 * default) light/dark palette automatically via the CSS cascade — no bridge code.
 * Because every component pairs e.g. `bg-primary` with `text-primary-foreground`,
 * those tokens always stay the matched pair the host app defined.
 *
 * The protocol's optional agent-supplied `theme.primaryColor` is **intentionally
 * not bridged onto CSS variables** (see design D6): the host/MeldUI owns color so
 * surfaces stay visually consistent across any agent. An opt-in per-surface
 * override is deferred to Future Scope — to be added only when a concrete
 * multi-agent-branding need arises. This default stays empty (`{}` = "use MeldUI
 * defaults").
 */
export const meldTheme = {} as const

export type MeldTheme = typeof meldTheme
