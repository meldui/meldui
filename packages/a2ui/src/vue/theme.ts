/**
 * Default A2UI theme for MeldUI surfaces.
 *
 * MeldUI render components already consume MeldUI's OKLCH design tokens through
 * their Tailwind classes (consumers import `@meldui/vue/themes/default`), so a
 * surface inherits MeldUI light/dark automatically. This object is the seam for
 * bridging agent-supplied A2UI theme tokens (`primaryColor`, `iconUrl`,
 * `agentDisplayName`) onto CSS variables — fleshed out alongside the full
 * component catalog.
 */
export const meldTheme = {} as const

export type MeldTheme = typeof meldTheme
