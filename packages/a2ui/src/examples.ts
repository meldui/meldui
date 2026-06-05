/**
 * Canonical, framework-agnostic A2UI v0.9 message examples — one per catalog
 * component. Single source of truth shared by the Storybook stories and the
 * docs site so every component is documented with the exact messages an agent
 * would emit (and the live render stays in sync with the shown code).
 */
import { CATALOG_ID } from './constants'

export type A2uiExampleMessage = Record<string, unknown>

/** Builds a single-surface example: createSurface → (optional data) → components. */
export function surfaceExample(
  components: Array<Record<string, unknown>>,
  data?: Record<string, unknown>,
): A2uiExampleMessage[] {
  const messages: A2uiExampleMessage[] = [
    { version: 'v0.9', createSurface: { surfaceId: 's1', catalogId: CATALOG_ID } },
  ]
  if (data) {
    messages.push({ version: 'v0.9', updateDataModel: { surfaceId: 's1', path: '/', value: data } })
  }
  messages.push({ version: 'v0.9', updateComponents: { surfaceId: 's1', components } })
  return messages
}

/** Example message sequences keyed by component name. */
export const examples: Record<string, A2uiExampleMessage[]> = {
  Alert: surfaceExample([
    {
      id: 'root',
      component: 'Alert',
      title: 'Heads up!',
      description: 'Your free trial ends in 3 days. Upgrade to keep your projects.',
      variant: 'warning',
    },
  ]),
}
