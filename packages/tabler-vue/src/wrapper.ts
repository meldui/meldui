import { type Component, defineComponent, h } from 'vue'
import { ICON_DEFAULTS } from './defaults'

/**
 * Wraps a Tabler icon component with MeldUI defaults.
 *
 * This wrapper:
 * - Applies default size and stroke from ICON_DEFAULTS
 * - Allows props to override defaults
 * - Preserves all original icon functionality
 *
 * Color is controlled via CSS inheritance (currentColor), so use
 * Tailwind classes on the parent: <span class="text-red-500"><IconX /></span>
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
      stroke: {
        type: Number,
        default: ICON_DEFAULTS.stroke,
      },
    },
    setup(props, { attrs }) {
      return () => h(OriginalIcon, { ...props, ...attrs })
    },
  })
}
