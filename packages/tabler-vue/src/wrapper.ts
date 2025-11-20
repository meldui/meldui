import { type Component, defineComponent, h } from 'vue'
import { ICON_DEFAULTS } from './defaults'

/**
 * Wraps a Tabler icon component with MeldUI defaults.
 *
 * This wrapper:
 * - Applies default size and strokeWidth from ICON_DEFAULTS
 * - Allows props to override defaults
 * - Integrates with CSS variables for theming (--icon-color)
 * - Preserves all original icon functionality
 *
 * @param OriginalIcon - The original Tabler icon component
 * @returns A wrapped component with MeldUI defaults
 */
export function createIcon(OriginalIcon: Component) {
  return defineComponent({
    name: OriginalIcon.name || 'Icon',
    props: {
      size: {
        type: Number,
        default: ICON_DEFAULTS.size,
      },
      strokeWidth: {
        type: Number,
        default: ICON_DEFAULTS.strokeWidth,
      },
      color: {
        type: String,
        default: undefined,
      },
    },
    setup(props, { attrs }) {
      return () =>
        h(OriginalIcon, {
          ...props,
          style: {
            color: props.color ?? 'var(--icon-color, currentColor)',
            ...(attrs.style as any),
          },
          ...attrs,
        })
    },
  })
}
