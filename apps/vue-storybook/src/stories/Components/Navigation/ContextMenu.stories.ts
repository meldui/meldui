import {
  IconClipboard,
  IconCopy,
  IconCut,
  IconDownload,
  IconEdit,
  IconFile,
  IconFolder,
  IconRefresh,
  IconShare,
  IconTrash,
} from '@meldui/tabler-vue'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/Navigation/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays a menu to the user when they right-click or long-press. Also known as a context menu, right-click menu, or popup menu. Useful for providing contextual actions for a specific element.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuContent,
      ContextMenuItem,
      ContextMenuSeparator,
      ContextMenuShortcut,
      ContextMenuTrigger,
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Print
            <ContextMenuShortcut>⌘P</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuContent,
      ContextMenuItem,
      ContextMenuSeparator,
      ContextMenuShortcut,
      ContextMenuTrigger,
      IconCopy,
      IconCut,
      IconClipboard,
      IconEdit,
      IconTrash,
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right click for actions
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <IconEdit />
            Edit
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <IconCut />
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconCopy />
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconClipboard />
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <IconTrash />
            Delete
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}

export const WithCheckboxItems: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuCheckboxItem,
      ContextMenuContent,
      ContextMenuItem,
      ContextMenuSeparator,
      ContextMenuTrigger,
    },
    setup() {
      const showBookmarks = ref(true)
      const showFullUrls = ref(false)
      const showToolbar = ref(true)

      return { showBookmarks, showFullUrls, showToolbar }
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right click to toggle options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem v-model:checked="showBookmarks">
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem v-model:checked="showFullUrls">
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem v-model:checked="showToolbar">
            Show Toolbar
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem inset>Reset to Defaults</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}

export const WithRadioGroup: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuContent,
      ContextMenuLabel,
      ContextMenuRadioGroup,
      ContextMenuRadioItem,
      ContextMenuSeparator,
      ContextMenuTrigger,
    },
    setup() {
      const position = ref('bottom')

      return { position }
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right click to select position
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Panel Position</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup v-model="position">
            <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
            <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
            <ContextMenuRadioItem value="left">Left</ContextMenuRadioItem>
            <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}

export const WithSubmenus: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuContent,
      ContextMenuItem,
      ContextMenuSeparator,
      ContextMenuSub,
      ContextMenuSubContent,
      ContextMenuSubTrigger,
      ContextMenuTrigger,
      IconShare,
      IconFolder,
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right click for nested menus
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <IconShare />
              Share
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Email</ContextMenuItem>
              <ContextMenuItem>Messages</ContextMenuItem>
              <ContextMenuItem>Notes</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Copy Link</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <IconFolder />
              Move to Folder
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Documents</ContextMenuItem>
              <ContextMenuItem>Downloads</ContextMenuItem>
              <ContextMenuItem>Desktop</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>New Folder...</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Properties</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}

export const WithLabelsAndGroups: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuContent,
      ContextMenuGroup,
      ContextMenuItem,
      ContextMenuLabel,
      ContextMenuSeparator,
      ContextMenuTrigger,
      IconCopy,
      IconCut,
      IconClipboard,
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Edit Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              <IconCut />
              Cut
            </ContextMenuItem>
            <ContextMenuItem>
              <IconCopy />
              Copy
            </ContextMenuItem>
            <ContextMenuItem>
              <IconClipboard />
              Paste
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuLabel>Other Actions</ContextMenuLabel>
          <ContextMenuGroup>
            <ContextMenuItem>Select All</ContextMenuItem>
            <ContextMenuItem>Find</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}

export const FileExplorer: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuCheckboxItem,
      ContextMenuContent,
      ContextMenuItem,
      ContextMenuSeparator,
      ContextMenuShortcut,
      ContextMenuSub,
      ContextMenuSubContent,
      ContextMenuSubTrigger,
      ContextMenuTrigger,
      IconCopy,
      IconCut,
      IconDownload,
      IconEdit,
      IconFile,
      IconFolder,
      IconClipboard,
      IconShare,
      IconTrash,
    },
    setup() {
      const showHidden = ref(false)

      return { showHidden }
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[200px] w-[350px] flex-col items-center justify-center gap-4 rounded-md border border-dashed">
          <IconFolder :size="48" class="text-muted-foreground" />
          <span class="text-sm">Right click on file</span>
        </ContextMenuTrigger>
        <ContextMenuContent class="w-64">
          <ContextMenuItem>
            <IconFile />
            Open
            <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconEye />
            Open with...
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <IconCut />
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconCopy />
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconClipboard />
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <IconEdit />
            Rename
            <ContextMenuShortcut>F2</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <IconShare />
              Share
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Email Link</ContextMenuItem>
              <ContextMenuItem>Copy Link</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Share with Team</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem>
            <IconDownload />
            Download
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem v-model:checked="showHidden">
            Show Hidden Files
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <IconTrash />
            Delete
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}

export const TextEditor: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuCheckboxItem,
      ContextMenuContent,
      ContextMenuItem,
      ContextMenuSeparator,
      ContextMenuShortcut,
      ContextMenuSub,
      ContextMenuSubContent,
      ContextMenuSubTrigger,
      ContextMenuTrigger,
    },
    setup() {
      const wordWrap = ref(true)
      const showLineNumbers = ref(true)

      return { wordWrap, showLineNumbers }
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[200px] w-[400px] items-start justify-start rounded-md border border-dashed p-4">
          <div class="font-mono text-sm">
            <div>function hello() {</div>
            <div class="pl-4">console.log('Hello, World!');</div>
            <div>}</div>
            <div class="mt-2 text-xs text-muted-foreground">Right click in editor</div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent class="w-64">
          <ContextMenuItem>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>Format</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Format Document</ContextMenuItem>
              <ContextMenuItem>Format Selection</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Indent</ContextMenuItem>
              <ContextMenuItem>Outdent</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Refactor</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Extract Method</ContextMenuItem>
              <ContextMenuItem>Extract Variable</ContextMenuItem>
              <ContextMenuItem>Rename Symbol</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Find
            <ContextMenuShortcut>⌘F</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Replace
            <ContextMenuShortcut>⌘H</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem v-model:checked="wordWrap">
            Word Wrap
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem v-model:checked="showLineNumbers">
            Show Line Numbers
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Command Palette...</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}

export const ImageContext: Story = {
  render: () => ({
    components: {
      ContextMenu,
      ContextMenuContent,
      ContextMenuItem,
      ContextMenuSeparator,
      ContextMenuSub,
      ContextMenuSubContent,
      ContextMenuSubTrigger,
      ContextMenuTrigger,
      IconCopy,
      IconDownload,
      IconEdit,
      IconRefresh,
      IconShare,
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger class="flex h-[200px] w-[300px] items-center justify-center rounded-md border border-dashed bg-muted/20">
          <div class="flex flex-col items-center gap-2">
            <div class="h-16 w-16 rounded bg-muted" />
            <span class="text-sm text-muted-foreground">Right click on image</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent class="w-56">
          <ContextMenuItem>
            <IconEye />
            View Image
          </ContextMenuItem>
          <ContextMenuItem>
            <IconDownload />
            Save Image As...
          </ContextMenuItem>
          <ContextMenuItem>
            <IconCopy />
            Copy Image
          </ContextMenuItem>
          <ContextMenuItem>
            <IconCopy />
            Copy Image URL
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <IconEdit />
            Edit Image
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <IconRefresh />
              Rotate
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Rotate Left</ContextMenuItem>
              <ContextMenuItem>Rotate Right</ContextMenuItem>
              <ContextMenuItem>Flip Horizontal</ContextMenuItem>
              <ContextMenuItem>Flip Vertical</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <IconShare />
            Share Image...
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Properties</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
}
