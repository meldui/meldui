import { ScrollArea, ScrollBar, Separator } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/Layout/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Augments native scroll functionality for custom, cross-browser styling. Provides smooth scrolling with styled scrollbars.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ScrollArea>

export const Default: Story = {
  render: () => ({
    components: { ScrollArea },
    template: `
      <ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
        <div class="text-sm">
          <h4 class="mb-4 font-medium leading-none">MeldUI Components</h4>
          <div class="space-y-1">
            <p>Accordion</p>
            <p>Alert</p>
            <p>AlertDialog</p>
            <p>AspectRatio</p>
            <p>Avatar</p>
            <p>Badge</p>
            <p>Breadcrumb</p>
            <p>Button</p>
            <p>Calendar</p>
            <p>Card</p>
            <p>Carousel</p>
            <p>Chart</p>
            <p>Checkbox</p>
            <p>Collapsible</p>
            <p>Combobox</p>
            <p>Command</p>
            <p>ContextMenu</p>
            <p>Dialog</p>
            <p>Drawer</p>
            <p>DropdownMenu</p>
          </div>
        </div>
      </ScrollArea>
    `,
  }),
}

export const Horizontal: Story = {
  render: () => ({
    components: { ScrollArea, ScrollBar },
    template: `
      <ScrollArea class="w-[600px] whitespace-nowrap rounded-md border">
        <div class="flex w-max space-x-4 p-4">
          <div v-for="i in 20" :key="i" class="shrink-0">
            <div class="h-[150px] w-[150px] rounded-md border">
              <div class="flex h-full items-center justify-center text-sm text-muted-foreground">
                Item {{ i }}
              </div>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    `,
  }),
}

export const Both: Story = {
  render: () => ({
    components: { ScrollArea, ScrollBar },
    template: `
      <ScrollArea class="h-[400px] w-[600px] rounded-md border">
        <div class="p-4">
          <h4 class="mb-4 text-sm font-medium leading-none">Grid Layout</h4>
          <div class="grid w-[1200px] grid-cols-6 gap-4">
            <div v-for="i in 60" :key="i" class="rounded-md border p-4">
              <div class="flex h-[100px] items-center justify-center text-sm text-muted-foreground">
                Cell {{ i }}
              </div>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    `,
  }),
}

export const LongContent: Story = {
  render: () => ({
    components: { ScrollArea },
    template: `
      <ScrollArea class="h-[400px] w-[500px] rounded-md border p-4">
        <div class="space-y-4 text-sm">
          <h4 class="font-semibold">About MeldUI</h4>
          <p>
            MeldUI is an internal design system built on shadcn components. It provides
            a consistent and customizable UI library for Vue 3 applications.
          </p>
          <h4 class="font-semibold">Key Features</h4>
          <ul class="list-disc space-y-1 pl-4">
            <li>Built on shadcn-vue components for reliability</li>
            <li>Customizable with Tailwind CSS v4</li>
            <li>Full TypeScript support</li>
            <li>Comprehensive icon system with @meldui/tabler-vue</li>
            <li>Monorepo architecture with pnpm workspaces</li>
            <li>Independent versioning using Changesets</li>
          </ul>
          <h4 class="font-semibold">Architecture</h4>
          <p>
            The monorepo is organized into packages and apps. Packages contain the
            component libraries while apps contain development tools like Storybook.
          </p>
          <h4 class="font-semibold">Getting Started</h4>
          <p>
            To install MeldUI in your project, run:
          </p>
          <pre class="rounded-md bg-muted p-2">pnpm add @meldui/vue @meldui/tabler-vue</pre>
          <p>
            Then import components as needed in your Vue 3 application.
          </p>
          <h4 class="font-semibold">Component Categories</h4>
          <ul class="list-disc space-y-1 pl-4">
            <li>Form Components - Input, Select, Checkbox, etc.</li>
            <li>Navigation - Tabs, Breadcrumb, Menu components</li>
            <li>Feedback - Alert, Badge, Progress, Toast</li>
            <li>Layout - Accordion, Resizable, ScrollArea</li>
            <li>Overlay - Dialog, Drawer, Popover, Tooltip</li>
            <li>Data Display - Avatar, Calendar, Chart, Table</li>
          </ul>
        </div>
      </ScrollArea>
    `,
  }),
}

export const TagList: Story = {
  render: () => ({
    components: { ScrollArea, Separator },
    template: `
      <ScrollArea class="h-72 w-48 rounded-md border">
        <div class="p-4">
          <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
          <div class="space-y-1 text-sm">
            <div v-for="tag in tags" :key="tag" class="py-1">
              {{ tag }}
            </div>
          </div>
        </div>
      </ScrollArea>
    `,
    setup() {
      const tags = [
        'vue',
        'typescript',
        'tailwindcss',
        'component-library',
        'design-system',
        'shadcn-vue',
        'ui-components',
        'frontend',
        'web-development',
        'monorepo',
        'pnpm',
        'vite',
        'storybook',
        'accessibility',
        'responsive',
        'icons',
        'theming',
        'customizable',
        'open-source',
        'modern',
      ]
      return { tags }
    },
  }),
}

export const MessageList: Story = {
  render: () => ({
    components: { ScrollArea, Separator },
    template: `
      <ScrollArea class="h-[450px] w-[400px] rounded-md border">
        <div class="p-4">
          <h4 class="mb-4 text-sm font-medium">Messages</h4>
          <div class="space-y-4">
            <div v-for="(message, i) in messages" :key="i">
              <div class="flex flex-col gap-2">
                <div class="flex items-start gap-3">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {{ message.initial }}
                  </div>
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium">{{ message.name }}</p>
                      <p class="text-xs text-muted-foreground">{{ message.time }}</p>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ message.text }}</p>
                  </div>
                </div>
              </div>
              <Separator v-if="i < messages.length - 1" class="my-4" />
            </div>
          </div>
        </div>
      </ScrollArea>
    `,
    setup() {
      const messages = [
        {
          name: 'Alice Johnson',
          initial: 'AJ',
          time: '2 min ago',
          text: 'Hey team! The new dashboard feature is ready for review. Can someone take a look?',
        },
        {
          name: 'Bob Smith',
          initial: 'BS',
          time: '15 min ago',
          text: 'Just pushed the fix for the navigation bug. Should be resolved now.',
        },
        {
          name: 'Carol Williams',
          initial: 'CW',
          time: '1 hour ago',
          text: "I've updated the documentation with the new component examples.",
        },
        {
          name: 'David Brown',
          initial: 'DB',
          time: '2 hours ago',
          text: 'Meeting scheduled for tomorrow at 2 PM to discuss the roadmap.',
        },
        {
          name: 'Emma Davis',
          initial: 'ED',
          time: '3 hours ago',
          text: 'Great work on the accessibility improvements! The components are much better now.',
        },
        {
          name: 'Frank Miller',
          initial: 'FM',
          time: '4 hours ago',
          text: 'Can we add dark mode support to the new components?',
        },
        {
          name: 'Grace Wilson',
          initial: 'GW',
          time: '5 hours ago',
          text: "I'm working on the mobile responsive layouts. Will have an update soon.",
        },
      ]
      return { messages }
    },
  }),
}

export const CodeBlock: Story = {
  render: () => ({
    components: { ScrollArea, ScrollBar },
    template: `
      <ScrollArea class="h-[400px] w-full max-w-2xl rounded-md border">
        <div class="p-4">
          <h4 class="mb-4 text-sm font-medium">Example Component</h4>
          <pre class="text-sm"><code>&lt;script setup lang="ts"&gt;
import { Button, Card, CardContent, CardHeader, CardTitle } from '@meldui/vue'
import { IconCheck, IconX } from '@meldui/tabler-vue'
import { ref } from 'vue'

const isActive = ref(false)
const count = ref(0)

function handleClick() {
  isActive.value = !isActive.value
  count.value++
}

function resetCount() {
  count.value = 0
  isActive.value = false
}
&lt;/script&gt;

&lt;template&gt;
  &lt;Card class="w-full max-w-md"&gt;
    &lt;CardHeader&gt;
      &lt;CardTitle&gt;Interactive Example&lt;/CardTitle&gt;
    &lt;/CardHeader&gt;
    &lt;CardContent&gt;
      &lt;div class="space-y-4"&gt;
        &lt;div class="flex items-center gap-2"&gt;
          &lt;p class="text-sm"&gt;Status:&lt;/p&gt;
          &lt;div class="flex items-center gap-1"&gt;
            &lt;IconCheck v-if="isActive" class="text-green-600" /&gt;
            &lt;IconX v-else class="text-red-600" /&gt;
            &lt;span class="text-sm"&gt;{{ isActive ? 'Active' : 'Inactive' }}&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="flex items-center gap-2"&gt;
          &lt;p class="text-sm"&gt;Count:&lt;/p&gt;
          &lt;span class="text-sm font-semibold"&gt;{{ count }}&lt;/span&gt;
        &lt;/div&gt;
        &lt;div class="flex gap-2"&gt;
          &lt;Button @click="handleClick"&gt;Toggle&lt;/Button&gt;
          &lt;Button variant="outline" @click="resetCount"&gt;Reset&lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/CardContent&gt;
  &lt;/Card&gt;
&lt;/template&gt;</code></pre>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    `,
  }),
}

export const TableScroll: Story = {
  render: () => ({
    components: { ScrollArea, ScrollBar },
    template: `
      <ScrollArea class="h-[400px] w-full rounded-md border">
        <div class="p-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="pb-2 text-left font-medium">ID</th>
                <th class="pb-2 text-left font-medium">Name</th>
                <th class="pb-2 text-left font-medium">Email</th>
                <th class="pb-2 text-left font-medium">Role</th>
                <th class="pb-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 50" :key="i" class="border-b">
                <td class="py-3">{{ i }}</td>
                <td class="py-3">User {{ i }}</td>
                <td class="py-3">user{{ i }}@example.com</td>
                <td class="py-3">{{ i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Editor' : 'Viewer' }}</td>
                <td class="py-3">
                  <span :class="i % 2 === 0 ? 'text-green-600' : 'text-muted-foreground'">
                    {{ i % 2 === 0 ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ScrollArea>
    `,
  }),
}

export const StickyHeader: Story = {
  render: () => ({
    components: { ScrollArea },
    template: `
      <ScrollArea class="h-[400px] w-[500px] rounded-md border">
        <div class="sticky top-0 z-10 border-b bg-background px-4 py-3">
          <h3 class="font-semibold">Component Documentation</h3>
          <p class="text-xs text-muted-foreground">Scroll to see more content</p>
        </div>
        <div class="space-y-6 p-4">
          <section>
            <h4 class="mb-2 font-semibold">Installation</h4>
            <p class="text-sm text-muted-foreground">
              Install the component library using your preferred package manager.
            </p>
          </section>
          <section>
            <h4 class="mb-2 font-semibold">Basic Usage</h4>
            <p class="text-sm text-muted-foreground">
              Import the components you need and use them in your Vue templates.
            </p>
          </section>
          <section>
            <h4 class="mb-2 font-semibold">Props</h4>
            <ul class="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              <li>class - Additional CSS classes</li>
              <li>type - Component type variant</li>
              <li>scrollHideDelay - Delay before hiding scrollbar</li>
            </ul>
          </section>
          <section>
            <h4 class="mb-2 font-semibold">Examples</h4>
            <p class="text-sm text-muted-foreground">
              Multiple examples showing different use cases and configurations.
            </p>
          </section>
          <section>
            <h4 class="mb-2 font-semibold">Accessibility</h4>
            <p class="text-sm text-muted-foreground">
              The component follows WAI-ARIA guidelines for keyboard navigation.
            </p>
          </section>
          <section>
            <h4 class="mb-2 font-semibold">Customization</h4>
            <p class="text-sm text-muted-foreground">
              Customize the appearance using Tailwind CSS classes.
            </p>
          </section>
        </div>
      </ScrollArea>
    `,
  }),
}
