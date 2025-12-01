/**
 * Default configuration for all MeldUI icons.
 * These values can be overridden per-instance via props.
 */
export const ICON_DEFAULTS = {
  size: 24, // 24px base size
  stroke: 1.5, // Stroke weight (Tabler default is 2)
} as const

export type IconDefaults = typeof ICON_DEFAULTS
