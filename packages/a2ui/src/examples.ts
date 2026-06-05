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

  Badge: surfaceExample([
    { id: 'root', component: 'Row', children: ['b1', 'b2', 'b3'] },
    { id: 'b1', component: 'Badge', label: 'New' },
    { id: 'b2', component: 'Badge', label: 'Beta', variant: 'secondary' },
    { id: 'b3', component: 'Badge', label: 'Failed', variant: 'destructive' },
  ]),

  Avatar: surfaceExample([
    {
      id: 'root',
      component: 'Avatar',
      src: 'https://i.pravatar.cc/100?img=12',
      alt: 'Ada Lovelace',
      fallback: 'AL',
      size: 'lg',
    },
  ]),

  AvatarGroup: surfaceExample([
    { id: 'root', component: 'AvatarGroup', children: ['a1', 'a2', 'a3', 'a4'], max: 3 },
    { id: 'a1', component: 'Avatar', src: 'https://i.pravatar.cc/100?img=1', fallback: 'A' },
    { id: 'a2', component: 'Avatar', src: 'https://i.pravatar.cc/100?img=2', fallback: 'B' },
    { id: 'a3', component: 'Avatar', src: 'https://i.pravatar.cc/100?img=3', fallback: 'C' },
    { id: 'a4', component: 'Avatar', src: 'https://i.pravatar.cc/100?img=4', fallback: 'D' },
  ]),

  Kbd: surfaceExample([{ id: 'root', component: 'Kbd', keys: ['Ctrl', 'K'] }]),

  Separator: surfaceExample([
    { id: 'root', component: 'Column', children: ['s1', 'sep', 's2'] },
    { id: 's1', component: 'Text', text: 'Section one' },
    { id: 'sep', component: 'Separator', label: 'OR' },
    { id: 's2', component: 'Text', text: 'Section two' },
  ]),

  Divider: surfaceExample([
    { id: 'root', component: 'Column', children: ['d1', 'div', 'd2'] },
    { id: 'd1', component: 'Text', text: 'Above the divider' },
    { id: 'div', component: 'Divider' },
    { id: 'd2', component: 'Text', text: 'Below the divider' },
  ]),

  Row: surfaceExample([
    { id: 'root', component: 'Row', children: ['c1', 'c2', 'c3'], justify: 'start' },
    { id: 'c1', component: 'Badge', label: 'One' },
    { id: 'c2', component: 'Badge', label: 'Two', variant: 'secondary' },
    { id: 'c3', component: 'Badge', label: 'Three', variant: 'success' },
  ]),

  List: surfaceExample([
    { id: 'root', component: 'List', children: ['i1', 'i2', 'i3'], direction: 'vertical' },
    { id: 'i1', component: 'Text', text: '• First item' },
    { id: 'i2', component: 'Text', text: '• Second item' },
    { id: 'i3', component: 'Text', text: '• Third item' },
  ]),

  ScrollArea: surfaceExample(
    [
      { id: 'root', component: 'ScrollArea', child: 'long', maxHeight: '120px' },
      { id: 'long', component: 'Markdown', content: { path: '/text' } },
    ],
    {
      text: 'Scroll me.\n\n' + Array.from({ length: 12 }, (_, i) => `- Line ${i + 1}`).join('\n'),
    },
  ),

  ButtonGroup: surfaceExample([
    { id: 'root', component: 'ButtonGroup', children: ['bg1', 'bg2', 'bg3'] },
    { id: 'bg1', component: 'Button', child: 'bg1l', action: { event: { name: 'prev' } } },
    { id: 'bg1l', component: 'Text', text: 'Prev' },
    { id: 'bg2', component: 'Button', child: 'bg2l', action: { event: { name: 'today' } } },
    { id: 'bg2l', component: 'Text', text: 'Today' },
    { id: 'bg3', component: 'Button', child: 'bg3l', action: { event: { name: 'next' } } },
    { id: 'bg3l', component: 'Text', text: 'Next' },
  ]),

  Table: surfaceExample(
    [
      {
        id: 'root',
        component: 'Table',
        caption: 'Recent sign-ups',
        columns: [
          { key: 'name', header: 'Name' },
          { key: 'plan', header: 'Plan' },
          { key: 'status', header: 'Status' },
        ],
        rows: { path: '/rows' },
      },
    ],
    {
      rows: [
        { name: 'Ada Lovelace', plan: 'Pro', status: 'Active' },
        { name: 'Alan Turing', plan: 'Team', status: 'Active' },
        { name: 'Grace Hopper', plan: 'Free', status: 'Trial' },
      ],
    },
  ),

  Image: surfaceExample([
    {
      id: 'root',
      component: 'Image',
      url: 'https://picsum.photos/seed/meldui/480/240',
      description: 'A scenic placeholder image',
      fit: 'cover',
      variant: 'largeFeature',
    },
  ]),
}
