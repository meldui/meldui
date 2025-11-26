import { IconCheck, IconStar, IconX } from '@meldui/tabler-vue'
import { Badge } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Badge> = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    shape: {
      control: 'select',
      options: ['pill', 'tag'],
      description: 'Shape of the badge (pill = rounded-full, tag = rounded-md)',
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'success', 'warning', 'info', 'neutral'],
      description: 'Color variant of the badge',
    },
    outline: {
      control: 'boolean',
      description: 'Display badge with outline style instead of filled',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args }
    },
    template: '<Badge v-bind="args">Badge</Badge>',
  }),
  args: {
    shape: 'pill',
    variant: 'default',
  },
}

export const Secondary: Story = {
  render: () => ({
    components: { Badge },
    template: '<Badge variant="secondary">Secondary</Badge>',
  }),
}

export const Destructive: Story = {
  render: () => ({
    components: { Badge },
    template: '<Badge variant="destructive">Destructive</Badge>',
  }),
}

export const Success: Story = {
  render: () => ({
    components: { Badge },
    template: '<Badge variant="success">Success</Badge>',
  }),
}

export const Warning: Story = {
  render: () => ({
    components: { Badge },
    template: '<Badge variant="warning">Warning</Badge>',
  }),
}

export const Info: Story = {
  render: () => ({
    components: { Badge },
    template: '<Badge variant="info">Info</Badge>',
  }),
}

export const Neutral: Story = {
  render: () => ({
    components: { Badge },
    template: '<Badge variant="neutral">Neutral</Badge>',
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { Badge, IconCheck, IconStar, IconX },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2">
          <Badge variant="success">
            <IconCheck />
            Success
          </Badge>
          <Badge variant="warning">
            <IconStar />
            Featured
          </Badge>
          <Badge variant="destructive">
            <IconX />
            Error
          </Badge>
          <Badge variant="info">
            <IconCheck />
            Info
          </Badge>
          <Badge variant="neutral">
            <IconCheck />
            Neutral
          </Badge>
        </div>
        <div class="flex flex-wrap gap-2">
          <Badge variant="success" :outline="true">
            <IconCheck />
            Success
          </Badge>
          <Badge variant="warning" :outline="true">
            <IconStar />
            Featured
          </Badge>
          <Badge variant="destructive" :outline="true">
            <IconX />
            Error
          </Badge>
          <Badge variant="info" :outline="true">
            <IconCheck />
            Info
          </Badge>
          <Badge variant="neutral" :outline="true">
            <IconCheck />
            Neutral
          </Badge>
        </div>
      </div>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="neutral">Neutral</Badge>
      </div>
    `,
  }),
}

export const Shapes: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm font-medium mb-2">Pill (default)</p>
          <div class="flex flex-wrap gap-2">
            <Badge shape="pill" variant="default">Default</Badge>
            <Badge shape="pill" variant="success">Success</Badge>
            <Badge shape="pill" variant="destructive">Error</Badge>
            <Badge shape="pill" variant="default" :outline="true">Outline</Badge>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium mb-2">Tag</p>
          <div class="flex flex-wrap gap-2">
            <Badge shape="tag" variant="default">JavaScript</Badge>
            <Badge shape="tag" variant="success">Vue</Badge>
            <Badge shape="tag" variant="info">TypeScript</Badge>
            <Badge shape="tag" variant="neutral">React</Badge>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium mb-2">Tag (outline)</p>
          <div class="flex flex-wrap gap-2">
            <Badge shape="tag" variant="default" :outline="true">JavaScript</Badge>
            <Badge shape="tag" variant="success" :outline="true">Vue</Badge>
            <Badge shape="tag" variant="info" :outline="true">TypeScript</Badge>
            <Badge shape="tag" variant="neutral" :outline="true">React</Badge>
          </div>
        </div>
      </div>
    `,
  }),
}

export const OutlineVariants: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="default" :outline="true">Default</Badge>
        <Badge variant="secondary" :outline="true">Secondary</Badge>
        <Badge variant="destructive" :outline="true">Destructive</Badge>
        <Badge variant="success" :outline="true">Success</Badge>
        <Badge variant="warning" :outline="true">Warning</Badge>
        <Badge variant="info" :outline="true">Info</Badge>
        <Badge variant="neutral" :outline="true">Neutral</Badge>
      </div>
    `,
  }),
}

export const AsLink: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge as="a" href="#" variant="default">Link Badge</Badge>
        <Badge as="a" href="#" variant="secondary">Link Secondary</Badge>
        <Badge as="a" href="#" variant="destructive">Link Destructive</Badge>
        <Badge as="a" href="#" variant="default" :outline="true">Link Outline</Badge>
      </div>
    `,
  }),
}

export const StatusBadges: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-2">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Badge variant="info">In Progress</Badge>
          <Badge variant="neutral">Draft</Badge>
        </div>
        <div class="flex flex-wrap gap-2">
          <Badge variant="success" :outline="true">Active</Badge>
          <Badge variant="warning" :outline="true">Pending</Badge>
          <Badge variant="destructive" :outline="true">Failed</Badge>
          <Badge variant="info" :outline="true">In Progress</Badge>
          <Badge variant="neutral" :outline="true">Draft</Badge>
        </div>
      </div>
    `,
  }),
}

export const NotificationBadges: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="font-medium">Messages</span>
          <Badge variant="default">12</Badge>
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="font-medium">Notifications</span>
          <Badge variant="secondary">3</Badge>
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="font-medium">Alerts</span>
          <Badge variant="destructive">2</Badge>
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="font-medium">Updates</span>
          <Badge variant="neutral" :outline="true">5</Badge>
        </div>
      </div>
    `,
  }),
}

export const InlineText: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="max-w-md">
        <p class="text-sm">
          This is a paragraph with an inline
          <Badge variant="default">badge</Badge>
          that shows how badges can be used within text content. You can also use
          <Badge variant="secondary">multiple</Badge>
          badges in the same
          <Badge variant="neutral" :outline="true">paragraph</Badge>.
        </p>
      </div>
    `,
  }),
}

export const LongText: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Badge variant="default">This is a longer badge text</Badge>
        <Badge variant="secondary">Feature: Multi-line badge support</Badge>
        <Badge variant="destructive">Error: Connection timeout</Badge>
        <Badge variant="neutral" :outline="true">Status: Waiting for approval</Badge>
      </div>
    `,
  }),
}

export const WithIconButton: Story = {
  render: () => ({
    components: { Badge, IconX },
    setup() {
      const handleRemove = (label: string) => {
        alert(`Removing badge: ${label}`)
      }
      return { handleRemove }
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="default">
          Label
          <button
            @click="handleRemove('Label')"
            class="ml-1 -mr-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
            aria-label="Remove"
          >
            <IconX class="size-3" />
          </button>
        </Badge>
        <Badge variant="secondary">
          Feature
          <button
            @click="handleRemove('Feature')"
            class="ml-1 -mr-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
            aria-label="Remove"
          >
            <IconX class="size-3" />
          </button>
        </Badge>
        <Badge variant="destructive">
          Error
          <button
            @click="handleRemove('Error')"
            class="ml-1 -mr-1 rounded-full hover:bg-white/20 p-0.5 transition-colors"
            aria-label="Remove"
          >
            <IconX class="size-3" />
          </button>
        </Badge>
        <Badge variant="neutral" :outline="true">
          Tag
          <button
            @click="handleRemove('Tag')"
            class="ml-1 -mr-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
            aria-label="Remove"
          >
            <IconX class="size-3" />
          </button>
        </Badge>
      </div>
    `,
  }),
}
