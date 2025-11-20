import {
  IconBrandGithub,
  IconCalendar,
  IconHelpCircle,
  IconMapPin,
  IconUser,
} from '@meldui/tabler-vue'
import {
  Badge,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Separator,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof HoverCard> = {
  title: 'Components/Overlay/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays rich content in a card when hovering over a trigger element. Useful for providing additional context, previews, or supplementary information without cluttering the interface.',
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
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
    },
    template: `
      <div class="flex items-center gap-2">
        <span class="text-sm">Hover over the</span>
        <HoverCard>
          <HoverCardTrigger as-child>
            <Button variant="link" class="p-0 h-auto">@username</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div class="space-y-3">
              <h4 class="text-sm font-semibold">@username</h4>
              <p class="text-sm text-muted-foreground">
                Software developer and open source contributor.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
        <span class="text-sm">to see more information</span>
      </div>
    `,
  }),
}

export const UserProfile: Story = {
  render: () => ({
    components: {
      Badge,
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
      IconCalendar,
      IconMapPin,
      IconUser,
    },
    template: `
      <div class="flex items-center gap-2">
        <span class="text-sm">Mentioned by</span>
        <HoverCard>
          <HoverCardTrigger as-child>
            <a href="#" class="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              <IconUser :size="14" />
              @johndoe
            </a>
          </HoverCardTrigger>
          <HoverCardContent class="w-80">
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  JD
                </div>
                <div class="flex-1 space-y-2">
                  <h4 class="text-sm font-semibold">John Doe</h4>
                  <p class="text-sm text-muted-foreground">@johndoe</p>
                </div>
              </div>
              <p class="text-sm">
                Full-stack developer passionate about creating elegant solutions to complex problems.
              </p>
              <div class="flex items-center gap-4 text-sm text-muted-foreground">
                <div class="flex items-center gap-1">
                  <IconMapPin :size="14" />
                  San Francisco
                </div>
                <div class="flex items-center gap-1">
                  <IconCalendar :size="14" />
                  Joined March 2023
                </div>
              </div>
              <div class="flex gap-2">
                <Badge variant="secondary">Vue</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Node.js</Badge>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        <span class="text-sm">in the discussion</span>
      </div>
    `,
  }),
}

export const LinkPreview: Story = {
  render: () => ({
    components: {
      Badge,
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
      IconBrandGithub,
    },
    template: `
      <div class="text-sm text-muted-foreground">
        Check out this repository:
        <HoverCard>
          <HoverCardTrigger as-child>
            <a href="#" class="font-medium text-primary hover:underline">
              meldui/design-system
            </a>
          </HoverCardTrigger>
          <HoverCardContent class="w-80">
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <IconBrandGithub :size="24" class="text-muted-foreground" />
                <div class="flex-1">
                  <h4 class="text-sm font-semibold">meldui/design-system</h4>
                  <p class="mt-2 text-sm text-muted-foreground">
                    A comprehensive design system built with Vue 3 and Tailwind CSS
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4 text-sm text-muted-foreground">
                <div class="flex items-center gap-1">
                  <div class="h-3 w-3 rounded-full bg-primary" />
                  TypeScript
                </div>
                <div>⭐ 1.2k</div>
                <div>🔱 234</div>
              </div>
              <div class="flex gap-2 p-2">
                <Badge>vue</Badge>
                <Badge variant="secondary">design-system</Badge>
                <Badge variant="secondary">tailwind</Badge>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        for more details.
      </div>
    `,
  }),
}

export const ProductDetails: Story = {
  render: () => ({
    components: {
      Badge,
      Button,
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
    },
    template: `
      <div class="grid grid-cols-3 gap-4">
        <HoverCard>
          <HoverCardTrigger as-child>
            <div class="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent">
              <div class="mb-2 flex h-24 items-center justify-center rounded bg-muted">
                <span class="text-4xl">📱</span>
              </div>
              <h3 class="text-sm font-semibold">Smartphone X</h3>
              <p class="text-sm text-muted-foreground">$999</p>
            </div>
          </HoverCardTrigger>
          <HoverCardContent class="w-80">
            <div class="space-y-4">
              <div class="space-y-2">
                <h4 class="font-semibold">Smartphone X</h4>
                <p class="text-sm text-muted-foreground">
                  Latest flagship phone with advanced features
                </p>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Display</span>
                  <span>6.7" OLED</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Storage</span>
                  <span>256GB</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Camera</span>
                  <span>48MP Triple</span>
                </div>
              </div>
              <div class="flex gap-2">
                <Badge variant="secondary">5G</Badge>
                <Badge variant="secondary">Fast Charging</Badge>
              </div>
              <Button class="w-full">View Details</Button>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    `,
  }),
}

export const Positions: Story = {
  render: () => ({
    components: {
      Button,
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
    },
    template: `
      <div class="flex min-h-[400px] items-center justify-center">
        <div class="grid grid-cols-3 gap-4">
          <HoverCard>
            <HoverCardTrigger as-child>
              <Button variant="outline">Top</Button>
            </HoverCardTrigger>
            <HoverCardContent side="top">
              <p class="text-sm">Positioned at top</p>
            </HoverCardContent>
          </HoverCard>

          <div></div>

          <div></div>

          <HoverCard>
            <HoverCardTrigger as-child>
              <Button variant="outline">Left</Button>
            </HoverCardTrigger>
            <HoverCardContent side="left">
              <p class="text-sm">Positioned at left</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger as-child>
              <Button variant="outline">Default (Bottom)</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p class="text-sm">Default position (bottom)</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger as-child>
              <Button variant="outline">Right</Button>
            </HoverCardTrigger>
            <HoverCardContent side="right">
              <p class="text-sm">Positioned at right</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    `,
  }),
}

export const WithImage: Story = {
  render: () => ({
    components: {
      Badge,
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
    },
    template: `
      <div class="flex items-center gap-2">
        <span class="text-sm">Check out</span>
        <HoverCard>
          <HoverCardTrigger as-child>
            <a href="#" class="font-medium text-primary hover:underline">
              this component library
            </a>
          </HoverCardTrigger>
          <HoverCardContent class="w-80">
            <div class="space-y-3">
              <div class="h-40 w-full rounded-md bg-gradient-to-br from-blue-500 to-purple-600" />
              <div class="space-y-2">
                <h4 class="font-semibold">MeldUI Component Library</h4>
                <p class="text-sm text-muted-foreground">
                  A modern, accessible component library for Vue 3 applications
                </p>
              </div>
              <div class="flex gap-2">
                <Badge>Vue 3</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Tailwind</Badge>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    `,
  }),
}

export const Glossary: Story = {
  render: () => ({
    components: {
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm">
          The
          <HoverCard>
            <HoverCardTrigger as-child>
              <button class="border-b border-dashed border-muted-foreground font-medium">
                API
              </button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div class="space-y-2">
                <h4 class="text-sm font-semibold">Application Programming Interface</h4>
                <p class="text-sm text-muted-foreground">
                  A set of rules and protocols that allows different software applications
                  to communicate with each other.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
          provides a
          <HoverCard>
            <HoverCardTrigger as-child>
              <button class="border-b border-dashed border-muted-foreground font-medium">
                RESTful
              </button>
            </HoverCardTrigger>
            <HoverCardContent>
              <div class="space-y-2">
                <h4 class="text-sm font-semibold">REST (Representational State Transfer)</h4>
                <p class="text-sm text-muted-foreground">
                  An architectural style for designing networked applications using HTTP
                  requests to access and manipulate data.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
          interface for data access.
        </p>
      </div>
    `,
  }),
}

export const IconHover: Story = {
  render: () => ({
    components: {
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
      IconHelpCircle,
    },
    template: `
      <div class="space-y-6">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Email Address</label>
          <HoverCard>
            <HoverCardTrigger as-child>
              <button class="text-muted-foreground transition-colors hover:text-foreground">
                <IconHelpCircle :size="16" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent class="w-72">
              <div class="space-y-2">
                <h4 class="text-sm font-semibold">Email Address</h4>
                <p class="text-sm text-muted-foreground">
                  Your email address will be used for account verification and important
                  notifications. We'll never share your email with third parties.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Two-Factor Authentication</label>
          <HoverCard>
            <HoverCardTrigger as-child>
              <button class="text-muted-foreground transition-colors hover:text-foreground">
                <IconHelpCircle :size="16" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent class="w-72">
              <div class="space-y-2">
                <h4 class="text-sm font-semibold">Two-Factor Authentication (2FA)</h4>
                <p class="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring a verification
                  code in addition to your password when signing in.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    `,
  }),
}

export const CustomWidth: Story = {
  render: () => ({
    components: {
      Button,
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
    },
    template: `
      <div class="flex flex-wrap gap-4">
        <HoverCard>
          <HoverCardTrigger as-child>
            <Button variant="outline">Narrow (200px)</Button>
          </HoverCardTrigger>
          <HoverCardContent class="w-[200px]">
            <p class="text-sm">This is a narrow hover card with limited width.</p>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger as-child>
            <Button variant="outline">Default (256px)</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p class="text-sm">This is the default hover card width.</p>
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          <HoverCardTrigger as-child>
            <Button variant="outline">Wide (400px)</Button>
          </HoverCardTrigger>
          <HoverCardContent class="w-[400px]">
            <p class="text-sm">
              This is a wider hover card that can accommodate more content and longer text
              without wrapping too much.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
    `,
  }),
}

export const ComplexContent: Story = {
  render: () => ({
    components: {
      Badge,
      Button,
      HoverCard,
      HoverCardContent,
      HoverCardTrigger,
      Separator,
      IconCalendar,
      IconUser,
    },
    template: `
      <div class="flex items-center gap-2">
        <span class="text-sm">View details about</span>
        <HoverCard>
          <HoverCardTrigger as-child>
            <Button variant="link" class="p-0 h-auto">Project Alpha</Button>
          </HoverCardTrigger>
          <HoverCardContent class="w-96">
            <div class="space-y-4">
              <div class="space-y-2">
                <h4 class="font-semibold">Project Alpha</h4>
                <p class="text-sm text-muted-foreground">
                  Next-generation e-commerce platform
                </p>
              </div>

              <Separator />

              <div class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">Status</span>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">Priority</span>
                  <Badge>High</Badge>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">Completion</span>
                  <span>65%</span>
                </div>
              </div>

              <Separator />

              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm">
                  <IconUser :size="14" class="text-muted-foreground" />
                  <span class="text-muted-foreground">Team:</span>
                  <span>5 members</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <IconCalendar :size="14" class="text-muted-foreground" />
                  <span class="text-muted-foreground">Deadline:</span>
                  <span>Dec 31, 2024</span>
                </div>
              </div>

              <Separator />

              <div class="flex gap-2">
                <Button variant="outline" size="sm" class="flex-1">View</Button>
                <Button size="sm" class="flex-1">Edit</Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    `,
  }),
}
