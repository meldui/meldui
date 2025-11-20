import { IconCopy, IconHelpCircle, IconPlus, IconSettings, IconTrash } from '@meldui/tabler-vue'
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a small popup with information when hovering or focusing on an element. Used for providing additional context or labels for UI elements without cluttering the interface.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      Button,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    },
    template: `
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a tooltip</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    `,
  }),
}

export const Positions: Story = {
  render: () => ({
    components: {
      Button,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    },
    template: `
      <TooltipProvider>
        <div class="flex min-h-[400px] items-center justify-center">
          <div class="grid grid-cols-3 gap-4">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline">Top</Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Top tooltip</p>
              </TooltipContent>
            </Tooltip>

            <div></div>

            <div></div>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline">Left</Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Left tooltip</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline">Bottom</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Bottom tooltip</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline">Right</Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Right tooltip</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: {
      Button,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
      IconCopy,
      IconTrash,
      IconSettings,
    },
    template: `
      <TooltipProvider>
        <div class="flex gap-2">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" size="icon">
                <IconCopy :size="16" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" size="icon">
                <IconSettings :size="16" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="destructive" size="icon">
                <IconTrash :size="16" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete item</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    `,
  }),
}

export const WithKeyboardShortcut: Story = {
  render: () => ({
    components: {
      Button,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
      IconCopy,
    },
    template: `
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline" size="icon">
              <IconCopy :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="flex items-center gap-2">
              Copy
              <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span class="text-xs">⌘</span>C
              </kbd>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    `,
  }),
}

export const OnDisabledButton: Story = {
  render: () => ({
    components: {
      Button,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    },
    template: `
      <TooltipProvider>
        <div class="flex gap-4">
          <Tooltip>
            <TooltipTrigger as-child>
              <span class="inline-block">
                <Button disabled>Disabled Button</Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>This feature is not available</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button>Enabled Button</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to perform action</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    `,
  }),
}

export const HelpIcon: Story = {
  render: () => ({
    components: {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
      IconHelpCircle,
    },
    template: `
      <TooltipProvider>
        <div class="space-y-6">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Username</label>
            <Tooltip>
              <TooltipTrigger as-child>
                <button class="text-muted-foreground hover:text-foreground">
                  <IconHelpCircle :size="16" />
                </button>
              </TooltipTrigger>
              <TooltipContent class="max-w-xs">
                <p>Choose a unique username for your account. It can contain letters, numbers, and underscores.</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Password</label>
            <Tooltip>
              <TooltipTrigger as-child>
                <button class="text-muted-foreground hover:text-foreground">
                  <IconHelpCircle :size="16" />
                </button>
              </TooltipTrigger>
              <TooltipContent class="max-w-xs">
                <p>Must be at least 8 characters with a mix of letters, numbers, and symbols.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    `,
  }),
}

export const MultipleTooltips: Story = {
  render: () => ({
    components: {
      Button,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
      IconPlus,
    },
    template: `
      <TooltipProvider>
        <div class="space-y-4">
          <div class="flex gap-2">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline">Button 1</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>First tooltip</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline">Button 2</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Second tooltip</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline">Button 3</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Third tooltip</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div class="flex gap-2">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button size="icon">
                  <IconPlus :size="16" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new item</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <Button size="icon" variant="outline">
                  <IconPlus :size="16" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to favorites</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    `,
  }),
}

export const LongContent: Story = {
  render: () => ({
    components: {
      Button,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    },
    template: `
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline">Hover for details</Button>
          </TooltipTrigger>
          <TooltipContent class="max-w-xs">
            <p class="space-y-2">
              <span class="block font-semibold">Important Information</span>
              <span class="block text-xs">
                This action will permanently delete all your data and cannot be undone.
                Please make sure you have backed up any important information before proceeding.
              </span>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    `,
  }),
}

export const CustomDelay: Story = {
  render: () => ({
    components: {
      Button,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    },
    template: `
      <div class="flex gap-4">
        <TooltipProvider :delay-duration="0">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline">No Delay</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Appears immediately</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider :delay-duration="500">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline">500ms Delay</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Appears after 500ms</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider :delay-duration="1000">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline">1000ms Delay</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Appears after 1 second</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    `,
  }),
}

export const OnTextLink: Story = {
  render: () => ({
    components: {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    },
    template: `
      <TooltipProvider>
        <p class="text-sm text-muted-foreground">
          For more information, check out the
          <Tooltip>
            <TooltipTrigger as-child>
              <a href="#" class="font-medium text-primary hover:underline">
                documentation
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Opens in a new tab</p>
            </TooltipContent>
          </Tooltip>
          or contact support.
        </p>
      </TooltipProvider>
    `,
  }),
}
