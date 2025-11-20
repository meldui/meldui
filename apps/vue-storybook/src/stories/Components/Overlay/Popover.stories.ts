import {
  IconHelpCircle,
  IconInfoCircle,
  IconSettings,
  IconShare,
  IconUser,
} from '@meldui/tabler-vue'
import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Switch,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Popover> = {
  title: 'Components/Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays rich content in a portal, triggered by a button. Used for displaying additional information, menus, or interactive elements without navigating away from the current page.',
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
      Popover,
      PopoverContent,
      PopoverTrigger,
    },
    template: `
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div class="space-y-2">
            <h4 class="font-semibold">Popover Title</h4>
            <p class="text-sm text-muted-foreground">
              This is a popover with some content. You can put any content here.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
}

export const WithForm: Story = {
  render: () => ({
    components: {
      Button,
      Input,
      Label,
      Popover,
      PopoverContent,
      PopoverTrigger,
    },
    setup() {
      const email = ref('')
      const name = ref('')

      return { email, name }
    },
    template: `
      <Popover>
        <PopoverTrigger as-child>
          <Button>Subscribe</Button>
        </PopoverTrigger>
        <PopoverContent class="w-80">
          <div class="space-y-4">
            <div class="space-y-2">
              <h4 class="font-semibold leading-none">Subscribe to Newsletter</h4>
              <p class="text-sm text-muted-foreground">
                Enter your information to stay updated.
              </p>
            </div>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <Label for="name">Name</Label>
                <Input id="name" v-model="name" placeholder="Your name" />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="email">Email</Label>
                <Input id="email" v-model="email" type="email" placeholder="your@email.com" />
              </div>
              <Button class="w-full">Subscribe</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
}

export const Positions: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
    },
    template: `
      <div class="flex min-h-[400px] items-center justify-center">
        <div class="grid grid-cols-3 gap-4">
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Top Start</Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" class="w-64">
              <p class="text-sm">Positioned at top-start</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Top</Button>
            </PopoverTrigger>
            <PopoverContent side="top" class="w-64">
              <p class="text-sm">Positioned at top-center</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Top End</Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" class="w-64">
              <p class="text-sm">Positioned at top-end</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Left</Button>
            </PopoverTrigger>
            <PopoverContent side="left" class="w-64">
              <p class="text-sm">Positioned at left</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Center</Button>
            </PopoverTrigger>
            <PopoverContent class="w-64">
              <p class="text-sm">Default position (bottom)</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Right</Button>
            </PopoverTrigger>
            <PopoverContent side="right" class="w-64">
              <p class="text-sm">Positioned at right</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Bottom Start</Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" class="w-64">
              <p class="text-sm">Positioned at bottom-start</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Bottom</Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" class="w-64">
              <p class="text-sm">Positioned at bottom-center</p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">Bottom End</Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" class="w-64">
              <p class="text-sm">Positioned at bottom-end</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
      IconHelpCircle,
    },
    template: `
      <div class="flex items-center gap-2">
        <span class="text-sm">Need help?</span>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="ghost" size="icon" class="h-6 w-6">
              <IconHelpCircle :size="16" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-80">
            <div class="space-y-2">
              <h4 class="font-semibold">How to use this feature</h4>
              <p class="text-sm text-muted-foreground">
                Click the button to activate the feature. You can customize the settings
                in the panel that appears. For more detailed instructions, check our documentation.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    `,
  }),
}

export const UserProfile: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
      Separator,
      IconUser,
      IconSettings,
    },
    template: `
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="ghost" class="gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              JD
            </div>
            <span>John Doe</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-72">
          <div class="space-y-4">
            <div class="flex items-center gap-3 space-y-2">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                JD
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold">John Doe</p>
                <p class="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>
            <Separator class="inline-block"/>
            <div class="space-y-2">
              <Button variant="ghost" class="w-full justify-start gap-2">
                <IconUser :size="16" />
                View Profile
              </Button>
              <Button variant="ghost" class="w-full justify-start gap-2">
                <IconSettings :size="16" />
                Settings
              </Button>
            </div>
            <Separator class="inline-block"/>
            <Button variant="outline" class="w-full">Sign Out</Button>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
}

export const SharePopover: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
      Input,
      Label,
      IconShare,
    },
    setup() {
      const link = ref('https://example.com/share/12345')

      const copyToClipboard = () => {
        navigator.clipboard.writeText(link.value)
      }

      return { link, copyToClipboard }
    },
    template: `
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconShare :size="16" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80">
          <div class="space-y-4">
            <div class="space-y-2">
              <h4 class="font-semibold">Share this page</h4>
              <p class="text-sm text-muted-foreground">
                Anyone with the link can view this page.
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="link">Link</Label>
              <div class="flex gap-2">
                <Input id="link" v-model="link" readonly class="flex-1" />
                <Button @click="copyToClipboard">Copy</Button>
              </div>
            </div>
            <div class="flex gap-2">
              <Button variant="outline" class="flex-1">Facebook</Button>
              <Button variant="outline" class="flex-1">Twitter</Button>
              <Button variant="outline" class="flex-1">Email</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
}

export const SettingsPopover: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
      Label,
      Switch,
      IconSettings,
    },
    setup() {
      const notifications = ref(true)
      const autoSave = ref(false)
      const darkMode = ref(false)

      return { notifications, autoSave, darkMode }
    },
    template: `
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" size="icon">
            <IconSettings :size="20" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80">
          <div class="space-y-4">
            <div class="space-y-2">
              <h4 class="font-semibold">Quick Settings</h4>
              <p class="text-sm text-muted-foreground">
                Configure your preferences
              </p>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label for="notif">Notifications</Label>
                  <p class="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch id="notif" v-model:checked="notifications" />
              </div>
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label for="auto">Auto Save</Label>
                  <p class="text-sm text-muted-foreground">Automatically save changes</p>
                </div>
                <Switch id="auto" v-model:checked="autoSave" />
              </div>
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label for="dark">Dark Mode</Label>
                  <p class="text-sm text-muted-foreground">Use dark color scheme</p>
                </div>
                <Switch id="dark" v-model:checked="darkMode" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
}

export const InfoPopover: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
      IconInfoCircle,
    },
    template: `
      <div class="rounded-lg border p-4">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-sm font-semibold">Premium Feature</h3>
            <p class="text-sm text-muted-foreground">Advanced analytics dashboard</p>
          </div>
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="ghost" size="icon" class="h-6 w-6">
                <IconInfoCircle :size="16" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-72">
              <div class="space-y-4">
                <h4 class="font-semibold">About This Feature</h4>
                <p class="text-sm text-muted-foreground">
                  The Premium Analytics Dashboard gives you access to detailed metrics,
                  custom reports, and real-time data visualization.
                </p>
                <ul class="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Real-time data updates</li>
                  <li>Custom report builder</li>
                  <li>Export to CSV/PDF</li>
                  <li>Advanced filtering</li>
                </ul>
                <Button class="w-full">Upgrade to Premium</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    `,
  }),
}

export const ColorPicker: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
    },
    setup() {
      const colors = [
        '#ef4444',
        '#f97316',
        '#f59e0b',
        '#eab308',
        '#84cc16',
        '#22c55e',
        '#10b981',
        '#14b8a6',
        '#06b6d4',
        '#0ea5e9',
        '#3b82f6',
        '#6366f1',
        '#8b5cf6',
        '#a855f7',
        '#d946ef',
        '#ec4899',
      ]

      const selectedColor = ref('#3b82f6')

      return { colors, selectedColor }
    },
    template: `
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" class="gap-2">
            <div
              class="h-4 w-4 rounded border"
              :style="{ backgroundColor: selectedColor }"
            />
            Pick a color
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-64">
          <div class="space-y-3">
            <h4 class="font-semibold text-sm">Pick a color</h4>
            <div class="grid grid-cols-8 gap-2">
              <button
                v-for="color in colors"
                :key="color"
                @click="selectedColor = color"
                class="h-8 w-8 rounded border-2 transition-transform hover:scale-110"
                :class="selectedColor === color ? 'border-foreground' : 'border-transparent'"
                :style="{ backgroundColor: color }"
              />
            </div>
            <div class="flex items-center gap-2 border-t pt-3">
              <div
                class="h-8 w-8 rounded border"
                :style="{ backgroundColor: selectedColor }"
              />
              <span class="text-sm font-mono">{{ selectedColor }}</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
}

export const ContextualActions: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
    },
    template: `
      <div class="space-y-4">
        <div class="rounded-lg border p-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-sm font-semibold">Document Title</h3>
              <p class="text-sm text-muted-foreground">Last edited 2 hours ago</p>
            </div>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="ghost" size="icon">
                  <span class="text-lg">•••</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-48">
                <div class="space-y-2">
                  <Button variant="ghost" class="w-full justify-start">
                    Edit
                  </Button>
                  <Button variant="ghost" class="w-full justify-start">
                    Duplicate
                  </Button>
                  <Button variant="ghost" class="w-full justify-start">
                    Move to
                  </Button>
                  <Button variant="ghost" class="w-full justify-start">
                    Share
                  </Button>
                  <Button variant="ghost" class="w-full justify-start text-destructive">
                    Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    `,
  }),
}

export const CustomWidth: Story = {
  render: () => ({
    components: {
      Button,
      Popover,
      PopoverContent,
      PopoverTrigger,
    },
    template: `
      <div class="flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">Narrow (200px)</Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px]">
            <p class="text-sm">This is a narrow popover with limited width.</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">Default (288px)</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p class="text-sm">This is the default popover width.</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">Wide (400px)</Button>
          </PopoverTrigger>
          <PopoverContent class="w-[400px]">
            <p class="text-sm">
              This is a wider popover that can accommodate more content and longer text
              without wrapping too much.
            </p>
          </PopoverContent>
        </Popover>
      </div>
    `,
  }),
}
