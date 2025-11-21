import {
  IconBell,
  IconBold,
  IconCalendar,
  IconClipboard,
  IconClock,
  IconCode,
  IconCopy,
  IconCut,
  IconDownload,
  IconFile,
  IconFolder,
  IconHome,
  IconItalic,
  IconLogout,
  IconMail,
  IconMoon,
  IconSearch,
  IconSettings,
  IconStar,
  IconSun,
  IconTrash,
  IconUnderline,
  IconUpload,
  IconUser,
} from '@meldui/tabler-vue'
import {
  Button,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Command> = {
  title: 'Components/Interactive/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A command palette component with search, keyboard navigation, and grouping. Perfect for building command-k style interfaces with instant search and filtering.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Command>

export const Default: Story = {
  render: () => ({
    components: { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">Calendar</CommandItem>
              <CommandItem value="search-emoji">Search Emoji</CommandItem>
              <CommandItem value="calculator">Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCalendar,
      IconSettings,
      IconUser,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">
                <IconCalendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem value="settings">
                <IconSettings />
                <span>Settings</span>
              </CommandItem>
              <CommandItem value="profile">
                <IconUser />
                <span>Profile</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const WithShortcuts: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      CommandShortcut,
      IconCalendar,
      IconSettings,
      IconUser,
      IconMail,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem value="calendar">
                <IconCalendar />
                <span>Calendar</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings">
                <IconSettings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem value="profile">
                <IconUser />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="mail">
                <IconMail />
                <span>Mail</span>
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const MultipleGroups: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      CommandSeparator,
      IconFile,
      IconFolder,
      IconSettings,
      IconUser,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Files">
              <CommandItem value="new-file">
                <IconFile />
                <span>New File</span>
              </CommandItem>
              <CommandItem value="new-folder">
                <IconFolder />
                <span>New Folder</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem value="preferences">
                <IconSettings />
                <span>Preferences</span>
              </CommandItem>
              <CommandItem value="account">
                <IconUser />
                <span>Account</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const FileSearch: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconFile,
      IconClock,
      IconStar,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Search files..." />
          <CommandList>
            <CommandEmpty>No files found.</CommandEmpty>
            <CommandGroup heading="Recent">
              <CommandItem value="project-proposal">
                <IconFile />
                <span>project-proposal.pdf</span>
              </CommandItem>
              <CommandItem value="meeting-notes">
                <IconFile />
                <span>meeting-notes.docx</span>
              </CommandItem>
              <CommandItem value="budget-2024">
                <IconFile />
                <span>budget-2024.xlsx</span>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Starred">
              <CommandItem value="important-doc">
                <IconStar class="text-yellow-500" />
                <span>important-document.pdf</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const QuickActions: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      CommandShortcut,
      IconCopy,
      IconCut,
      IconClipboard,
      IconDownload,
      IconUpload,
      IconTrash,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Search actions..." />
          <CommandList>
            <CommandEmpty>No actions found.</CommandEmpty>
            <CommandGroup heading="Edit">
              <CommandItem value="copy">
                <IconCopy />
                <span>Copy</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem value="cut">
                <IconCut />
                <span>Cut</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem value="paste">
                <IconClipboard />
                <span>Paste</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="File">
              <CommandItem value="download">
                <IconDownload />
                <span>Download</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem value="upload">
                <IconUpload />
                <span>Upload</span>
                <CommandShortcut>⌘U</CommandShortcut>
              </CommandItem>
              <CommandItem value="delete">
                <IconTrash />
                <span>Delete</span>
                <CommandShortcut>⌘⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const TextEditor: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      CommandShortcut,
      IconBold,
      IconItalic,
      IconUnderline,
      IconCode,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Search formatting..." />
          <CommandList>
            <CommandEmpty>No formatting options found.</CommandEmpty>
            <CommandGroup heading="Text Formatting">
              <CommandItem value="bold">
                <IconBold />
                <span>Bold</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem value="italic">
                <IconItalic />
                <span>Italic</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem value="underline">
                <IconUnderline />
                <span>Underline</span>
                <CommandShortcut>⌘U</CommandShortcut>
              </CommandItem>
              <CommandItem value="code">
                <IconCode />
                <span>Inline Code</span>
                <CommandShortcut>⌘E</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const NavigationMenu: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      CommandSeparator,
      IconHome,
      IconSearch,
      IconSettings,
      IconUser,
      IconBell,
      IconLogout,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Navigate to..." />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            <CommandGroup heading="Main">
              <CommandItem value="home">
                <IconHome />
                <span>Home</span>
              </CommandItem>
              <CommandItem value="search">
                <IconSearch />
                <span>Search</span>
              </CommandItem>
              <CommandItem value="notifications">
                <IconBell />
                <span>Notifications</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem value="profile">
                <IconUser />
                <span>Profile</span>
              </CommandItem>
              <CommandItem value="settings">
                <IconSettings />
                <span>Settings</span>
              </CommandItem>
              <CommandItem value="logout">
                <IconLogout />
                <span>Logout</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const ThemeSwitcher: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconSun,
      IconMoon,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Choose theme..." />
          <CommandList>
            <CommandEmpty>No themes found.</CommandEmpty>
            <CommandGroup heading="Appearance">
              <CommandItem value="light">
                <IconSun />
                <span>Light Theme</span>
              </CommandItem>
              <CommandItem value="dark">
                <IconMoon />
                <span>Dark Theme</span>
              </CommandItem>
              <CommandItem value="system">
                <IconSettings />
                <span>System Default</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const WithDialog: Story = {
  render: () => ({
    components: {
      CommandDialog,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      CommandSeparator,
      CommandShortcut,
      Button,
      IconCalendar,
      IconSettings,
      IconUser,
      IconMail,
      IconSearch,
    },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <div class="w-full">
        <Button @click="open = true">
          <IconSearch />
          Open Command Palette
          <CommandShortcut class="ml-2">⌘K</CommandShortcut>
        </Button>
        <CommandDialog v-model:open="open">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar" @select="open = false">
                <IconCalendar />
                <span>Calendar</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem value="search" @select="open = false">
                <IconSearch />
                <span>Search Emoji</span>
                <CommandShortcut>⌘E</CommandShortcut>
              </CommandItem>
              <CommandItem value="mail" @select="open = false">
                <IconMail />
                <span>Mail</span>
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem value="profile" @select="open = false">
                <IconUser />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings" @select="open = false">
                <IconSettings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    `,
  }),
}

export const EmptyState: Story = {
  render: () => ({
    components: { Command, CommandInput, CommandList, CommandEmpty },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Search for something that doesn't exist..." />
          <CommandList>
            <CommandEmpty>
              <div class="flex flex-col items-center justify-center py-6 text-center">
                <div class="mb-2 text-4xl">🔍</div>
                <div class="mb-1 text-sm font-medium">No results found</div>
                <div class="text-xs text-muted-foreground">Try searching for something else</div>
              </div>
            </CommandEmpty>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const LongList: Story = {
  render: () => ({
    components: { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem },
    setup() {
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
      }))
      return { items }
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Search items..." />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup heading="All Items">
              <CommandItem v-for="item in items" :key="item.id" :value="item.name">
                {{ item.name }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const WithDescriptions: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCalendar,
      IconSettings,
      IconUser,
      IconMail,
    },
    template: `
      <div class="w-full max-w-lg">
        <Command class="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem value="calendar">
                <IconCalendar />
                <div class="flex flex-col gap-1">
                  <span class="font-medium">Calendar</span>
                  <span class="text-xs text-muted-foreground">View and manage events</span>
                </div>
              </CommandItem>
              <CommandItem value="settings">
                <IconSettings />
                <div class="flex flex-col gap-1">
                  <span class="font-medium">Settings</span>
                  <span class="text-xs text-muted-foreground">Configure application preferences</span>
                </div>
              </CommandItem>
              <CommandItem value="profile">
                <IconUser />
                <div class="flex flex-col gap-1">
                  <span class="font-medium">Profile</span>
                  <span class="text-xs text-muted-foreground">Manage your account</span>
                </div>
              </CommandItem>
              <CommandItem value="mail">
                <IconMail />
                <div class="flex flex-col gap-1">
                  <span class="font-medium">Mail</span>
                  <span class="text-xs text-muted-foreground">Check your inbox</span>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const Compact: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconHome,
      IconSettings,
      IconUser,
    },
    template: `
      <div class="w-full max-w-md">
        <Command class="rounded-lg border shadow-sm">
          <CommandInput placeholder="Search..." class="h-8" />
          <CommandList class="max-h-[200px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem value="home" class="py-1">
                <IconHome :size="14" />
                <span class="text-xs">Home</span>
              </CommandItem>
              <CommandItem value="profile" class="py-1">
                <IconUser :size="14" />
                <span class="text-xs">Profile</span>
              </CommandItem>
              <CommandItem value="settings" class="py-1">
                <IconSettings :size="14" />
                <span class="text-xs">Settings</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      CommandShortcut,
      IconCalendar,
      IconSettings,
      IconUser,
    },
    template: `
      <div class="mx-auto w-full max-w-2xl rounded-lg border bg-background p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Quick Actions</h3>
          <p class="text-sm text-muted-foreground">Search and execute commands</p>
        </div>
        <Command class="rounded-lg border">
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">
                <IconCalendar />
                <span>Open Calendar</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem value="profile">
                <IconUser />
                <span>View Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings">
                <IconSettings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    `,
  }),
}
