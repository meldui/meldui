import { defineComponent, h, type PropType } from 'vue'
import type { SurfaceModel } from '@a2ui/web_core/v0_9'
import type { VueComponentApi } from './types'
import { useA2uiNode } from './useA2uiNode'

/**
 * The recursive, lazy rendering host. Resolves one component by id from the
 * surface on demand (no eager tree materialization), renders its mapped MeldUI
 * component, and degrades gracefully while a component is streaming in or if
 * its type is unknown. Layout/container components render their children by
 * mounting more `DeferredChild`s.
 */
export const DeferredChild = defineComponent({
  name: 'A2uiDeferredChild',
  props: {
    surface: { type: Object as PropType<SurfaceModel<VueComponentApi>>, required: true },
    id: { type: String, required: true },
    basePath: { type: String, default: '/' },
    /**
     * Set by flex containers (Row/Column) so a child's `weight` prop is honored
     * as `flex-grow`. Per the catalog, `weight` ONLY applies to direct Row/Column
     * descendants, so every other parent leaves this false and weight is ignored.
     */
    weighted: { type: Boolean, default: false },
  },
  setup(props) {
    const node = useA2uiNode(props.surface, props.id, props.basePath)
    return () => {
      let vnode: ReturnType<typeof h>
      if (node.status.value === 'loading') {
        vnode = h('span', { 'data-a2ui-loading': props.id, style: 'opacity:0.5' }, '')
      } else if (node.status.value === 'unknown') {
        vnode = h(
          'div',
          { 'data-a2ui-unknown': node.type.value, style: 'color:var(--destructive,#dc2626)' },
          `Unknown A2UI component: ${node.type.value}`,
        )
      } else {
        vnode = h(node.api.value!.render, { p: node.props.value, context: node.context.value })
      }

      // `weight` (flex-grow hint) is passed through by the binder as a static prop.
      // Wrap weighted children in a flex item with a zero basis so siblings share
      // the main-axis space proportionally (weight 1/1/1 → three equal columns).
      const weight = node.props.value?.weight
      if (props.weighted && typeof weight === 'number' && weight > 0) {
        return h(
          'div',
          {
            'data-a2ui-weight': weight,
            style: { flexGrow: String(weight), flexShrink: '1', flexBasis: '0%', minWidth: '0' },
          },
          [vnode],
        )
      }
      return vnode
    }
  },
})

export default DeferredChild
