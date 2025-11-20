import { Button, Spinner } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner />',
  }),
}

export const Small: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner class="size-3" />',
  }),
}

export const Medium: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner class="size-6" />',
  }),
}

export const Large: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner class="size-8" />',
  }),
}

export const ExtraLarge: Story = {
  render: () => ({
    components: { Spinner },
    template: '<Spinner class="size-12" />',
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-8">
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-3" />
          <span class="text-xs text-muted-foreground">XS (12px)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-4" />
          <span class="text-xs text-muted-foreground">SM (16px)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-6" />
          <span class="text-xs text-muted-foreground">MD (24px)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-8" />
          <span class="text-xs text-muted-foreground">LG (32px)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner class="size-12" />
          <span class="text-xs text-muted-foreground">XL (48px)</span>
        </div>
      </div>
    `,
  }),
}

export const CustomColor: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-8">
        <Spinner class="size-8 text-blue-500" />
        <Spinner class="size-8 text-green-500" />
        <Spinner class="size-8 text-red-500" />
        <Spinner class="size-8 text-purple-500" />
        <Spinner class="size-8 text-orange-500" />
      </div>
    `,
  }),
}

export const InButton: Story = {
  render: () => ({
    components: { Spinner, Button },
    template: `
      <div class="flex gap-4">
        <Button disabled>
          <Spinner class="mr-2" />
          Loading...
        </Button>
        <Button variant="secondary" disabled>
          <Spinner class="mr-2" />
          Processing
        </Button>
        <Button variant="outline" disabled>
          <Spinner class="mr-2" />
          Please wait
        </Button>
      </div>
    `,
  }),
}

export const ButtonIconOnly: Story = {
  render: () => ({
    components: { Spinner, Button },
    template: `
      <div class="flex gap-4">
        <Button size="icon" disabled>
          <Spinner />
        </Button>
        <Button size="icon" variant="secondary" disabled>
          <Spinner />
        </Button>
        <Button size="icon" variant="outline" disabled>
          <Spinner />
        </Button>
      </div>
    `,
  }),
}

export const Centered: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center justify-center h-[200px] border rounded-lg">
        <Spinner class="size-8" />
      </div>
    `,
  }),
}

export const WithText: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex flex-col items-center gap-3">
        <Spinner class="size-8" />
        <p class="text-sm text-muted-foreground">Loading data...</p>
      </div>
    `,
  }),
}

export const Inline: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-2">
        <Spinner class="size-4" />
        <span class="text-sm">Processing your request</span>
      </div>
    `,
  }),
}

export const Card: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="w-[350px] p-6 border rounded-lg">
        <div class="flex flex-col items-center gap-4">
          <Spinner class="size-10" />
          <div class="text-center space-y-2">
            <h3 class="font-medium">Loading your dashboard</h3>
            <p class="text-sm text-muted-foreground">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    `,
  }),
}

export const FullPage: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center justify-center h-[400px] w-full">
        <div class="flex flex-col items-center gap-4">
          <Spinner class="size-12" />
          <div class="text-center space-y-2">
            <h2 class="text-lg font-semibold">Loading Application</h2>
            <p class="text-sm text-muted-foreground">Initializing components...</p>
          </div>
        </div>
      </div>
    `,
  }),
}

export const Multiple: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex flex-col gap-6 w-[400px]">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="text-sm font-medium">Uploading files</span>
          <Spinner class="size-4" />
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="text-sm font-medium">Processing images</span>
          <Spinner class="size-4" />
        </div>
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <span class="text-sm font-medium">Generating thumbnails</span>
          <Spinner class="size-4" />
        </div>
      </div>
    `,
  }),
}

export const Overlay: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="relative w-[400px] h-[300px] border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Content Area</h3>
        <p class="text-sm text-muted-foreground mb-4">
          This is some content that will be covered by a loading overlay.
        </p>
        <div class="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div class="flex flex-col items-center gap-3">
            <Spinner class="size-8" />
            <span class="text-sm font-medium">Loading...</span>
          </div>
        </div>
      </div>
    `,
  }),
}
