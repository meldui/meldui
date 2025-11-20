import {
  IconCheck,
  IconCircle,
  IconCommand,
  IconFile,
  IconFileText,
  IconFolder,
  IconPrinter,
  IconSearch,
  IconSettings,
  IconUser,
} from '@meldui/tabler-vue'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Menubar> = {
  title: 'Components/Navigation/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands. Typically appears at the top of an application window.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      Menubar,
      MenubarContent,
      MenubarItem,
      MenubarMenu,
      MenubarSeparator,
      MenubarShortcut,
      MenubarTrigger,
    },
    template: `
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>New Incognito Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Print...
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Cut
              <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Copy
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Paste
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Reload
              <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Force Reload
              <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: {
      Menubar,
      MenubarContent,
      MenubarItem,
      MenubarMenu,
      MenubarSeparator,
      MenubarShortcut,
      MenubarTrigger,
      IconFile,
      IconFileText,
      IconFolder,
      IconPrinter,
      IconSettings,
      IconSearch,
    },
    template: `
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <IconFileText />
              New File
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <IconFolder />
              Open Folder
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <IconFile />
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <IconFile />
              Save As...
              <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <IconPrinter />
              Print
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <IconSearch />
              Find
              <MenubarShortcut>⌘F</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <IconSearch />
              Replace
              <MenubarShortcut>⌘H</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Settings</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <IconSettings />
              Preferences
              <MenubarShortcut>⌘,</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
}

export const WithCheckboxItems: Story = {
  render: () => ({
    components: {
      Menubar,
      MenubarCheckboxItem,
      MenubarContent,
      MenubarItem,
      MenubarMenu,
      MenubarSeparator,
      MenubarTrigger,
    },
    setup() {
      const showStatusBar = ref(true)
      const showActivityBar = ref(false)
      const showPanel = ref(false)

      return { showStatusBar, showActivityBar, showPanel }
    },
    template: `
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem v-model:checked="showStatusBar">
              Status Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem v-model:checked="showActivityBar">
              Activity Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem v-model:checked="showPanel">
              Panel
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>Appearance</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
}

export const WithRadioGroup: Story = {
  render: () => ({
    components: {
      Menubar,
      MenubarContent,
      MenubarMenu,
      MenubarRadioGroup,
      MenubarRadioItem,
      MenubarSeparator,
      MenubarTrigger,
    },
    setup() {
      const position = ref('bottom')

      return { position }
    },
    template: `
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup v-model="position">
              <MenubarRadioItem value="top">Top</MenubarRadioItem>
              <MenubarRadioItem value="bottom">Bottom</MenubarRadioItem>
              <MenubarRadioItem value="right">Right</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarRadioGroup v-model="position">
              <MenubarRadioItem value="left">Left</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
}

export const WithSubmenus: Story = {
  render: () => ({
    components: {
      Menubar,
      MenubarContent,
      MenubarItem,
      MenubarMenu,
      MenubarSeparator,
      MenubarShortcut,
      MenubarSub,
      MenubarSubContent,
      MenubarSubTrigger,
      MenubarTrigger,
      IconFile,
    },
    template: `
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>
                <IconFile />
                New File
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>JavaScript File</MenubarItem>
                <MenubarItem>TypeScript File</MenubarItem>
                <MenubarItem>Vue Component</MenubarItem>
                <MenubarItem>React Component</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>HTML File</MenubarItem>
                <MenubarItem>CSS File</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Print...
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
}

export const WithLabelsAndGroups: Story = {
  render: () => ({
    components: {
      Menubar,
      MenubarContent,
      MenubarGroup,
      MenubarItem,
      MenubarLabel,
      MenubarMenu,
      MenubarSeparator,
      MenubarTrigger,
      IconUser,
      IconSettings,
    },
    template: `
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>My Account</MenubarLabel>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>
                <IconUser />
                Profile
              </MenubarItem>
              <MenubarItem>
                <IconSettings />
                Settings
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarLabel>Team</MenubarLabel>
            <MenubarGroup>
              <MenubarItem>Invite Members</MenubarItem>
              <MenubarItem>Manage Team</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarItem>Log out</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
}

export const ApplicationMenu: Story = {
  render: () => ({
    components: {
      Menubar,
      MenubarCheckboxItem,
      MenubarContent,
      MenubarGroup,
      MenubarItem,
      MenubarLabel,
      MenubarMenu,
      MenubarRadioGroup,
      MenubarRadioItem,
      MenubarSeparator,
      MenubarShortcut,
      MenubarSub,
      MenubarSubContent,
      MenubarSubTrigger,
      MenubarTrigger,
      IconCheck,
      IconCircle,
      IconCommand,
    },
    setup() {
      const showBookmarks = ref(true)
      const showFullUrls = ref(false)
      const person = ref('pedro')

      return { showBookmarks, showFullUrls, person }
    },
    template: `
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>New Incognito Window</MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Print...
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Search the web</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Find...</MenubarItem>
                <MenubarItem>Find Next</MenubarItem>
                <MenubarItem>Find Previous</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem v-model:checked="showBookmarks">
              Always Show Bookmarks Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem v-model:checked="showFullUrls">
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload
              <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload
              <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup v-model="person">
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
}

export const WithDestructiveActions: Story = {
  render: () => ({
    components: {
      Menubar,
      MenubarContent,
      MenubarItem,
      MenubarMenu,
      MenubarSeparator,
      MenubarShortcut,
      MenubarTrigger,
    },
    template: `
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
            <MenubarItem>Save</MenubarItem>
            <MenubarItem>Save As...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Close</MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              Delete File
              <MenubarShortcut>⌘D</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              Clear All
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
}
