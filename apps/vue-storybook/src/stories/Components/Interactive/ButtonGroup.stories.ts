import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconBookmark,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconCopy,
  IconDownload,
  IconHeart,
  IconItalic,
  IconList,
  IconListNumbers,
  IconMessageCircle,
  IconShare,
  IconStrikethrough,
  IconThumbDown,
  IconThumbUp,
  IconUnderline,
} from '@meldui/tabler-vue'
import { Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/Interactive/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Groups multiple buttons together, automatically handling borders and rounded corners. Supports horizontal and vertical orientations with optional separators.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <ButtonGroup>
        <Button variant="outline">First</Button>
        <Button variant="outline">Second</Button>
        <Button variant="outline">Third</Button>
      </ButtonGroup>
    `,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <ButtonGroup orientation="vertical">
        <Button variant="outline">Top</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Bottom</Button>
      </ButtonGroup>
    `,
  }),
}

export const WithSeparators: Story = {
  render: () => ({
    components: { Button, ButtonGroup, ButtonGroupSeparator },
    template: `
      <ButtonGroup>
        <Button variant="outline">Save</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Export</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Share</Button>
      </ButtonGroup>
    `,
  }),
}

export const VerticalWithSeparators: Story = {
  render: () => ({
    components: { Button, ButtonGroup, ButtonGroupSeparator },
    template: `
      <ButtonGroup orientation="vertical">
        <Button variant="outline">Profile</Button>
        <ButtonGroupSeparator orientation="horizontal" />
        <Button variant="outline">Settings</Button>
        <ButtonGroupSeparator orientation="horizontal" />
        <Button variant="outline">Logout</Button>
      </ButtonGroup>
    `,
  }),
}

export const DifferentVariants: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <div class="flex flex-col gap-4">
        <ButtonGroup>
          <Button>Default</Button>
          <Button>Default</Button>
          <Button>Default</Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary">Secondary</Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="outline">Outline</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="outline">Outline</Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost">Ghost</Button>
        </ButtonGroup>
      </div>
    `,
  }),
}

export const IconButtons: Story = {
  render: () => ({
    components: { Button, ButtonGroup, IconBold, IconItalic, IconUnderline, IconStrikethrough },
    template: `
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <IconBold />
        </Button>
        <Button variant="outline" size="icon">
          <IconItalic />
        </Button>
        <Button variant="outline" size="icon">
          <IconUnderline />
        </Button>
        <Button variant="outline" size="icon">
          <IconStrikethrough />
        </Button>
      </ButtonGroup>
    `,
  }),
}

export const TextEditorToolbar: Story = {
  render: () => ({
    components: {
      Button,
      ButtonGroup,
      ButtonGroupSeparator,
      IconBold,
      IconItalic,
      IconUnderline,
      IconList,
      IconListNumbers,
      IconAlignLeft,
      IconAlignCenter,
      IconAlignRight,
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <ButtonGroup>
          <Button variant="outline" size="icon-sm">
            <IconBold />
          </Button>
          <Button variant="outline" size="icon-sm">
            <IconItalic />
          </Button>
          <Button variant="outline" size="icon-sm">
            <IconUnderline />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="outline" size="icon-sm">
            <IconList />
          </Button>
          <Button variant="outline" size="icon-sm">
            <IconListNumbers />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="outline" size="icon-sm">
            <IconAlignLeft />
          </Button>
          <Button variant="outline" size="icon-sm">
            <IconAlignCenter />
          </Button>
          <Button variant="outline" size="icon-sm">
            <IconAlignRight />
          </Button>
        </ButtonGroup>
      </div>
    `,
  }),
}

export const WithText: Story = {
  render: () => ({
    components: { Button, ButtonGroup, ButtonGroupText, IconCode },
    template: `
      <ButtonGroup>
        <ButtonGroupText>Format:</ButtonGroupText>
        <Button variant="outline" size="sm">
          <IconCode />
          Code
        </Button>
        <Button variant="outline" size="sm">Text</Button>
        <Button variant="outline" size="sm">Markdown</Button>
      </ButtonGroup>
    `,
  }),
}

export const PaginationStyle: Story = {
  render: () => ({
    components: { Button, ButtonGroup, IconChevronLeft, IconChevronRight },
    template: `
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <IconChevronLeft />
        </Button>
        <Button variant="outline">1</Button>
        <Button variant="outline">2</Button>
        <Button>3</Button>
        <Button variant="outline">4</Button>
        <Button variant="outline">5</Button>
        <Button variant="outline" size="icon">
          <IconChevronRight />
        </Button>
      </ButtonGroup>
    `,
  }),
}

export const ActionButtons: Story = {
  render: () => ({
    components: { Button, ButtonGroup, IconCopy, IconDownload, IconShare },
    template: `
      <ButtonGroup>
        <Button variant="outline">
          <IconCopy />
          Copy
        </Button>
        <Button variant="outline">
          <IconDownload />
          Download
        </Button>
        <Button variant="outline">
          <IconShare />
          Share
        </Button>
      </ButtonGroup>
    `,
  }),
}

export const SocialActions: Story = {
  render: () => ({
    components: {
      Button,
      ButtonGroup,
      ButtonGroupSeparator,
      IconHeart,
      IconMessageCircle,
      IconBookmark,
    },
    template: `
      <ButtonGroup>
        <Button variant="ghost" size="sm">
          <IconHeart />
          24
        </Button>
        <ButtonGroupSeparator />
        <Button variant="ghost" size="sm">
          <IconMessageCircle />
          12
        </Button>
        <ButtonGroupSeparator />
        <Button variant="ghost" size="sm">
          <IconBookmark />
        </Button>
      </ButtonGroup>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <div class="mb-2 text-xs text-muted-foreground">Small</div>
          <ButtonGroup>
            <Button variant="outline" size="sm">First</Button>
            <Button variant="outline" size="sm">Second</Button>
            <Button variant="outline" size="sm">Third</Button>
          </ButtonGroup>
        </div>

        <div>
          <div class="mb-2 text-xs text-muted-foreground">Default</div>
          <ButtonGroup>
            <Button variant="outline">First</Button>
            <Button variant="outline">Second</Button>
            <Button variant="outline">Third</Button>
          </ButtonGroup>
        </div>

        <div>
          <div class="mb-2 text-xs text-muted-foreground">Large</div>
          <ButtonGroup>
            <Button variant="outline" size="lg">First</Button>
            <Button variant="outline" size="lg">Second</Button>
            <Button variant="outline" size="lg">Third</Button>
          </ButtonGroup>
        </div>
      </div>
    `,
  }),
}

export const MixedContent: Story = {
  render: () => ({
    components: {
      Button,
      ButtonGroup,
      ButtonGroupText,
      ButtonGroupSeparator,
      IconBold,
      IconItalic,
    },
    template: `
      <ButtonGroup>
        <ButtonGroupText>Style:</ButtonGroupText>
        <Button variant="outline" size="icon-sm">
          <IconBold />
        </Button>
        <Button variant="outline" size="icon-sm">
          <IconItalic />
        </Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>Size:</ButtonGroupText>
        <Button variant="outline" size="sm">12</Button>
        <Button variant="outline" size="sm">14</Button>
        <Button variant="outline" size="sm">16</Button>
      </ButtonGroup>
    `,
  }),
}

export const WithDisabled: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <ButtonGroup>
        <Button variant="outline">Active</Button>
        <Button variant="outline" disabled>Disabled</Button>
        <Button variant="outline">Active</Button>
      </ButtonGroup>
    `,
  }),
}

export const VoteButtons: Story = {
  render: () => ({
    components: { Button, ButtonGroup, ButtonGroupSeparator, IconThumbUp, IconThumbDown },
    template: `
      <ButtonGroup>
        <Button variant="outline" size="sm">
          <IconThumbUp />
          42
        </Button>
        <ButtonGroupSeparator />
        <Button variant="outline" size="sm">
          <IconThumbDown />
          3
        </Button>
      </ButtonGroup>
    `,
  }),
}

export const FullWidth: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <ButtonGroup class="w-full">
        <Button variant="outline" class="flex-1">Left</Button>
        <Button variant="outline" class="flex-1">Center</Button>
        <Button variant="outline" class="flex-1">Right</Button>
      </ButtonGroup>
    `,
  }),
}

export const NestedGroups: Story = {
  render: () => ({
    components: {
      Button,
      ButtonGroup,
      ButtonGroupSeparator,
      IconBold,
      IconItalic,
      IconAlignLeft,
      IconAlignCenter,
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <div class="flex gap-2">
          <ButtonGroup>
            <Button variant="outline" size="icon-sm">
              <IconBold />
            </Button>
            <Button variant="outline" size="icon-sm">
              <IconItalic />
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="outline" size="icon-sm">
              <IconAlignLeft />
            </Button>
            <Button variant="outline" size="icon-sm">
              <IconAlignCenter />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: { Button, ButtonGroup, ButtonGroupSeparator, IconCopy, IconDownload, IconShare },
    template: `
      <div class="w-full max-w-md rounded-lg border p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Document Actions</h3>
          <p class="text-sm text-muted-foreground">Choose an action to perform on this document</p>
        </div>
        <ButtonGroup class="w-full">
          <Button variant="outline" class="flex-1">
            <IconCopy />
            Copy
          </Button>
          <ButtonGroupSeparator />
          <Button variant="outline" class="flex-1">
            <IconDownload />
            Download
          </Button>
          <ButtonGroupSeparator />
          <Button variant="outline" class="flex-1">
            <IconShare />
            Share
          </Button>
        </ButtonGroup>
      </div>
    `,
  }),
}
