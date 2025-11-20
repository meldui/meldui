import { IconCheck, IconStar, IconX } from '@meldui/tabler-vue'
import { Badge } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Badge> = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'Visual style variant of the badge',
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

export const Outline: Story = {
  render: () => ({
    components: { Badge },
    template: '<Badge variant="outline">Outline</Badge>',
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { Badge, IconCheck, IconStar },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="default">
          <IconCheck />
          Success
        </Badge>
        <Badge variant="secondary">
          <IconStar />
          Featured
        </Badge>
        <Badge variant="destructive">
          <IconX />
          Error
        </Badge>
        <Badge variant="outline">
          <IconCheck />
          Verified
        </Badge>
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
        <Badge variant="outline">Outline</Badge>
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
        <Badge as="a" href="#" variant="outline">Link Outline</Badge>
      </div>
    `,
  }),
}

export const StatusBadges: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="default">Active</Badge>
        <Badge variant="secondary">Pending</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge variant="outline">Draft</Badge>
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
          <Badge variant="outline">5</Badge>
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
          <Badge variant="outline">paragraph</Badge>.
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
        <Badge variant="outline">Status: Waiting for approval</Badge>
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
        <Badge variant="outline">
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
