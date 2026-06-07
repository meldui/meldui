import { computed, onScopeDispose, shallowRef, watch, type ComputedRef, type Ref } from 'vue'
import { ComponentContext, GenericBinder, type SurfaceModel } from '@a2ui/web_core/v0_9'
import type { VueComponentApi } from './types'

export type A2uiNodeStatus = 'loading' | 'unknown' | 'ready'

export interface A2uiNode {
  status: ComputedRef<A2uiNodeStatus>
  type: ComputedRef<string | undefined>
  api: ComputedRef<VueComponentApi | undefined>
  /** Reactive, fully-resolved prop snapshot from the GenericBinder. */
  props: Ref<Record<string, unknown>>
  context: Ref<ComponentContext | undefined>
}

/**
 * Resolves a single component node by id within a surface and keeps it
 * reactive — fine-grained, matching the official React/Angular renderers:
 *
 * - subscribes to this id's create/delete so the node appears/updates/removes,
 * - builds a `GenericBinder` for the resolved component type and streams its
 *   snapshot into a `shallowRef` (only this node re-renders when its bound data
 *   changes),
 * - disposes the binder and all subscriptions on scope teardown (no leaks).
 */
export function useA2uiNode(
  surface: SurfaceModel<VueComponentApi>,
  id: string,
  basePath: string,
): A2uiNode {
  const version = shallowRef(0)
  const subs = [
    surface.componentsModel.onCreated.subscribe((c) => {
      if (c.id === id) version.value++
    }),
    surface.componentsModel.onDeleted.subscribe((deletedId) => {
      if (deletedId === id) version.value++
    }),
  ]

  const model = computed(() => {
    void version.value
    return surface.componentsModel.get(id)
  })
  const type = computed(() => model.value?.type)
  const api = computed(() =>
    model.value ? surface.catalog.components.get(model.value.type) : undefined,
  )

  const props = shallowRef<Record<string, unknown>>({})
  const context = shallowRef<ComponentContext | undefined>(undefined)
  let binder: GenericBinder<Record<string, unknown>> | undefined
  let binderUnsub: (() => void) | undefined

  function teardownBinder() {
    binderUnsub?.()
    binderUnsub = undefined
    binder?.dispose()
    binder = undefined
  }

  // Rebuild the binder whenever the resolved component (type) changes, e.g. a
  // type replacement on the same id.
  watch(
    () => type.value,
    () => {
      teardownBinder()
      const m = model.value
      const a = api.value
      if (!m || !a) {
        props.value = {}
        context.value = undefined
        return
      }
      const ctx = new ComponentContext(surface, id, basePath)
      const b = new GenericBinder<Record<string, unknown>>(ctx, a.schema)
      context.value = ctx
      props.value = { ...(b.snapshot as Record<string, unknown>) }
      binderUnsub = b.subscribe((next) => {
        props.value = { ...(next as Record<string, unknown>) }
      }).unsubscribe
      binder = b
    },
    { immediate: true },
  )

  const status = computed<A2uiNodeStatus>(() =>
    !model.value ? 'loading' : !api.value ? 'unknown' : 'ready',
  )

  onScopeDispose(() => {
    subs.forEach((s) => s.unsubscribe())
    teardownBinder()
  })

  return { status, type, api, props, context }
}
