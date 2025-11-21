import { IconUser } from '@meldui/tabler-vue'
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Avatar> = {
  title: 'Components/DataDisplay/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An image element with a fallback for representing a user or entity. Displays initials or icons when image fails to load.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    `,
  }),
}

export const Fallback: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <Avatar>
        <AvatarImage src="https://invalid-url.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { Avatar, AvatarFallback, IconUser },
    template: `
      <Avatar>
        <AvatarFallback>
          <IconUser :size="20" />
        </AvatarFallback>
      </Avatar>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="flex items-center gap-4">
        <Avatar class="size-6">
          <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
          <AvatarFallback class="text-xs">XS</AvatarFallback>
        </Avatar>
        <Avatar class="size-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
          <AvatarFallback class="text-xs">SM</AvatarFallback>
        </Avatar>
        <Avatar class="size-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="Medium" />
          <AvatarFallback class="text-sm">MD</AvatarFallback>
        </Avatar>
        <Avatar class="size-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <Avatar class="size-16">
          <AvatarImage src="https://github.com/shadcn.png" alt="Extra Large" />
          <AvatarFallback class="text-lg">XL</AvatarFallback>
        </Avatar>
      </div>
    `,
  }),
}

export const CustomColors: Story = {
  render: () => ({
    components: { Avatar, AvatarFallback },
    template: `
      <div class="flex items-center gap-4">
        <Avatar>
          <AvatarFallback class="!bg-blue-500 text-white">BL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback class="!bg-green-500 text-white">GR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback class="!bg-red-500 text-white">RD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback class="!bg-purple-500 text-white">PR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback class="!bg-orange-500 text-white">OR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback class="!bg-pink-500 text-white">PK</AvatarFallback>
        </Avatar>
      </div>
    `,
  }),
}

export const Shapes: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="flex items-center gap-4">
        <Avatar class="rounded-full">
          <AvatarImage src="https://github.com/shadcn.png" alt="Circle" />
          <AvatarFallback>RD</AvatarFallback>
        </Avatar>
        <Avatar class="rounded-lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="Rounded" />
          <AvatarFallback>RD</AvatarFallback>
        </Avatar>
        <Avatar class="rounded-md">
          <AvatarImage src="https://github.com/shadcn.png" alt="Medium Rounded" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar class="rounded-sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="Small Rounded" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar class="rounded-none">
          <AvatarImage src="https://github.com/shadcn.png" alt="Square" />
          <AvatarFallback>SQ</AvatarFallback>
        </Avatar>
      </div>
    `,
  }),
}

export const WithBorder: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="flex items-center gap-4">
        <Avatar class="border-2 border-primary">
          <AvatarImage src="https://github.com/shadcn.png" alt="Primary Border" />
          <AvatarFallback>PB</AvatarFallback>
        </Avatar>
        <Avatar class="border-2 border-secondary">
          <AvatarImage src="https://github.com/shadcn.png" alt="Secondary Border" />
          <AvatarFallback>SB</AvatarFallback>
        </Avatar>
        <Avatar class="border-4 border-green-500">
          <AvatarImage src="https://github.com/shadcn.png" alt="Thick Green Border" />
          <AvatarFallback>GB</AvatarFallback>
        </Avatar>
        <Avatar class="ring-2 ring-blue-500 ring-offset-2">
          <AvatarImage src="https://github.com/shadcn.png" alt="Ring" />
          <AvatarFallback>RG</AvatarFallback>
        </Avatar>
      </div>
    `,
  }),
}

export const Group: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="flex -space-x-4">
        <Avatar class="border-2 border-background">
          <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
        <Avatar class="border-2 border-background">
          <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
          <AvatarFallback>U2</AvatarFallback>
        </Avatar>
        <Avatar class="border-2 border-background">
          <AvatarImage src="https://github.com/react.png" alt="User 3" />
          <AvatarFallback>U3</AvatarFallback>
        </Avatar>
        <Avatar class="border-2 border-background">
          <AvatarImage src="https://github.com/vuejs.png" alt="User 4" />
          <AvatarFallback>U4</AvatarFallback>
        </Avatar>
        <Avatar class="border-2 border-background">
          <AvatarFallback class="!bg-muted text-muted-foreground">+5</AvatarFallback>
        </Avatar>
      </div>
    `,
  }),
}

export const GroupVariants: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="space-y-8">
        <div>
          <h4 class="mb-4 text-sm font-medium">Overlapping Group</h4>
          <div class="flex -space-x-4">
            <Avatar class="size-10 border-2 border-background">
              <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar class="size-10 border-2 border-background">
              <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar class="size-10 border-2 border-background">
              <AvatarImage src="https://github.com/react.png" alt="User 3" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
            <Avatar class="size-10 border-2 border-background">
              <AvatarFallback class="!bg-primary text-primary-foreground font-semibold">+7</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <h4 class="mb-4 text-sm font-medium">Compact Group</h4>
          <div class="flex -space-x-2">
            <Avatar class="size-8 border-2 border-background">
              <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
              <AvatarFallback class="text-xs">U1</AvatarFallback>
            </Avatar>
            <Avatar class="size-8 border-2 border-background">
              <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
              <AvatarFallback class="text-xs">U2</AvatarFallback>
            </Avatar>
            <Avatar class="size-8 border-2 border-background">
              <AvatarImage src="https://github.com/react.png" alt="User 3" />
              <AvatarFallback class="text-xs">U3</AvatarFallback>
            </Avatar>
            <Avatar class="size-8 border-2 border-background">
              <AvatarImage src="https://github.com/vuejs.png" alt="User 4" />
              <AvatarFallback class="text-xs">U4</AvatarFallback>
            </Avatar>
            <Avatar class="size-8 border-2 border-background">
              <AvatarImage src="https://github.com/nodejs.png" alt="User 5" />
              <AvatarFallback class="text-xs">U5</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <h4 class="mb-4 text-sm font-medium">Large Group with Count</h4>
          <div class="flex -space-x-4">
            <Avatar class="size-12 border-2 border-background">
              <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar class="size-12 border-2 border-background">
              <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar class="size-12 border-2 border-background">
              <AvatarImage src="https://github.com/react.png" alt="User 3" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
            <Avatar class="size-12 border-2 border-background">
              <AvatarFallback class="!bg-gradient-to-br !from-blue-500 !to-purple-600 text-white font-semibold">+12</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <h4 class="mb-4 text-sm font-medium">Spaced Group</h4>
          <div class="flex gap-2">
            <Avatar class="size-10">
              <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar class="size-10">
              <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar class="size-10">
              <AvatarImage src="https://github.com/react.png" alt="User 3" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
            <Avatar class="size-10">
              <AvatarImage src="https://github.com/vuejs.png" alt="User 4" />
              <AvatarFallback>U4</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    `,
  }),
}

export const BorderStyles: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="space-y-8">
        <div>
          <h4 class="mb-4 text-sm font-medium">Border Thickness</h4>
          <div class="flex items-center gap-4">
            <Avatar class="border border-primary">
              <AvatarImage src="https://github.com/shadcn.png" alt="1px Border" />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
            <Avatar class="border-2 border-primary">
              <AvatarImage src="https://github.com/shadcn.png" alt="2px Border" />
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
            <Avatar class="border-4 border-primary">
              <AvatarImage src="https://github.com/shadcn.png" alt="4px Border" />
              <AvatarFallback>4</AvatarFallback>
            </Avatar>
            <Avatar class="border-8 border-primary">
              <AvatarImage src="https://github.com/shadcn.png" alt="8px Border" />
              <AvatarFallback>8</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <h4 class="mb-4 text-sm font-medium">Border Colors</h4>
          <div class="flex items-center gap-4">
            <Avatar class="border-2 border-blue-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Blue" />
              <AvatarFallback class="!bg-blue-100 text-blue-700">BL</AvatarFallback>
            </Avatar>
            <Avatar class="border-2 border-green-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Green" />
              <AvatarFallback class="!bg-green-100 text-green-700">GR</AvatarFallback>
            </Avatar>
            <Avatar class="border-2 border-red-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Red" />
              <AvatarFallback class="!bg-red-100 text-red-700">RD</AvatarFallback>
            </Avatar>
            <Avatar class="border-2 border-purple-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Purple" />
              <AvatarFallback class="!bg-purple-100 text-purple-700">PR</AvatarFallback>
            </Avatar>
            <Avatar class="border-2 border-orange-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Orange" />
              <AvatarFallback class="!bg-orange-100 text-orange-700">OR</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <h4 class="mb-4 text-sm font-medium">Ring Variants</h4>
          <div class="flex items-center gap-4">
            <Avatar class="ring-2 ring-blue-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Ring 2px" />
              <AvatarFallback>R2</AvatarFallback>
            </Avatar>
            <Avatar class="ring-2 ring-blue-500 ring-offset-2">
              <AvatarImage src="https://github.com/shadcn.png" alt="Ring with Offset" />
              <AvatarFallback>RO</AvatarFallback>
            </Avatar>
            <Avatar class="ring-4 ring-green-500 ring-offset-2">
              <AvatarImage src="https://github.com/shadcn.png" alt="Thick Ring" />
              <AvatarFallback>TR</AvatarFallback>
            </Avatar>
            <Avatar class="ring-2 ring-purple-500 ring-offset-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="Large Offset" />
              <AvatarFallback>LO</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div>
          <h4 class="mb-4 text-sm font-medium">Gradient Borders</h4>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
              <Avatar class="border-2 border-background">
                <AvatarImage src="https://github.com/shadcn.png" alt="Gradient 1" />
                <AvatarFallback>G1</AvatarFallback>
              </Avatar>
            </div>
            <div class="rounded-full bg-gradient-to-r from-green-400 to-blue-500 p-1">
              <Avatar class="border-2 border-background">
                <AvatarImage src="https://github.com/shadcn.png" alt="Gradient 2" />
                <AvatarFallback>G2</AvatarFallback>
              </Avatar>
            </div>
            <div class="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-1">
              <Avatar class="border-2 border-background">
                <AvatarImage src="https://github.com/shadcn.png" alt="Gradient 3" />
                <AvatarFallback>G3</AvatarFallback>
              </Avatar>
            </div>
            <div class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
              <Avatar class="border-2 border-background">
                <AvatarImage src="https://github.com/shadcn.png" alt="Gradient 4" />
                <AvatarFallback>G4</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <div>
          <h4 class="mb-4 text-sm font-medium">Dashed Borders</h4>
          <div class="flex items-center gap-4">
            <Avatar class="border-2 border-dashed border-primary">
              <AvatarImage src="https://github.com/shadcn.png" alt="Dashed" />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            <Avatar class="border-4 border-dashed border-blue-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Thick Dashed" />
              <AvatarFallback>TD</AvatarFallback>
            </Avatar>
            <Avatar class="border-2 border-dotted border-green-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Dotted" />
              <AvatarFallback>DT</AvatarFallback>
            </Avatar>
            <Avatar class="border-4 border-dotted border-purple-500">
              <AvatarImage src="https://github.com/shadcn.png" alt="Thick Dotted" />
              <AvatarFallback>DT</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    `,
  }),
}

export const WithBadge: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback, Badge },
    template: `
      <div class="flex items-center gap-6">
        <div class="relative">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Online User" />
            <AvatarFallback>ON</AvatarFallback>
          </Avatar>
          <span class="absolute bottom-0 right-0 block size-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>
        </div>
        <div class="relative">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="Away User" />
            <AvatarFallback>AW</AvatarFallback>
          </Avatar>
          <span class="absolute bottom-0 right-0 block size-2.5 rounded-full bg-yellow-500 ring-2 ring-background"></span>
        </div>
        <div class="relative">
          <Avatar>
            <AvatarImage src="https://github.com/react.png" alt="Busy User" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <span class="absolute bottom-0 right-0 block size-2.5 rounded-full bg-red-500 ring-2 ring-background"></span>
        </div>
        <div class="relative">
          <Avatar>
            <AvatarImage src="https://github.com/vuejs.png" alt="Offline User" />
            <AvatarFallback>OF</AvatarFallback>
          </Avatar>
          <span class="absolute bottom-0 right-0 block size-2.5 rounded-full bg-gray-500 ring-2 ring-background"></span>
        </div>
      </div>
    `,
  }),
}

export const UserList: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="w-full max-w-md space-y-3">
        <div class="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Alice Johnson" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div class="flex-1">
            <div class="text-sm font-medium">Alice Johnson</div>
            <div class="text-xs text-muted-foreground">alice@example.com</div>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="Bob Smith" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <div class="flex-1">
            <div class="text-sm font-medium">Bob Smith</div>
            <div class="text-xs text-muted-foreground">bob@example.com</div>
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent">
          <Avatar>
            <AvatarImage src="https://github.com/react.png" alt="Carol Williams" />
            <AvatarFallback>CW</AvatarFallback>
          </Avatar>
          <div class="flex-1">
            <div class="text-sm font-medium">Carol Williams</div>
            <div class="text-xs text-muted-foreground">carol@example.com</div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const WithText: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="flex flex-col gap-6">
        <div class="flex items-center gap-4">
          <Avatar class="size-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="Alice Johnson" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <div class="font-semibold">Alice Johnson</div>
            <div class="text-sm text-muted-foreground">Product Designer</div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <Avatar class="size-12">
            <AvatarImage src="https://github.com/vercel.png" alt="Bob Smith" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <div>
            <div class="font-semibold">Bob Smith</div>
            <div class="text-sm text-muted-foreground">Software Engineer</div>
            <div class="text-xs text-muted-foreground">Last active 2 hours ago</div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const Comments: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="w-full max-w-2xl space-y-4">
        <div class="flex gap-4">
          <Avatar class="size-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="Alice" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div class="flex-1 space-y-2 rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <div class="font-semibold">Alice Johnson</div>
              <div class="text-xs text-muted-foreground">2 hours ago</div>
            </div>
            <p class="text-sm text-muted-foreground">
              This is a great component! I really like how it handles fallback states gracefully.
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <Avatar class="size-10">
            <AvatarImage src="https://github.com/vercel.png" alt="Bob" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <div class="flex-1 space-y-2 rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <div class="font-semibold">Bob Smith</div>
              <div class="text-xs text-muted-foreground">1 hour ago</div>
            </div>
            <p class="text-sm text-muted-foreground">
              Agreed! The different size variants are really useful for various use cases.
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <Avatar class="size-10">
            <AvatarImage src="https://github.com/react.png" alt="Carol" />
            <AvatarFallback>CW</AvatarFallback>
          </Avatar>
          <div class="flex-1 space-y-2 rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <div class="font-semibold">Carol Williams</div>
              <div class="text-xs text-muted-foreground">30 minutes ago</div>
            </div>
            <p class="text-sm text-muted-foreground">
              The status indicators with badges are a nice touch. Very professional!
            </p>
          </div>
        </div>
      </div>
    `,
  }),
}

export const ProfileCard: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback, Badge },
    template: `
      <div class="w-full max-w-sm rounded-lg border p-6">
        <div class="flex flex-col items-center gap-4">
          <div class="relative">
            <Avatar class="size-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="Alice Johnson" />
              <AvatarFallback class="text-2xl">AJ</AvatarFallback>
            </Avatar>
            <span class="absolute bottom-1 right-1 block size-4 rounded-full bg-green-500 ring-4 ring-background"></span>
          </div>
          <div class="space-y-1 text-center">
            <h3 class="text-xl font-semibold">Alice Johnson</h3>
            <p class="text-sm text-muted-foreground">Product Designer</p>
          </div>
          <div class="flex gap-2">
            <Badge variant="secondary">Design</Badge>
            <Badge variant="secondary">UI/UX</Badge>
            <Badge variant="secondary">Figma</Badge>
          </div>
          <div class="grid w-full grid-cols-3 gap-4 border-t pt-4 text-center">
            <div>
              <div class="text-2xl font-bold">124</div>
              <div class="text-xs text-muted-foreground">Projects</div>
            </div>
            <div>
              <div class="text-2xl font-bold">2.5k</div>
              <div class="text-xs text-muted-foreground">Followers</div>
            </div>
            <div>
              <div class="text-2xl font-bold">486</div>
              <div class="text-xs text-muted-foreground">Following</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}
