import { Dot } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Dot> = {
  title: 'Components/Feedback/Dot',
  component: Dot,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'destructive', 'info', 'neutral'],
      description: 'Color variant of the dot',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the dot',
    },
    effect: {
      control: 'select',
      options: [undefined, 'pulse', 'ping'],
      description: 'Animation effect',
    },
  },
}

export default meta
type Story = StoryObj<typeof Dot>

export const Default: Story = {
  render: (args) => ({
    components: { Dot },
    setup() {
      return { args }
    },
    template: '<Dot v-bind="args" />',
  }),
  args: {
    variant: 'primary',
    size: 'md',
  },
}

export const AllVariants: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <Dot variant="primary" />
          <span class="text-sm">Primary</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="success" />
          <span class="text-sm">Success</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="warning" />
          <span class="text-sm">Warning</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="destructive" />
          <span class="text-sm">Destructive</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="info" />
          <span class="text-sm">Info</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="neutral" />
          <span class="text-sm">Neutral</span>
        </div>
      </div>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <Dot size="xs" />
          <span class="text-sm">Extra Small (6px)</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot size="sm" />
          <span class="text-sm">Small (8px)</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot size="md" />
          <span class="text-sm">Medium (10px)</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot size="lg" />
          <span class="text-sm">Large (12px)</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot size="xl" />
          <span class="text-sm">Extra Large (16px)</span>
        </div>
      </div>
    `,
  }),
}

export const WithPulseEffect: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <Dot variant="primary" effect="pulse" />
          <span class="text-sm">Primary Pulse</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="success" effect="pulse" />
          <span class="text-sm">Success Pulse</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="destructive" effect="pulse" />
          <span class="text-sm">Destructive Pulse</span>
        </div>
      </div>
    `,
  }),
}

export const WithPingEffect: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-3">
          <Dot variant="primary" effect="ping" />
          <span class="text-sm">Primary Ping</span>
        </div>
        <div class="flex items-center gap-3">
          <Dot variant="success" effect="ping" />
          <span class="text-sm">Success Ping</span>
        </div>
        <div class="flex items-center gap-3">
          <Dot variant="destructive" effect="ping" />
          <span class="text-sm">Destructive Ping</span>
        </div>
      </div>
    `,
  }),
}

export const StatusIndicators: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-col gap-3 max-w-md">
        <div class="flex items-center gap-2 p-3 border rounded-lg">
          <Dot variant="success" effect="pulse" />
          <span class="text-sm font-medium">Online</span>
        </div>
        <div class="flex items-center gap-2 p-3 border rounded-lg">
          <Dot variant="warning" />
          <span class="text-sm font-medium">Away</span>
        </div>
        <div class="flex items-center gap-2 p-3 border rounded-lg">
          <Dot variant="destructive" />
          <span class="text-sm font-medium">Offline</span>
        </div>
        <div class="flex items-center gap-2 p-3 border rounded-lg">
          <Dot variant="neutral" />
          <span class="text-sm font-medium">Unknown</span>
        </div>
      </div>
    `,
  }),
}

export const ListMarkers: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <div class="flex items-center gap-2">
          <Dot variant="primary" size="sm" />
          <span class="text-sm">New Components: Field, Input Group, Item and more</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="success" size="sm" />
          <span class="text-sm">Successfully deployed to production</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="warning" size="sm" />
          <span class="text-sm">Warning: High memory usage detected</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="destructive" size="sm" />
          <span class="text-sm">Error: Failed to connect to database</span>
        </div>
      </div>
    `,
  }),
}

export const NotificationBadges: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-col gap-3 max-w-md">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="font-medium">Messages</span>
          <Dot variant="primary" effect="ping" />
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="font-medium">Notifications</span>
          <Dot variant="info" effect="pulse" />
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="font-medium">Alerts</span>
          <Dot variant="destructive" effect="ping" />
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="font-medium">Updates</span>
          <Dot variant="success" />
        </div>
      </div>
    `,
  }),
}

export const SizeComparison: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <Dot variant="primary" size="xs" />
          <Dot variant="success" size="xs" />
          <Dot variant="warning" size="xs" />
          <Dot variant="destructive" size="xs" />
          <Dot variant="info" size="xs" />
          <Dot variant="neutral" size="xs" />
          <span class="text-xs text-muted-foreground ml-2">Extra Small</span>
        </div>
        <div class="flex items-center gap-4">
          <Dot variant="primary" size="sm" />
          <Dot variant="success" size="sm" />
          <Dot variant="warning" size="sm" />
          <Dot variant="destructive" size="sm" />
          <Dot variant="info" size="sm" />
          <Dot variant="neutral" size="sm" />
          <span class="text-xs text-muted-foreground ml-2">Small</span>
        </div>
        <div class="flex items-center gap-4">
          <Dot variant="primary" size="md" />
          <Dot variant="success" size="md" />
          <Dot variant="warning" size="md" />
          <Dot variant="destructive" size="md" />
          <Dot variant="info" size="md" />
          <Dot variant="neutral" size="md" />
          <span class="text-xs text-muted-foreground ml-2">Medium</span>
        </div>
        <div class="flex items-center gap-4">
          <Dot variant="primary" size="lg" />
          <Dot variant="success" size="lg" />
          <Dot variant="warning" size="lg" />
          <Dot variant="destructive" size="lg" />
          <Dot variant="info" size="lg" />
          <Dot variant="neutral" size="lg" />
          <span class="text-xs text-muted-foreground ml-2">Large</span>
        </div>
        <div class="flex items-center gap-4">
          <Dot variant="primary" size="xl" />
          <Dot variant="success" size="xl" />
          <Dot variant="warning" size="xl" />
          <Dot variant="destructive" size="xl" />
          <Dot variant="info" size="xl" />
          <Dot variant="neutral" size="xl" />
          <span class="text-xs text-muted-foreground ml-2">Extra Large</span>
        </div>
      </div>
    `,
  }),
}

export const CombinedExamples: Story = {
  render: () => ({
    components: { Dot },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <Dot variant="success" size="lg" effect="pulse" />
          <span class="text-sm font-medium">System Online - All services running</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="warning" size="md" effect="pulse" />
          <span class="text-sm font-medium">Maintenance Mode - Scheduled downtime in 1 hour</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="destructive" size="sm" effect="ping" />
          <span class="text-sm font-medium">Critical Alert - Immediate attention required</span>
        </div>
        <div class="flex items-center gap-2">
          <Dot variant="info" size="xs" />
          <span class="text-sm text-muted-foreground">Information - No action needed</span>
        </div>
      </div>
    `,
  }),
}
