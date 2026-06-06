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
  Text: surfaceExample([
    { id: 'root', component: 'Column', children: ['t1', 't2', 't3'] },
    { id: 't1', component: 'Text', text: 'A heading', variant: 'h3' },
    {
      id: 't2',
      component: 'Text',
      text: 'Body text — the default style for paragraphs and descriptions.',
      variant: 'body',
    },
    { id: 't3', component: 'Text', text: 'A small caption', variant: 'caption' },
  ]),

  Markdown: surfaceExample([
    {
      id: 'root',
      component: 'Markdown',
      content:
        '## Markdown\n\nThe primary path for streamed agent text. Supports **bold**, `code`, lists:\n\n- one\n- two\n\n```ts\nconst x = 1\n```',
    },
  ]),

  Column: surfaceExample([
    { id: 'root', component: 'Column', children: ['cl1', 'cl2', 'cl3'], align: 'start' },
    { id: 'cl1', component: 'Badge', label: 'First' },
    { id: 'cl2', component: 'Badge', label: 'Second', variant: 'secondary' },
    { id: 'cl3', component: 'Badge', label: 'Third', variant: 'success' },
  ]),

  Card: surfaceExample([
    { id: 'root', component: 'Card', child: 'cardcol' },
    { id: 'cardcol', component: 'Column', children: ['cc1', 'cc2'] },
    { id: 'cc1', component: 'Text', text: 'Card title', variant: 'h4' },
    { id: 'cc2', component: 'Text', text: 'Card body content goes here.', variant: 'body' },
  ]),

  Button: surfaceExample([
    { id: 'root', component: 'Row', children: ['bt1', 'bt2', 'bt3'] },
    {
      id: 'bt1',
      component: 'Button',
      child: 'bt1l',
      variant: 'primary',
      action: { event: { name: 'save' } },
    },
    { id: 'bt1l', component: 'Text', text: 'Save' },
    { id: 'bt2', component: 'Button', child: 'bt2l', action: { event: { name: 'cancel' } } },
    { id: 'bt2l', component: 'Text', text: 'Cancel' },
    {
      id: 'bt3',
      component: 'Button',
      child: 'bt3l',
      variant: 'borderless',
      action: { event: { name: 'learn' } },
    },
    { id: 'bt3l', component: 'Text', text: 'Learn more' },
  ]),

  TextField: surfaceExample(
    [{ id: 'root', component: 'TextField', label: 'Your name', value: { path: '/name' } }],
    { name: 'Ada' },
  ),

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
    { id: 'root', component: 'AvatarGroup', children: ['a1', 'a2', 'a3', 'a4'], max: 3, size: 'lg' },
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

  CheckBox: surfaceExample(
    [
      {
        id: 'root',
        component: 'CheckBox',
        label: 'Email me about product updates',
        value: { path: '/subscribed' },
      },
    ],
    { subscribed: true },
  ),

  Slider: surfaceExample(
    [
      {
        id: 'root',
        component: 'Slider',
        label: 'Volume',
        min: 0,
        max: 100,
        value: { path: '/volume' },
      },
    ],
    { volume: 60 },
  ),

  ChoicePicker: surfaceExample(
    [
      {
        id: 'root',
        component: 'ChoicePicker',
        label: 'Choose a plan',
        variant: 'mutuallyExclusive',
        options: [
          { label: 'Free', value: 'free' },
          { label: 'Pro', value: 'pro' },
          { label: 'Team', value: 'team' },
        ],
        value: { path: '/plan' },
      },
    ],
    { plan: ['pro'] },
  ),

  ToggleGroup: surfaceExample(
    [
      {
        id: 'root',
        component: 'ToggleGroup',
        variant: 'single',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
        value: { path: '/align' },
      },
    ],
    { align: ['center'] },
  ),

  MultiSelect: surfaceExample(
    [
      {
        id: 'root',
        component: 'MultiSelect',
        label: 'Tags',
        placeholder: 'Select tags…',
        options: [
          { label: 'Design', value: 'design' },
          { label: 'Engineering', value: 'eng' },
          { label: 'Marketing', value: 'mkt' },
          { label: 'Sales', value: 'sales' },
        ],
        value: { path: '/tags' },
      },
    ],
    { tags: ['design', 'eng'] },
  ),

  DateTimeInput: surfaceExample(
    [
      {
        id: 'root',
        component: 'DateTimeInput',
        label: 'Due date',
        enableDate: true,
        value: { path: '/due' },
      },
    ],
    { due: '2026-06-15' },
  ),

  Tabs: surfaceExample([
    {
      id: 'root',
      component: 'Tabs',
      tabs: [
        { title: 'Account', child: 'tab1' },
        { title: 'Password', child: 'tab2' },
      ],
    },
    { id: 'tab1', component: 'Markdown', content: 'Manage your **account** details here.' },
    { id: 'tab2', component: 'Markdown', content: 'Change your **password** here.' },
  ]),

  Accordion: surfaceExample([
    {
      id: 'root',
      component: 'Accordion',
      type: 'single',
      items: [
        { title: 'Is it accessible?', child: 'acc1' },
        { title: 'Is it styled?', child: 'acc2' },
      ],
    },
    { id: 'acc1', component: 'Text', text: 'Yes — it follows the WAI-ARIA accordion pattern.' },
    { id: 'acc2', component: 'Text', text: 'Yes — it uses MeldUI styling out of the box.' },
  ]),

  Modal: surfaceExample([
    { id: 'root', component: 'Modal', trigger: 'mtrigger', content: 'mcontent' },
    { id: 'mtrigger', component: 'Button', child: 'mtl', action: { event: { name: 'open' } } },
    { id: 'mtl', component: 'Text', text: 'Open dialog' },
    { id: 'mcontent', component: 'Column', children: ['mc1', 'mc2'] },
    { id: 'mc1', component: 'Text', text: 'Are you sure?', variant: 'h4' },
    { id: 'mc2', component: 'Text', text: 'This action cannot be undone.', variant: 'caption' },
  ]),

  Carousel: surfaceExample([
    { id: 'root', component: 'Carousel', children: ['cs1', 'cs2', 'cs3'], loop: true },
    { id: 'cs1', component: 'Card', child: 'cs1c' },
    { id: 'cs1c', component: 'Text', text: 'Slide 1', variant: 'h3' },
    { id: 'cs2', component: 'Card', child: 'cs2c' },
    { id: 'cs2c', component: 'Text', text: 'Slide 2', variant: 'h3' },
    { id: 'cs3', component: 'Card', child: 'cs3c' },
    { id: 'cs3c', component: 'Text', text: 'Slide 3', variant: 'h3' },
  ]),

  Stepper: surfaceExample([
    {
      id: 'root',
      component: 'Stepper',
      value: 1,
      steps: [
        { title: 'Account', description: 'Create your account' },
        { title: 'Profile', description: 'Set up your profile' },
        { title: 'Done', description: 'Review & finish' },
      ],
    },
  ]),

  Timeline: surfaceExample([
    {
      id: 'root',
      component: 'Timeline',
      items: [
        { title: 'Order placed', description: 'Your order is confirmed.', timestamp: 'Jun 1' },
        { title: 'Shipped', description: 'Package is on its way.', timestamp: 'Jun 3' },
        { title: 'Delivered', description: 'Left at the front door.', timestamp: 'Jun 5' },
      ],
    },
  ]),

  Sidebar: surfaceExample([
    { id: 'root', component: 'Sidebar', header: 'sbh', content: 'sbc', footer: 'sbf' },
    { id: 'sbh', component: 'Text', text: 'MeldUI', variant: 'h5' },
    {
      id: 'sbc',
      component: 'Markdown',
      content: 'Main content area.\n\nThe agent drives an app-like surface.',
    },
    { id: 'sbf', component: 'Text', text: '© 2026', variant: 'caption' },
  ]),

  Combobox: surfaceExample(
    [
      {
        id: 'root',
        component: 'Combobox',
        label: 'Framework',
        placeholder: 'Select a framework…',
        options: [
          { label: 'Vue', value: 'vue' },
          { label: 'React', value: 'react' },
          { label: 'Svelte', value: 'svelte' },
          { label: 'Angular', value: 'angular' },
        ],
        value: { path: '/framework' },
      },
    ],
    { framework: 'vue' },
  ),

  Chart: surfaceExample(
    [
      {
        id: 'root',
        component: 'Chart',
        chartType: 'bar',
        title: 'Weekly revenue',
        data: { path: '/chart' },
      },
    ],
    {
      chart: {
        series: [{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      },
    },
  ),

  Icon: surfaceExample([
    { id: 'root', component: 'Row', children: ['ic1', 'ic2', 'ic3', 'ic4'] },
    { id: 'ic1', component: 'Icon', name: 'home' },
    { id: 'ic2', component: 'Icon', name: 'settings' },
    { id: 'ic3', component: 'Icon', name: 'favorite' },
    { id: 'ic4', component: 'Icon', name: 'search' },
  ]),

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
