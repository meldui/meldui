/**
 * Concise re-exports of web_core's common-type Zod schemas plus a `meldApi`
 * helper, so MeldUI-specific catalog components can declare their props tersely.
 * The binder uses these to classify each prop (DYNAMIC / ACTION / STRUCTURAL).
 */
import { z } from 'zod'
import {
  ActionSchema,
  ChildListSchema,
  ComponentIdSchema,
  DataBindingSchema,
  DynamicBooleanSchema,
  DynamicNumberSchema,
  DynamicStringListSchema,
  DynamicStringSchema,
} from '@a2ui/web_core/v0_9'
import type { ComponentApi } from '@a2ui/web_core/v0_9'

export const a2 = {
  str: DynamicStringSchema,
  num: DynamicNumberSchema,
  bool: DynamicBooleanSchema,
  strList: DynamicStringListSchema,
  childList: ChildListSchema,
  componentId: ComponentIdSchema,
  action: ActionSchema,
  dataBinding: DataBindingSchema,
}

/** Build a `ComponentApi` for a MeldUI-specific component from a Zod prop shape. */
export function meldApi(name: string, shape: z.ZodRawShape): ComponentApi {
  return { name, schema: z.object(shape) }
}

export { z }
