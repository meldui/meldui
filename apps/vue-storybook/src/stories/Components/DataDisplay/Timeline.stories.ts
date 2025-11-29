import {
  IconCheck,
  IconCircleDashed,
  IconGitCommit,
  IconPackage,
  IconRocket,
  IconTruck,
  IconUser,
} from '@meldui/tabler-vue'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineSeparator,
  TimelineTime,
  TimelineTitle,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Timeline> = {
  title: 'Components/DataDisplay/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A timeline component for displaying a sequence of events or steps. Supports vertical and horizontal orientations, alternate layout variants, and active state tracking.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation of the timeline',
    },
    variant: {
      control: 'select',
      options: ['default', 'alternate'],
      description: 'Layout variant - alternate creates a zigzag pattern',
    },
    activeIndex: {
      control: 'number',
      description: 'Index of the currently active item (0-based). Items before are completed, after are pending.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Timeline>

export const Default: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      TimelineTime,
    },
    template: `
      <Timeline class="max-w-md">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Order Placed</TimelineTitle>
              <TimelineTime date-time="2024-01-15">Jan 15</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Your order has been confirmed and is being processed.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Payment Confirmed</TimelineTitle>
              <TimelineTime date-time="2024-01-15">Jan 15</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Payment was successfully processed.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Shipped</TimelineTitle>
              <TimelineTime date-time="2024-01-16">Jan 16</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Your package is on its way.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Delivered</TimelineTitle>
              <TimelineTime date-time="2024-01-18">Jan 18</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Package delivered to your address.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}

export const WithActiveIndex: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      TimelineTime,
      IconCheck,
    },
    template: `
      <Timeline :active-index="2" class="max-w-md">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="bg-primary text-primary-foreground">
              <IconCheck class="size-3" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Order Placed</TimelineTitle>
              <TimelineTime date-time="2024-01-15">Jan 15</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Your order has been confirmed.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="bg-primary text-primary-foreground">
              <IconCheck class="size-3" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Payment Confirmed</TimelineTitle>
              <TimelineTime date-time="2024-01-15">Jan 15</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Payment was successfully processed.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="bg-primary text-primary-foreground" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Shipped</TimelineTitle>
              <TimelineTime date-time="2024-01-16">Jan 16</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Your package is on its way.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Delivered</TimelineTitle>
            </TimelineHeader>
            <TimelineDescription>Awaiting delivery.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      TimelineTime,
      IconPackage,
      IconCheck,
      IconTruck,
      IconRocket,
    },
    template: `
      <Timeline :active-index="2" class="max-w-md">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-green-500 text-white">
              <IconCheck class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Order Placed</TimelineTitle>
              <TimelineTime date-time="2024-01-15">Jan 15, 2024</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Your order #12345 has been confirmed.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-green-500 text-white">
              <IconPackage class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Processing</TimelineTitle>
              <TimelineTime date-time="2024-01-16">Jan 16, 2024</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>We're preparing your order for shipment.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-blue-500 text-white">
              <IconTruck class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>In Transit</TimelineTitle>
              <TimelineTime date-time="2024-01-17">Jan 17, 2024</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Your package is on its way to you.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 border-2 border-muted-foreground/30 bg-background">
              <IconRocket class="size-4 text-muted-foreground" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Delivered</TimelineTitle>
            </TimelineHeader>
            <TimelineDescription>Expected delivery on Jan 18, 2024.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}

export const AlternateVariant: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      TimelineTime,
      IconGitCommit,
    },
    template: `
      <Timeline variant="alternate" :active-index="3" class="max-w-2xl mx-auto">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-primary text-primary-foreground">
              <IconGitCommit class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Project Kickoff</TimelineTitle>
              <TimelineTime date-time="2024-01-01">Jan 2024</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Initial planning and requirements gathering phase.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-primary text-primary-foreground">
              <IconGitCommit class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Design Phase</TimelineTitle>
              <TimelineTime date-time="2024-02-01">Feb 2024</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>UI/UX design and prototyping completed.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-primary text-primary-foreground">
              <IconGitCommit class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Development</TimelineTitle>
              <TimelineTime date-time="2024-03-01">Mar 2024</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Core features implementation in progress.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-primary text-primary-foreground">
              <IconGitCommit class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Testing</TimelineTitle>
              <TimelineTime date-time="2024-04-01">Apr 2024</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>QA testing and bug fixes.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 border-2 border-muted-foreground/30 bg-background">
              <IconGitCommit class="size-4 text-muted-foreground" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Launch</TimelineTitle>
              <TimelineTime date-time="2024-05-01">May 2024</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Public release and deployment.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}

export const Horizontal: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      IconCheck,
      IconCircleDashed,
    },
    template: `
      <Timeline orientation="horizontal" :active-index="1" class="w-full">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-primary text-primary-foreground">
              <IconCheck class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Step 1</TimelineTitle>
            <TimelineDescription>Account created</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-primary text-primary-foreground">
              <IconCircleDashed class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Step 2</TimelineTitle>
            <TimelineDescription>Profile setup</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 border-2 border-muted-foreground/30 bg-background">
              <span class="text-xs text-muted-foreground font-medium">3</span>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Step 3</TimelineTitle>
            <TimelineDescription>Preferences</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 border-2 border-muted-foreground/30 bg-background">
              <span class="text-xs text-muted-foreground font-medium">4</span>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Step 4</TimelineTitle>
            <TimelineDescription>Complete</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}

export const HorizontalAlternate: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      IconCheck,
      IconCircleDashed,
    },
    template: `
      <Timeline orientation="horizontal" variant="alternate" :active-index="1" class="w-full">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-primary text-primary-foreground">
              <IconCheck class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Step 1</TimelineTitle>
            <TimelineDescription>Account created</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 bg-primary text-primary-foreground">
              <IconCircleDashed class="size-4" />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Step 2</TimelineTitle>
            <TimelineDescription>Profile setup</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 border-2 border-muted-foreground/30 bg-background">
              <span class="text-xs text-muted-foreground font-medium">3</span>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Step 3</TimelineTitle>
            <TimelineDescription>Preferences</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="lg" class="size-8 border-2 border-muted-foreground/30 bg-background">
              <span class="text-xs text-muted-foreground font-medium">4</span>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTitle>Step 4</TimelineTitle>
            <TimelineDescription>Complete</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}

export const DotSizes: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineTitle,
      TimelineDescription,
    },
    template: `
      <div class="space-y-8">
        <div>
          <p class="text-sm text-muted-foreground mb-4">Small dots (size="sm"):</p>
          <Timeline class="max-w-md">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot size="sm" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event One</TimelineTitle>
                <TimelineDescription>Small dot indicator</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot size="sm" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Two</TimelineTitle>
                <TimelineDescription>Compact timeline style</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        <div>
          <p class="text-sm text-muted-foreground mb-4">Medium dots (size="md", default):</p>
          <Timeline class="max-w-md">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot size="md" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event One</TimelineTitle>
                <TimelineDescription>Default dot size</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot size="md" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Two</TimelineTitle>
                <TimelineDescription>Standard timeline style</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        <div>
          <p class="text-sm text-muted-foreground mb-4">Large dots (size="lg"):</p>
          <Timeline class="max-w-md">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot size="lg" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event One</TimelineTitle>
                <TimelineDescription>Large dot indicator</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot size="lg" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Two</TimelineTitle>
                <TimelineDescription>Prominent timeline style</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    `,
  }),
}

export const ConnectorThickness: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineTitle,
    },
    template: `
      <div class="flex gap-12">
        <div>
          <p class="text-sm text-muted-foreground mb-4">Thin:</p>
          <Timeline :active-index="1" class="max-w-xs">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="thin" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event One</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="thin" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Two</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="thin" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Three</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        <div>
          <p class="text-sm text-muted-foreground mb-4">Default:</p>
          <Timeline :active-index="1" class="max-w-xs">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="default" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event One</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="default" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Two</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="default" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Three</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        <div>
          <p class="text-sm text-muted-foreground mb-4">Thick:</p>
          <Timeline :active-index="1" class="max-w-xs">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="thick" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event One</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="thick" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Two</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector thickness="thick" />
              </TimelineSeparator>
              <TimelineContent>
                <TimelineTitle>Event Three</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    `,
  }),
}

export const WithAvatars: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      TimelineTime,
      Avatar,
      AvatarImage,
      AvatarFallback,
    },
    template: `
      <Timeline class="max-w-lg">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot class="size-10 p-0 overflow-hidden">
              <Avatar class="size-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>John commented on your post</TimelineTitle>
              <TimelineTime date-time="2024-01-15T10:30:00">10:30 AM</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>"Great work on this project! Looking forward to the next update."</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot class="size-10 p-0 overflow-hidden">
              <Avatar class="size-10">
                <AvatarImage src="https://github.com/vercel.png" alt="User" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Sarah liked your post</TimelineTitle>
              <TimelineTime date-time="2024-01-15T09:15:00">9:15 AM</TimelineTime>
            </TimelineHeader>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot class="size-10 p-0 overflow-hidden">
              <Avatar class="size-10">
                <AvatarImage src="https://github.com/react.png" alt="User" />
                <AvatarFallback>RC</AvatarFallback>
              </Avatar>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Mike started following you</TimelineTitle>
              <TimelineTime date-time="2024-01-14T16:45:00">Yesterday</TimelineTime>
            </TimelineHeader>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}

export const CustomStyling: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      TimelineTime,
    },
    template: `
      <Timeline class="max-w-md">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot class="size-6 bg-green-500 ring-4 ring-green-500/20" />
            <TimelineConnector class="bg-gradient-to-b from-green-500 to-blue-500" thickness="thick" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle class="text-green-600">Success</TimelineTitle>
              <TimelineTime>Just now</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Operation completed successfully.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot class="size-6 bg-blue-500 ring-4 ring-blue-500/20" />
            <TimelineConnector class="bg-gradient-to-b from-blue-500 to-yellow-500" thickness="thick" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle class="text-blue-600">In Progress</TimelineTitle>
              <TimelineTime>2 min ago</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Processing your request...</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot class="size-6 bg-yellow-500 ring-4 ring-yellow-500/20" />
            <TimelineConnector class="bg-gradient-to-b from-yellow-500 to-gray-300" thickness="thick" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle class="text-yellow-600">Warning</TimelineTitle>
              <TimelineTime>5 min ago</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Please review the changes before proceeding.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot class="size-6 bg-gray-300 ring-4 ring-gray-300/20" />
            <TimelineConnector thickness="thick" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>Pending</TimelineTitle>
              <TimelineTime>10 min ago</TimelineTime>
            </TimelineHeader>
            <TimelineDescription>Waiting for approval.</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}

export const ActivityFeed: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineHeader,
      TimelineTitle,
      TimelineDescription,
      TimelineTime,
      IconUser,
      IconGitCommit,
      IconCheck,
    },
    template: `
      <div class="rounded-lg border p-4 max-w-lg">
        <h3 class="font-semibold mb-4">Recent Activity</h3>
        <Timeline>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot size="lg" class="size-7 bg-blue-100 text-blue-600">
                <IconGitCommit class="size-4" />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>New commit pushed</TimelineTitle>
                <TimelineTime>2m ago</TimelineTime>
              </TimelineHeader>
              <TimelineDescription class="font-mono text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                fix: resolve login issue #234
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot size="lg" class="size-7 bg-green-100 text-green-600">
                <IconCheck class="size-4" />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Build succeeded</TimelineTitle>
                <TimelineTime>5m ago</TimelineTime>
              </TimelineHeader>
              <TimelineDescription>All tests passed (42/42)</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot size="lg" class="size-7 bg-purple-100 text-purple-600">
                <IconUser class="size-4" />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>New team member added</TimelineTitle>
                <TimelineTime>1h ago</TimelineTime>
              </TimelineHeader>
              <TimelineDescription>Sarah joined the project as a developer.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot size="lg" class="size-7 bg-blue-100 text-blue-600">
                <IconGitCommit class="size-4" />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>Branch merged</TimelineTitle>
                <TimelineTime>3h ago</TimelineTime>
              </TimelineHeader>
              <TimelineDescription>feature/user-auth merged into main</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
    `,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineTitle,
      TimelineDescription,
      IconCheck,
    },
    setup() {
      const activeStep = ref(0)
      const steps = [
        { title: 'Account', description: 'Create your account' },
        { title: 'Profile', description: 'Set up your profile' },
        { title: 'Preferences', description: 'Configure settings' },
        { title: 'Complete', description: 'All done!' },
      ]
      const nextStep = () => {
        if (activeStep.value < steps.length - 1) {
          activeStep.value++
        }
      }
      const prevStep = () => {
        if (activeStep.value > 0) {
          activeStep.value--
        }
      }
      const reset = () => {
        activeStep.value = 0
      }
      return { activeStep, steps, nextStep, prevStep, reset }
    },
    template: `
      <div class="space-y-6 max-w-md">
        <Timeline :active-index="activeStep">
          <TimelineItem v-for="(step, index) in steps" :key="index">
            <TimelineSeparator>
              <TimelineDot size="lg" :class="[
                'size-8 transition-all duration-300',
                index < activeStep ? 'bg-primary text-primary-foreground' : '',
                index === activeStep ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : '',
                index > activeStep ? 'border-2 border-muted-foreground/30 bg-background' : ''
              ]">
                <IconCheck v-if="index < activeStep" class="size-4" />
                <span v-else class="text-xs font-medium" :class="index > activeStep ? 'text-muted-foreground' : ''">
                  {{ index + 1 }}
                </span>
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineTitle>{{ step.title }}</TimelineTitle>
              <TimelineDescription>{{ step.description }}</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>

        <div class="flex gap-2">
          <button
            @click="prevStep"
            :disabled="activeStep === 0"
            class="px-4 py-2 text-sm rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
          >
            Previous
          </button>
          <button
            @click="nextStep"
            :disabled="activeStep === steps.length - 1"
            class="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            @click="reset"
            class="px-4 py-2 text-sm rounded-md border hover:bg-muted ml-auto"
          >
            Reset
          </button>
        </div>
      </div>
    `,
  }),
}

export const MinimalStyle: Story = {
  render: () => ({
    components: {
      Timeline,
      TimelineItem,
      TimelineSeparator,
      TimelineDot,
      TimelineConnector,
      TimelineContent,
      TimelineTitle,
      TimelineTime,
    },
    template: `
      <Timeline class="max-w-sm">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="sm" class="bg-foreground" />
            <TimelineConnector thickness="thin" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTime class="text-xs">January 2024</TimelineTime>
            <TimelineTitle class="text-sm">Started the project</TimelineTitle>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="sm" class="bg-foreground" />
            <TimelineConnector thickness="thin" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTime class="text-xs">February 2024</TimelineTime>
            <TimelineTitle class="text-sm">Released beta version</TimelineTitle>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="sm" class="bg-foreground" />
            <TimelineConnector thickness="thin" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTime class="text-xs">March 2024</TimelineTime>
            <TimelineTitle class="text-sm">Gathered user feedback</TimelineTitle>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot size="sm" class="bg-muted-foreground/50" />
            <TimelineConnector thickness="thin" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineTime class="text-xs">April 2024</TimelineTime>
            <TimelineTitle class="text-sm text-muted-foreground">Public launch (upcoming)</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    `,
  }),
}
