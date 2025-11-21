import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Components/Layout/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible and flexible resizable panel groups. Drag the handles to resize panels horizontally or vertically.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ResizablePanelGroup>

export const Horizontal: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="horizontal" class="min-h-[200px] max-w-3xl rounded-lg border">
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Left Panel</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Right Panel</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="vertical" class="min-h-[400px] max-w-3xl rounded-lg border">
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Top Panel</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Bottom Panel</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}

export const WithHandle: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="horizontal" class="min-h-[200px] max-w-3xl rounded-lg border">
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Left Panel</span>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Right Panel</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}

export const ThreePanels: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="horizontal" class="min-h-[200px] max-w-3xl rounded-lg border">
        <ResizablePanel :default-size="25">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Main Content</span>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="25">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Panel</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}

export const WithMinMax: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="horizontal" class="min-h-[200px] max-w-3xl rounded-lg border">
        <ResizablePanel :default-size="30" :min-size="20" :max-size="40">
          <div class="flex h-full flex-col items-center justify-center p-6">
            <span class="font-semibold">Left Panel</span>
            <span class="mt-2 text-xs text-muted-foreground">Min: 20% | Max: 40%</span>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="70">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Right Panel (Flexible)</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}

export const Nested: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="horizontal" class="min-h-[400px] max-w-3xl rounded-lg border">
        <ResizablePanel :default-size="30">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="70">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel :default-size="60">
              <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Main Content</span>
              </div>
            </ResizablePanel>
            <ResizableHandle with-handle />
            <ResizablePanel :default-size="40">
              <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Footer Panel</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}

export const CodeEditor: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="horizontal" class="min-h-[500px] max-w-5xl rounded-lg border">
        <ResizablePanel :default-size="20" :min-size="15" :max-size="30">
          <div class="flex h-full flex-col gap-2 p-4">
            <h3 class="font-semibold">Explorer</h3>
            <div class="flex flex-col gap-1 text-sm text-muted-foreground">
              <div class="py-1">📁 src</div>
              <div class="py-1 pl-4">📄 main.ts</div>
              <div class="py-1 pl-4">📄 App.vue</div>
              <div class="py-1">📁 components</div>
              <div class="py-1 pl-4">📄 Button.vue</div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="50">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel :default-size="70">
              <div class="flex h-full flex-col p-4">
                <div class="mb-2 flex items-center justify-between">
                  <h3 class="font-semibold">Editor</h3>
                  <span class="text-xs text-muted-foreground">App.vue</span>
                </div>
                <div class="flex-1 rounded bg-muted p-4 font-mono text-sm">
                  <div>&lt;template&gt;</div>
                  <div class="pl-4">&lt;div&gt;</div>
                  <div class="pl-8">Hello World</div>
                  <div class="pl-4">&lt;/div&gt;</div>
                  <div>&lt;/template&gt;</div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle with-handle />
            <ResizablePanel :default-size="30" :min-size="20">
              <div class="flex h-full flex-col p-4">
                <h3 class="mb-2 font-semibold">Terminal</h3>
                <div class="flex-1 rounded bg-muted p-4 font-mono text-xs">
                  <div class="text-green-600">$ pnpm dev</div>
                  <div class="mt-2 text-muted-foreground">Server running at http://localhost:5173</div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="30" :min-size="25">
          <div class="flex h-full flex-col gap-2 p-4">
            <h3 class="font-semibold">Properties</h3>
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between py-1">
                <span class="text-muted-foreground">Width:</span>
                <span>100%</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-muted-foreground">Height:</span>
                <span>auto</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-muted-foreground">Display:</span>
                <span>block</span>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}

export const EmailClient: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="horizontal" class="min-h-[500px] max-w-5xl rounded-lg border">
        <ResizablePanel :default-size="20" :min-size="15" :max-size="25">
          <div class="flex h-full flex-col p-4">
            <h3 class="mb-4 font-semibold">Folders</h3>
            <div class="flex flex-col gap-1 text-sm">
              <div class="rounded px-2 py-1.5 hover:bg-accent">📥 Inbox (12)</div>
              <div class="rounded px-2 py-1.5 hover:bg-accent">📤 Sent</div>
              <div class="rounded px-2 py-1.5 hover:bg-accent">📝 Drafts (3)</div>
              <div class="rounded px-2 py-1.5 hover:bg-accent">🗑️ Trash</div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="35" :min-size="30">
          <div class="flex h-full flex-col">
            <div class="border-b p-4">
              <h3 class="font-semibold">Messages</h3>
            </div>
            <div class="flex-1 overflow-auto">
              <div class="border-b p-4 hover:bg-accent">
                <div class="mb-1 font-semibold">Team Meeting</div>
                <div class="text-xs text-muted-foreground">Let's schedule our weekly sync...</div>
              </div>
              <div class="border-b p-4 hover:bg-accent">
                <div class="mb-1 font-semibold">Project Update</div>
                <div class="text-xs text-muted-foreground">The new feature is ready for review...</div>
              </div>
              <div class="border-b p-4 hover:bg-accent">
                <div class="mb-1 font-semibold">Welcome!</div>
                <div class="text-xs text-muted-foreground">Thanks for signing up...</div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="45">
          <div class="flex h-full flex-col p-4">
            <div class="mb-4">
              <h3 class="mb-2 text-lg font-semibold">Team Meeting</h3>
              <div class="text-sm text-muted-foreground">From: john@example.com</div>
              <div class="text-sm text-muted-foreground">Date: Today, 10:30 AM</div>
            </div>
            <div class="flex-1 text-sm">
              <p>Hi team,</p>
              <p class="mt-4">Let's schedule our weekly sync for Thursday at 2 PM. Please confirm your availability.</p>
              <p class="mt-4">Thanks!</p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}

export const DashboardLayout: Story = {
  render: () => ({
    components: { ResizablePanelGroup, ResizablePanel, ResizableHandle },
    template: `
      <ResizablePanelGroup direction="horizontal" class="min-h-[500px] max-w-5xl rounded-lg border">
        <ResizablePanel :default-size="20" :min-size="15" :max-size="25">
          <div class="flex h-full flex-col p-6">
            <h3 class="mb-4 text-lg font-bold">Dashboard</h3>
            <div class="flex flex-col gap-2 text-sm">
              <div class="rounded px-3 py-2 hover:bg-accent">📊 Analytics</div>
              <div class="rounded px-3 py-2 hover:bg-accent">👥 Users</div>
              <div class="rounded px-3 py-2 hover:bg-accent">💰 Revenue</div>
              <div class="rounded px-3 py-2 hover:bg-accent">⚙️ Settings</div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="55">
          <div class="flex h-full flex-col p-6">
            <h3 class="mb-4 text-lg font-semibold">Analytics</h3>
            <div class="grid flex-1 grid-cols-2 gap-4">
              <div class="rounded-lg border p-4">
                <div class="text-sm text-muted-foreground">Total Users</div>
                <div class="mt-2 text-2xl font-bold">24,583</div>
                <div class="mt-1 text-xs text-green-600">+12.5% from last month</div>
              </div>
              <div class="rounded-lg border p-4">
                <div class="text-sm text-muted-foreground">Revenue</div>
                <div class="mt-2 text-2xl font-bold">$45,231</div>
                <div class="mt-1 text-xs text-green-600">+8.2% from last month</div>
              </div>
              <div class="rounded-lg border p-4">
                <div class="text-sm text-muted-foreground">Active Sessions</div>
                <div class="mt-2 text-2xl font-bold">1,429</div>
                <div class="mt-1 text-xs text-red-600">-3.1% from last month</div>
              </div>
              <div class="rounded-lg border p-4">
                <div class="text-sm text-muted-foreground">Conversion Rate</div>
                <div class="mt-2 text-2xl font-bold">3.24%</div>
                <div class="mt-1 text-xs text-green-600">+0.4% from last month</div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :default-size="25" :min-size="20">
          <div class="flex h-full flex-col p-6">
            <h3 class="mb-4 text-lg font-semibold">Activity</h3>
            <div class="flex flex-col gap-3 text-sm">
              <div class="border-l-2 border-blue-500 pl-3">
                <div class="font-medium">New user registered</div>
                <div class="text-xs text-muted-foreground">2 minutes ago</div>
              </div>
              <div class="border-l-2 border-green-500 pl-3">
                <div class="font-medium">Payment received</div>
                <div class="text-xs text-muted-foreground">15 minutes ago</div>
              </div>
              <div class="border-l-2 border-orange-500 pl-3">
                <div class="font-medium">Server alert</div>
                <div class="text-xs text-muted-foreground">1 hour ago</div>
              </div>
              <div class="border-l-2 border-blue-500 pl-3">
                <div class="font-medium">New comment</div>
                <div class="text-xs text-muted-foreground">2 hours ago</div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    `,
  }),
}
