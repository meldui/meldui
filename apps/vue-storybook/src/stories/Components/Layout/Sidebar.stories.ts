import {
  IconChevronDown,
  IconChevronRight,
  IconFile,
  IconFolder,
  IconHome,
  IconInbox,
  IconSearch,
  IconSettings,
  IconUser,
} from '@meldui/tabler-vue'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof SidebarProvider> = {
  title: 'Components/Layout/Sidebar',
  component: SidebarProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A collapsible sidebar component with mobile support and multiple variants. Provides navigation structure for applications.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SidebarProvider>

export const Default: Story = {
  render: () => ({
    components: {
      SidebarProvider,
      Sidebar,
      SidebarContent,
      SidebarGroup,
      SidebarGroupLabel,
      SidebarGroupContent,
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
      SidebarInset,
      SidebarTrigger,
      IconHome,
      IconInbox,
      IconUser,
      IconSettings,
    },
    template: `
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconHome :size="16" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconInbox :size="16" />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconUser :size="16" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconSettings :size="16" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-lg font-semibold">Dashboard</h1>
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="min-h-screen">
              <h2 class="mb-4 text-xl font-semibold">Welcome</h2>
              <p class="text-muted-foreground">
                This is the main content area. The sidebar can be toggled using the button in the header.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    `,
  }),
}

export const WithHeader: Story = {
  render: () => ({
    components: {
      SidebarProvider,
      Sidebar,
      SidebarHeader,
      SidebarContent,
      SidebarFooter,
      SidebarGroup,
      SidebarGroupLabel,
      SidebarGroupContent,
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
      SidebarInset,
      SidebarTrigger,
      IconHome,
      IconFolder,
      IconSearch,
      IconSettings,
      IconUser,
    },
    template: `
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader class="border-b px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                M
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold">MeldUI</span>
                <span class="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton is-active>
                      <IconHome :size="16" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconFolder :size="16" />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconSearch :size="16" />
                      <span>Search</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconUser :size="16" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconSettings :size="16" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter class="border-t p-4">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                JD
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium">John Doe</span>
                <span class="text-xs text-muted-foreground">john@example.com</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-lg font-semibold">Dashboard</h1>
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div class="rounded-lg border p-4">
                <h3 class="mb-2 text-sm font-medium">Total Users</h3>
                <p class="text-2xl font-bold">1,234</p>
              </div>
              <div class="rounded-lg border p-4">
                <h3 class="mb-2 text-sm font-medium">Active Projects</h3>
                <p class="text-2xl font-bold">56</p>
              </div>
              <div class="rounded-lg border p-4">
                <h3 class="mb-2 text-sm font-medium">Tasks</h3>
                <p class="text-2xl font-bold">89</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    `,
  }),
}

export const CollapsibleIcon: Story = {
  render: () => ({
    components: {
      SidebarProvider,
      Sidebar,
      SidebarContent,
      SidebarGroup,
      SidebarGroupLabel,
      SidebarGroupContent,
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
      SidebarInset,
      SidebarTrigger,
      IconHome,
      IconInbox,
      IconUser,
      IconSettings,
    },
    template: `
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Home">
                      <IconHome :size="16" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Inbox">
                      <IconInbox :size="16" />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Profile">
                      <IconUser :size="16" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <IconSettings :size="16" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-lg font-semibold">Collapsible Sidebar</h1>
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="rounded-lg border p-6">
              <h2 class="mb-2 text-lg font-semibold">Icon Mode</h2>
              <p class="text-sm text-muted-foreground">
                Click the toggle button to collapse the sidebar to icon-only mode.
                Hover over icons to see tooltips.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    `,
  }),
}

export const FloatingVariant: Story = {
  render: () => ({
    components: {
      SidebarProvider,
      Sidebar,
      SidebarContent,
      SidebarGroup,
      SidebarGroupLabel,
      SidebarGroupContent,
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
      SidebarInset,
      SidebarTrigger,
      IconHome,
      IconFolder,
      IconUser,
      IconSettings,
    },
    template: `
      <SidebarProvider>
        <Sidebar variant="floating">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconHome :size="16" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconFolder :size="16" />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconUser :size="16" />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconSettings :size="16" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-lg font-semibold">Floating Sidebar</h1>
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="rounded-lg border p-6">
              <h2 class="mb-2 text-lg font-semibold">Floating Variant</h2>
              <p class="text-sm text-muted-foreground">
                The floating variant adds padding and a shadow effect, making the sidebar
                appear to float above the content.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    `,
  }),
}

export const RightSide: Story = {
  render: () => ({
    components: {
      SidebarProvider,
      Sidebar,
      SidebarContent,
      SidebarGroup,
      SidebarGroupLabel,
      SidebarGroupContent,
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
      SidebarInset,
      SidebarTrigger,
      IconHome,
      IconInbox,
      IconUser,
      IconSettings,
    },
    template: `
      <SidebarProvider>
        <SidebarInset>
          <header class="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <h1 class="text-lg font-semibold">Right Sidebar</h1>
            <SidebarTrigger />
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="rounded-lg border p-6">
              <h2 class="mb-2 text-lg font-semibold">Right-Side Layout</h2>
              <p class="text-sm text-muted-foreground">
                The sidebar can be positioned on the right side of the screen.
                Toggle it using the button in the header.
              </p>
            </div>
          </div>
        </SidebarInset>
        <Sidebar side="right">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconHome :size="16" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconInbox :size="16" />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconUser :size="16" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconSettings :size="16" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    `,
  }),
}

export const WithBadges: Story = {
  render: () => ({
    components: {
      SidebarProvider,
      Sidebar,
      SidebarContent,
      SidebarGroup,
      SidebarGroupLabel,
      SidebarGroupContent,
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
      SidebarInset,
      SidebarTrigger,
      IconHome,
      IconInbox,
      IconFolder,
      IconUser,
    },
    template: `
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconHome :size="16" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconInbox :size="16" />
                      <span>Inbox</span>
                      <span class="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        12
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconFolder :size="16" />
                      <span>Projects</span>
                      <span class="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                        5
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconUser :size="16" />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-lg font-semibold">Sidebar with Badges</h1>
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="rounded-lg border p-6">
              <h2 class="mb-2 text-lg font-semibold">Notification Badges</h2>
              <p class="text-sm text-muted-foreground">
                Menu items can display badges to show counts or notifications.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    `,
  }),
}

export const NestedMenus: Story = {
  render: () => ({
    components: {
      SidebarProvider,
      Sidebar,
      SidebarContent,
      SidebarGroup,
      SidebarGroupLabel,
      SidebarGroupContent,
      SidebarMenu,
      SidebarMenuItem,
      SidebarMenuButton,
      SidebarMenuSub,
      SidebarMenuSubItem,
      SidebarMenuSubButton,
      SidebarInset,
      SidebarTrigger,
      Collapsible,
      CollapsibleTrigger,
      CollapsibleContent,
      IconHome,
      IconFolder,
      IconFile,
      IconUser,
      IconSettings,
      IconChevronRight,
      IconChevronDown,
    },
    setup() {
      const openProjects = ref(false)
      const openDocs = ref(false)
      return { openProjects, openDocs }
    },
    template: `
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton is-active>
                      <IconHome :size="16" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <Collapsible v-model:open="openProjects" class="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger as-child>
                        <SidebarMenuButton>
                          <IconFolder :size="16" />
                          <span>Projects</span>
                          <IconChevronRight
                            :size="16"
                            class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <IconFile :size="14" />
                              <span>Project Alpha</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <IconFile :size="14" />
                              <span>Project Beta</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <IconFile :size="14" />
                              <span>Project Gamma</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <Collapsible v-model:open="openDocs" class="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger as-child>
                        <SidebarMenuButton>
                          <IconFolder :size="16" />
                          <span>Documentation</span>
                          <IconChevronRight
                            :size="16"
                            class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <IconFile :size="14" />
                              <span>Getting Started</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <IconFile :size="14" />
                              <span>Components</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <IconFile :size="14" />
                              <span>API Reference</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton>
                              <IconFile :size="14" />
                              <span>Examples</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconUser :size="16" />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconSettings :size="16" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-lg font-semibold">Nested Menus</h1>
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="rounded-lg border p-6">
              <h2 class="mb-2 text-lg font-semibold">Collapsible Nested Menus</h2>
              <p class="text-sm text-muted-foreground">
                Menu items can have collapsible submenus. Click on "Projects" or "Documentation"
                to expand and see nested menu items. The chevron icon rotates to indicate the open/closed state.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    `,
  }),
}
