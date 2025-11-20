import { Skeleton } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => ({
    components: { Skeleton },
    template: '<Skeleton class="h-12 w-[250px]" />',
  }),
}

export const Circle: Story = {
  render: () => ({
    components: { Skeleton },
    template: '<Skeleton class="h-12 w-12 rounded-full" />',
  }),
}

export const Rectangle: Story = {
  render: () => ({
    components: { Skeleton },
    template: '<Skeleton class="h-32 w-[250px]" />',
  }),
}

export const TextLines: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex flex-col gap-2 w-[350px]">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
      </div>
    `,
  }),
}

export const Card: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex flex-col gap-3 w-[350px]">
        <Skeleton class="h-[200px] w-full rounded-lg" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-4/5" />
        </div>
      </div>
    `,
  }),
}

export const Avatar: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex items-center gap-4">
        <Skeleton class="h-12 w-12 rounded-full" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>
    `,
  }),
}

export const CardWithAvatar: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex flex-col gap-3 w-[350px] p-6 border rounded-lg">
        <div class="flex items-center gap-4">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[150px]" />
            <Skeleton class="h-3 w-[100px]" />
          </div>
        </div>
        <Skeleton class="h-[150px] w-full rounded-lg" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-3/4" />
        </div>
      </div>
    `,
  }),
}

export const List: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex flex-col gap-4 w-[400px]">
        <div class="flex items-center gap-4">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-3 w-3/4" />
          </div>
        </div>
        <div class="flex items-center gap-4">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-3 w-3/4" />
          </div>
        </div>
        <div class="flex items-center gap-4">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-3 w-3/4" />
          </div>
        </div>
      </div>
    `,
  }),
}

export const Table: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="w-[600px]">
        <div class="flex gap-4 mb-4">
          <Skeleton class="h-10 w-[100px]" />
          <Skeleton class="h-10 flex-1" />
          <Skeleton class="h-10 w-[100px]" />
          <Skeleton class="h-10 w-[80px]" />
        </div>
        <div class="space-y-2">
          <div class="flex gap-4">
            <Skeleton class="h-8 w-[100px]" />
            <Skeleton class="h-8 flex-1" />
            <Skeleton class="h-8 w-[100px]" />
            <Skeleton class="h-8 w-[80px]" />
          </div>
          <div class="flex gap-4">
            <Skeleton class="h-8 w-[100px]" />
            <Skeleton class="h-8 flex-1" />
            <Skeleton class="h-8 w-[100px]" />
            <Skeleton class="h-8 w-[80px]" />
          </div>
          <div class="flex gap-4">
            <Skeleton class="h-8 w-[100px]" />
            <Skeleton class="h-8 flex-1" />
            <Skeleton class="h-8 w-[100px]" />
            <Skeleton class="h-8 w-[80px]" />
          </div>
        </div>
      </div>
    `,
  }),
}

export const Form: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex flex-col gap-6 w-[400px]">
        <div class="space-y-2">
          <Skeleton class="h-4 w-[100px]" />
          <Skeleton class="h-10 w-full" />
        </div>
        <div class="space-y-2">
          <Skeleton class="h-4 w-[120px]" />
          <Skeleton class="h-10 w-full" />
        </div>
        <div class="space-y-2">
          <Skeleton class="h-4 w-[80px]" />
          <Skeleton class="h-24 w-full" />
        </div>
        <Skeleton class="h-10 w-[120px]" />
      </div>
    `,
  }),
}

export const Blog: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex flex-col gap-6 w-[600px]">
        <div class="space-y-3">
          <Skeleton class="h-8 w-3/4" />
          <div class="flex items-center gap-4">
            <Skeleton class="h-8 w-8 rounded-full" />
            <Skeleton class="h-4 w-[150px]" />
            <Skeleton class="h-4 w-[100px]" />
          </div>
        </div>
        <Skeleton class="h-[300px] w-full rounded-lg" />
        <div class="space-y-3">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-3/4" />
        </div>
      </div>
    `,
  }),
}

export const Dashboard: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="space-y-6 w-[700px]">
        <div class="flex items-center justify-between">
          <Skeleton class="h-8 w-[200px]" />
          <Skeleton class="h-10 w-[120px]" />
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="space-y-3 p-6 border rounded-lg">
            <Skeleton class="h-4 w-[100px]" />
            <Skeleton class="h-8 w-[120px]" />
            <Skeleton class="h-3 w-[80px]" />
          </div>
          <div class="space-y-3 p-6 border rounded-lg">
            <Skeleton class="h-4 w-[100px]" />
            <Skeleton class="h-8 w-[120px]" />
            <Skeleton class="h-3 w-[80px]" />
          </div>
          <div class="space-y-3 p-6 border rounded-lg">
            <Skeleton class="h-4 w-[100px]" />
            <Skeleton class="h-8 w-[120px]" />
            <Skeleton class="h-3 w-[80px]" />
          </div>
        </div>
        <Skeleton class="h-[300px] w-full rounded-lg" />
      </div>
    `,
  }),
}

export const ProductCard: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="grid grid-cols-3 gap-4 w-[700px]">
        <div class="flex flex-col gap-3">
          <Skeleton class="h-[200px] w-full rounded-lg" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-6 w-[80px]" />
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <Skeleton class="h-[200px] w-full rounded-lg" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-6 w-[80px]" />
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <Skeleton class="h-[200px] w-full rounded-lg" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-6 w-[80px]" />
          </div>
        </div>
      </div>
    `,
  }),
}
