import { provide } from 'vue'
import { MessageProcessor, type A2uiClientAction } from '@a2ui/web_core/v0_9'
import { A2UI_CONTEXT } from './keys'
import { buildVueCatalog } from './catalog'
import type { VueComponentApi } from './types'

/**
 * A handler for client actions (e.g. a button press) to forward to the agent.
 * The `action` carries `name`, `sourceComponentId`, `surfaceId`, and `context`.
 */
export type A2uiActionHandler = (action: A2uiClientAction) => void | Promise<void>

export interface ProvideA2uiOptions {
  /** Override the renderer catalog. Defaults to the full MeldUI Vue catalog. */
  catalog?: VueComponentApi[]
  /** Receives client actions dispatched by interactive components. */
  onAction?: A2uiActionHandler
}

export interface A2uiHandle {
  processor: MessageProcessor<VueComponentApi>
}

/**
 * Sets up the MeldUI A2UI renderer for the current component subtree. Call from
 * a root component's `setup()`, then feed streamed v0.9 messages to
 * `processor.processMessages(...)` and mount `<A2UISurface :surface-id="...">`.
 */
export function provideA2UI(options: ProvideA2uiOptions = {}): A2uiHandle {
  const catalog = buildVueCatalog(options.catalog)
  const processor = new MessageProcessor<VueComponentApi>([catalog], options.onAction)
  provide(A2UI_CONTEXT, { processor })
  return { processor }
}
