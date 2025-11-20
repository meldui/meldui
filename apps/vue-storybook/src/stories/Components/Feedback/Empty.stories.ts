import {
  IconCloudOff,
  IconFileOff,
  IconFolderOpen,
  IconInbox,
  IconSearch,
  IconUsers,
} from '@meldui/tabler-vue'
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Empty> = {
  title: 'Components/Feedback/Empty',
  component: Empty,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = {
  render: () => ({
    components: { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, IconInbox },
    template: `
      <Empty>
        <EmptyMedia variant="icon">
          <IconInbox />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No messages</EmptyTitle>
          <EmptyDescription>You don't have any messages yet.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    `,
  }),
}

export const WithAction: Story = {
  render: () => ({
    components: {
      Empty,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      EmptyDescription,
      EmptyContent,
      Button,
      IconFileOff,
    },
    template: `
      <Empty>
        <EmptyMedia variant="icon">
          <IconFileOff />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No files found</EmptyTitle>
          <EmptyDescription>Upload your first file to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Upload File</Button>
        </EmptyContent>
      </Empty>
    `,
  }),
}

export const SearchResults: Story = {
  render: () => ({
    components: {
      Empty,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      EmptyDescription,
      IconSearch,
    },
    template: `
      <Empty>
        <EmptyMedia variant="icon">
          <IconSearch />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>
            We couldn't find any results matching your search. Try adjusting your filters.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    `,
  }),
}

export const NoUsers: Story = {
  render: () => ({
    components: {
      Empty,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      EmptyDescription,
      EmptyContent,
      Button,
      IconUsers,
    },
    template: `
      <Empty>
        <EmptyMedia variant="icon">
          <IconUsers />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No team members</EmptyTitle>
          <EmptyDescription>
            Get started by inviting your team members to collaborate.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Invite Team Members</Button>
        </EmptyContent>
      </Empty>
    `,
  }),
}

export const LargeIcon: Story = {
  render: () => ({
    components: {
      Empty,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      EmptyDescription,
      IconFolderOpen,
    },
    template: `
      <Empty>
        <EmptyMedia>
          <IconFolderOpen class="size-16 text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Create your first project to get started.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    `,
  }),
}

export const MultipleActions: Story = {
  render: () => ({
    components: {
      Empty,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      EmptyDescription,
      EmptyContent,
      Button,
      IconCloudOff,
    },
    template: `
      <Empty>
        <EmptyMedia variant="icon">
          <IconCloudOff />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Connection lost</EmptyTitle>
          <EmptyDescription>
            We're having trouble connecting to the server. Please check your connection.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div class="flex gap-2">
            <Button variant="outline">Retry</Button>
            <Button>Go Offline</Button>
          </div>
        </EmptyContent>
      </Empty>
    `,
  }),
}

export const InContainer: Story = {
  render: () => ({
    components: {
      Empty,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      EmptyDescription,
      EmptyContent,
      Button,
      IconInbox,
    },
    template: `
      <div class="border rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <Empty>
          <EmptyMedia variant="icon">
            <IconInbox />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Your inbox is empty</EmptyTitle>
            <EmptyDescription>
              All caught up! You have no new messages.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    `,
  }),
}

export const WithLink: Story = {
  render: () => ({
    components: {
      Empty,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      EmptyDescription,
      IconFileOff,
    },
    template: `
      <Empty>
        <EmptyMedia variant="icon">
          <IconFileOff />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No documents</EmptyTitle>
          <EmptyDescription>
            You haven't created any documents yet.
            <a href="#" class="underline">Learn how to get started</a>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    `,
  }),
}

export const Minimal: Story = {
  render: () => ({
    components: { Empty, EmptyHeader, EmptyTitle, IconInbox },
    template: `
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No items</EmptyTitle>
        </EmptyHeader>
      </Empty>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: {
      Empty,
      EmptyHeader,
      EmptyMedia,
      EmptyTitle,
      EmptyDescription,
      EmptyContent,
      Button,
      IconInbox,
      IconFileOff,
      IconSearch,
    },
    template: `
      <div class="flex flex-col gap-8">
        <div class="border rounded-lg p-4">
          <Empty>
            <EmptyMedia>
              <IconInbox class="size-12 text-muted-foreground" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Default Variant (Large Icon)</EmptyTitle>
              <EmptyDescription>Large icon without background</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>

        <div class="border rounded-lg p-4">
          <Empty>
            <EmptyMedia variant="icon">
              <IconFileOff />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Icon Variant</EmptyTitle>
              <EmptyDescription>Icon with background container</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">Take Action</Button>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    `,
  }),
}
