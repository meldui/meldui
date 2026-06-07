import { defineComponent, h, inject, onScopeDispose, shallowRef } from 'vue'
import type { SurfaceModel } from '@a2ui/web_core/v0_9'
import { A2UI_CONTEXT } from './keys'
import { DeferredChild } from './DeferredChild'
import type { VueComponentApi } from './types'

/**
 * Mounts an A2UI surface by id and renders its `root` component. The surface
 * may not exist yet when this mounts (it arrives via a streamed `createSurface`
 * message); it resolves reactively as surfaces are created/deleted.
 */
export const A2UISurface = defineComponent({
  name: 'A2UISurface',
  props: {
    surfaceId: { type: String, required: true },
  },
  setup(props) {
    const ctx = inject(A2UI_CONTEXT)
    if (!ctx) {
      throw new Error(
        '[a2ui] <A2UISurface> must be used within a component that called provideA2UI().',
      )
    }
    const { processor } = ctx
    const surface = shallowRef<SurfaceModel<VueComponentApi> | undefined>(
      processor.model.getSurface(props.surfaceId),
    )
    const subs = [
      processor.onSurfaceCreated((s) => {
        if (s.id === props.surfaceId) surface.value = s
      }),
      processor.onSurfaceDeleted((id) => {
        if (id === props.surfaceId) surface.value = undefined
      }),
    ]
    onScopeDispose(() => subs.forEach((s) => s.unsubscribe()))

    return () =>
      surface.value
        ? h(DeferredChild, {
            key: surface.value.id,
            surface: surface.value,
            id: 'root',
            basePath: '/',
          })
        : null
  },
})

export default A2UISurface
