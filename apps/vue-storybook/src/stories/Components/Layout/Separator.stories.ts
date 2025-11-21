import { Button, Separator } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Separator> = {
  title: 'Components/Layout/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Visually or semantically separates content. Can be horizontal or vertical, decorative or semantic.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
      defaultValue: 'horizontal',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is purely decorative',
      defaultValue: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: (args) => ({
    components: { Separator },
    setup() {
      return { args }
    },
    template: `
      <div class="w-full max-w-md space-y-4">
        <div>
          <h4 class="text-sm font-medium">MeldUI Components</h4>
          <p class="text-sm text-muted-foreground">A collection of reusable components</p>
        </div>
        <Separator v-bind="args" />
        <div class="flex h-5 items-center space-x-4 text-sm">
          <div>Documentation</div>
          <Separator orientation="vertical" />
          <div>API Reference</div>
          <Separator orientation="vertical" />
          <div>Examples</div>
        </div>
      </div>
    `,
  }),
  args: {
    orientation: 'horizontal',
  },
}

export const Vertical: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="flex h-20 items-center space-x-4">
        <div class="space-y-1">
          <h4 class="text-sm font-medium">Vue</h4>
          <p class="text-xs text-muted-foreground">Framework</p>
        </div>
        <Separator orientation="vertical" />
        <div class="space-y-1">
          <h4 class="text-sm font-medium">TypeScript</h4>
          <p class="text-xs text-muted-foreground">Language</p>
        </div>
        <Separator orientation="vertical" />
        <div class="space-y-1">
          <h4 class="text-sm font-medium">Tailwind</h4>
          <p class="text-xs text-muted-foreground">Styling</p>
        </div>
      </div>
    `,
  }),
}

export const InText: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="max-w-md space-y-4">
        <h4 class="text-sm font-medium">Section 1</h4>
        <p class="text-sm text-muted-foreground">
          This is the first section of content with some descriptive text about the component.
        </p>
        <Separator class="my-4" />
        <h4 class="text-sm font-medium">Section 2</h4>
        <p class="text-sm text-muted-foreground">
          This is the second section, separated from the first by a horizontal separator line.
        </p>
        <Separator class="my-4" />
        <h4 class="text-sm font-medium">Section 3</h4>
        <p class="text-sm text-muted-foreground">
          This is the third section, continuing the pattern of content separation.
        </p>
      </div>
    `,
  }),
}

export const WithLinks: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="flex items-center space-x-2 text-sm">
        <a href="#" class="hover:underline">Home</a>
        <Separator orientation="vertical" class="h-4" />
        <a href="#" class="hover:underline">About</a>
        <Separator orientation="vertical" class="h-4" />
        <a href="#" class="hover:underline">Services</a>
        <Separator orientation="vertical" class="h-4" />
        <a href="#" class="hover:underline">Contact</a>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="w-full max-w-md rounded-lg border">
        <div class="p-6">
          <h3 class="text-lg font-semibold">Component Library</h3>
          <p class="text-sm text-muted-foreground">Built with Vue 3 and Tailwind CSS</p>
        </div>
        <Separator />
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <div class="text-sm font-medium">Features</div>
              <div class="text-sm text-muted-foreground">Customizable and accessible</div>
            </div>
            <div>
              <div class="text-sm font-medium">Documentation</div>
              <div class="text-sm text-muted-foreground">Comprehensive guides and examples</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const WithButtons: Story = {
  render: () => ({
    components: { Separator, Button },
    template: `
      <div class="w-full max-w-md space-y-4 rounded-lg border p-6">
        <div>
          <h3 class="text-lg font-semibold">Settings</h3>
          <p class="text-sm text-muted-foreground">Manage your account preferences</p>
        </div>
        <Separator />
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium">Profile</div>
              <div class="text-xs text-muted-foreground">Update your personal information</div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium">Notifications</div>
              <div class="text-xs text-muted-foreground">Configure notification preferences</div>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium">Security</div>
              <div class="text-xs text-muted-foreground">Password and authentication</div>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </div>
      </div>
    `,
  }),
}

export const ListSeparator: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="w-full max-w-md">
        <ul class="space-y-0">
          <li class="py-3">
            <div class="flex items-center justify-between">
              <div class="text-sm">Item 1</div>
              <div class="text-xs text-muted-foreground">Description</div>
            </div>
          </li>
          <Separator />
          <li class="py-3">
            <div class="flex items-center justify-between">
              <div class="text-sm">Item 2</div>
              <div class="text-xs text-muted-foreground">Description</div>
            </div>
          </li>
          <Separator />
          <li class="py-3">
            <div class="flex items-center justify-between">
              <div class="text-sm">Item 3</div>
              <div class="text-xs text-muted-foreground">Description</div>
            </div>
          </li>
          <Separator />
          <li class="py-3">
            <div class="flex items-center justify-between">
              <div class="text-sm">Item 4</div>
              <div class="text-xs text-muted-foreground">Description</div>
            </div>
          </li>
        </ul>
      </div>
    `,
  }),
}

export const InBreadcrumb: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <nav class="flex items-center space-x-2 text-sm">
        <a href="#" class="hover:underline">Home</a>
        <Separator orientation="vertical" class="h-4" />
        <a href="#" class="hover:underline">Components</a>
        <Separator orientation="vertical" class="h-4" />
        <a href="#" class="hover:underline">Layout</a>
        <Separator orientation="vertical" class="h-4" />
        <span class="text-muted-foreground">Separator</span>
      </nav>
    `,
  }),
}

export const WithMetadata: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="w-full max-w-md space-y-4 rounded-lg border p-6">
        <div>
          <h3 class="text-lg font-semibold">Component Details</h3>
        </div>
        <Separator />
        <div class="grid gap-3 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Name:</span>
            <span class="font-medium">Separator</span>
          </div>
          <Separator />
          <div class="flex justify-between">
            <span class="text-muted-foreground">Category:</span>
            <span class="font-medium">Layout</span>
          </div>
          <Separator />
          <div class="flex justify-between">
            <span class="text-muted-foreground">Version:</span>
            <span class="font-medium">1.0.0</span>
          </div>
          <Separator />
          <div class="flex justify-between">
            <span class="text-muted-foreground">Status:</span>
            <span class="font-medium text-green-600">Stable</span>
          </div>
        </div>
      </div>
    `,
  }),
}

export const SidebarLayout: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="flex h-[400px] w-full max-w-4xl rounded-lg border">
        <div class="w-64 border-r p-4">
          <h3 class="mb-4 font-semibold">Navigation</h3>
          <nav class="space-y-2 text-sm">
            <div class="rounded px-2 py-1.5 hover:bg-accent">Dashboard</div>
            <div class="rounded px-2 py-1.5 hover:bg-accent">Projects</div>
            <div class="rounded px-2 py-1.5 hover:bg-accent">Tasks</div>
            <Separator class="my-2" />
            <div class="rounded px-2 py-1.5 hover:bg-accent">Settings</div>
            <div class="rounded px-2 py-1.5 hover:bg-accent">Help</div>
          </nav>
        </div>
        <div class="flex-1 p-6">
          <h2 class="mb-4 text-xl font-semibold">Main Content</h2>
          <p class="text-sm text-muted-foreground">
            The sidebar uses a vertical separator (border) to divide the navigation from the main content area.
          </p>
        </div>
      </div>
    `,
  }),
}

export const CustomColor: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div class="w-full max-w-md space-y-6">
        <div class="space-y-3">
          <h4 class="text-sm font-medium">Default Border Color</h4>
          <Separator class="my-2" />
          <p class="text-xs text-muted-foreground">Uses the default border color from theme</p>
        </div>
        <div class="space-y-3">
          <h4 class="text-sm font-medium">Primary Color</h4>
          <Separator class="my-2 !bg-primary" />
          <p class="text-xs text-muted-foreground">Override with primary color using !bg-primary</p>
        </div>
        <div class="space-y-3">
          <h4 class="text-sm font-medium">Muted Color</h4>
          <Separator class="my-2 !bg-muted-foreground" />
          <p class="text-xs text-muted-foreground">Override with muted color using !bg-muted-foreground</p>
        </div>
        <div class="space-y-3">
          <h4 class="text-sm font-medium">Accent Color</h4>
          <Separator class="my-2 !bg-accent-foreground" />
          <p class="text-xs text-muted-foreground">Override with accent color using !bg-accent-foreground</p>
        </div>
        <div class="space-y-3">
          <h4 class="text-sm font-medium">Thicker Separator</h4>
          <Separator class="my-2 !h-1 !bg-primary" />
          <p class="text-xs text-muted-foreground">Increased height with !h-1 (0.25rem)</p>
        </div>
        <div class="space-y-3">
          <h4 class="text-sm font-medium">Extra Thick</h4>
          <Separator class="my-2 !h-2" />
          <p class="text-xs text-muted-foreground">Even thicker with !h-2 (0.5rem)</p>
        </div>
      </div>
    `,
  }),
}
