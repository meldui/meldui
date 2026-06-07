import type { InjectionKey } from 'vue'
import type { MessageProcessor } from '@a2ui/web_core/v0_9'
import type { VueComponentApi } from './types'

export interface A2uiContext {
  processor: MessageProcessor<VueComponentApi>
}

/** Injection key for the A2UI context provided by `provideA2UI`. */
export const A2UI_CONTEXT: InjectionKey<A2uiContext> = Symbol('meldui-a2ui')
