/**
 * Default configuration for all MeldUI icons.
 * These values can be overridden per-instance via props.
 */
export const ICON_DEFAULTS = {
  size: 24, // 24px base size
  strokeWidth: 1.5, // Medium stroke weight
} as const

export type IconDefaults = typeof ICON_DEFAULTS
