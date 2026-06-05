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
  },
  setup(props) {
    const node = useA2uiNode(props.surface, props.id, props.basePath)
    return () => {
      if (node.status.value === 'loading') {
        return h('span', { 'data-a2ui-loading': props.id, style: 'opacity:0.5' }, '')
      }
      if (node.status.value === 'unknown') {
        return h(
          'div',
          { 'data-a2ui-unknown': node.type.value, style: 'color:var(--destructive,#dc2626)' },
          `Unknown A2UI component: ${node.type.value}`,
        )
      }
      return h(node.api.value!.render, { p: node.props.value, context: node.context.value })
    }
  },
})

export default DeferredChild
