/**
 * Single source of truth for catalog identity and the targeted A2UI spec
 * version. Referenced by the catalog builder, the codegen script, and any
 * future renderer so a version bump is a one-line change.
 */

/** The A2UI specification version this catalog targets. */
export const A2UI_VERSION = 'v0.9' as const

/**
 * Stable, versioned identifier for the MeldUI catalog. Agents negotiate by
 * this id (see `supportedCatalogIds`); a future incompatible revision must use
 * a new versioned id (e.g. `.../v2/catalog.json`) rather than mutating this.
 *
 * NOTE: this URI is the catalog's identity for negotiation. Making it
 * physically resolvable (canonical hosting) is tracked as an open item; the
 * artifact is also shipped in-package via the `@meldui/a2ui/catalog` export.
 */
export const CATALOG_ID = 'https://meldui.dev/catalogs/vue/v1/catalog.json' as const

/**
 * Base URI of the A2UI common types schema. The MeldUI catalog reuses these
 * shared `$defs` (DynamicString, ChildList, ComponentId, Checkable, Action, …)
 * exactly as the official A2UI Basic catalog does, so MeldUI components are
 * structurally interoperable with the wider A2UI ecosystem.
 */
export const COMMON_TYPES_URI = 'https://a2ui.org/specification/v0_9/common_types.json' as const
