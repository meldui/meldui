import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconCommand,
  IconCornerDownLeft,
} from '@meldui/tabler-vue'
import { Kbd, KbdGroup } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Kbd> = {
  title: 'Components/DataDisplay/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays keyboard shortcuts and key combinations. Useful for showing keyboard navigation hints and commands.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = {
  render: () => ({
    components: { Kbd },
    template: `
      <Kbd>⌘</Kbd>
    `,
  }),
}

export const SingleKeys: Story = {
  render: () => ({
    components: { Kbd },
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Kbd>A</Kbd>
        <Kbd>B</Kbd>
        <Kbd>C</Kbd>
        <Kbd>1</Kbd>
        <Kbd>2</Kbd>
        <Kbd>3</Kbd>
        <Kbd>⌘</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌃</Kbd>
      </div>
    `,
  }),
}

export const WithText: Story = {
  render: () => ({
    components: { Kbd },
    template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm">Press</span>
          <Kbd>Enter</Kbd>
          <span class="text-sm">to submit</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm">Press</span>
          <Kbd>Esc</Kbd>
          <span class="text-sm">to cancel</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm">Press</span>
          <Kbd>Tab</Kbd>
          <span class="text-sm">to navigate</span>
        </div>
      </div>
    `,
  }),
}

export const KeyCombinations: Story = {
  render: () => ({
    components: { Kbd, KbdGroup },
    template: `
      <div class="flex flex-col gap-3">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>C</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>V</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: { Kbd, KbdGroup, IconCommand, IconCornerDownLeft },
    template: `
      <div class="flex flex-col gap-3">
        <KbdGroup>
          <Kbd><IconCommand :size="12" /></Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd><IconCommand :size="12" /></Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
        <Kbd><IconCornerDownLeft :size="12" /></Kbd>
      </div>
    `,
  }),
}

export const ArrowKeys: Story = {
  render: () => ({
    components: { Kbd, IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight },
    template: `
      <div class="flex flex-col items-center gap-2">
        <Kbd><IconArrowUp :size="12" /></Kbd>
        <div class="flex gap-2">
          <Kbd><IconArrowLeft :size="12" /></Kbd>
          <Kbd><IconArrowDown :size="12" /></Kbd>
          <Kbd><IconArrowRight :size="12" /></Kbd>
        </div>
      </div>
    `,
  }),
}

export const CommonShortcuts: Story = {
  render: () => ({
    components: { Kbd, KbdGroup },
    template: `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Copy</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>C</Kbd>
          </KbdGroup>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Paste</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>V</Kbd>
          </KbdGroup>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Cut</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>X</Kbd>
          </KbdGroup>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Undo</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>Z</Kbd>
          </KbdGroup>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">Redo</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>Z</Kbd>
          </KbdGroup>
        </div>
      </div>
    `,
  }),
}

export const ShortcutList: Story = {
  render: () => ({
    components: { Kbd, KbdGroup },
    template: `
      <div class="w-full max-w-md space-y-4">
        <div>
          <h4 class="mb-3 text-sm font-semibold">Editor Shortcuts</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between rounded-md border p-2">
              <span class="text-sm">Save File</span>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>S</Kbd>
              </KbdGroup>
            </div>
            <div class="flex items-center justify-between rounded-md border p-2">
              <span class="text-sm">Open File</span>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>O</Kbd>
              </KbdGroup>
            </div>
            <div class="flex items-center justify-between rounded-md border p-2">
              <span class="text-sm">Find</span>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>F</Kbd>
              </KbdGroup>
            </div>
            <div class="flex items-center justify-between rounded-md border p-2">
              <span class="text-sm">Replace</span>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>H</Kbd>
              </KbdGroup>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: { Kbd, KbdGroup },
    template: `
      <div class="w-full max-w-md rounded-lg border">
        <div class="border-b p-4">
          <h3 class="font-semibold">Keyboard Shortcuts</h3>
          <p class="text-sm text-muted-foreground">Quick commands to boost your productivity</p>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">Search</div>
                <div class="text-xs text-muted-foreground">Open search dialog</div>
              </div>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">Command Palette</div>
                <div class="text-xs text-muted-foreground">Show all commands</div>
              </div>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>⇧</Kbd>
                <Kbd>P</Kbd>
              </KbdGroup>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium">Settings</div>
                <div class="text-xs text-muted-foreground">Open settings</div>
              </div>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>,</Kbd>
              </KbdGroup>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const InlineWithText: Story = {
  render: () => ({
    components: { Kbd, KbdGroup },
    template: `
      <div class="max-w-md space-y-4 text-sm">
        <p>
          You can use <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup> to quickly open the search dialog
          and find anything in your workspace.
        </p>
        <p>
          To open a file, press <KbdGroup><Kbd>⌘</Kbd><Kbd>P</Kbd></KbdGroup> and start typing the filename.
        </p>
        <p>
          Need help? Press <Kbd>F1</Kbd> or <KbdGroup><Kbd>⌘</Kbd><Kbd>⇧</Kbd><Kbd>P</Kbd></KbdGroup>
          to see all available commands.
        </p>
      </div>
    `,
  }),
}

export const LongKeys: Story = {
  render: () => ({
    components: { Kbd, KbdGroup },
    template: `
      <div class="flex flex-col gap-3">
        <Kbd>Enter</Kbd>
        <Kbd>Escape</Kbd>
        <Kbd>Delete</Kbd>
        <Kbd>Backspace</Kbd>
        <Kbd>Space</Kbd>
        <Kbd>Tab</Kbd>
        <KbdGroup>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
        </KbdGroup>
      </div>
    `,
  }),
}

export const NavigationHints: Story = {
  render: () => ({
    components: { Kbd, KbdGroup, IconArrowUp, IconArrowDown },
    template: `
      <div class="w-full max-w-sm rounded-lg border p-4">
        <div class="mb-4">
          <h4 class="text-sm font-semibold">Navigation Tips</h4>
        </div>
        <div class="space-y-3 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <KbdGroup>
              <Kbd><IconArrowUp :size="12" /></Kbd>
              <Kbd><IconArrowDown :size="12" /></Kbd>
            </KbdGroup>
            <span>Navigate through items</span>
          </div>
          <div class="flex items-center gap-2">
            <Kbd>Enter</Kbd>
            <span>Select item</span>
          </div>
          <div class="flex items-center gap-2">
            <Kbd>Esc</Kbd>
            <span>Close dialog</span>
          </div>
          <div class="flex items-center gap-2">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
            <span>Open command menu</span>
          </div>
        </div>
      </div>
    `,
  }),
}

export const MultiplePlatforms: Story = {
  render: () => ({
    components: { Kbd, KbdGroup },
    template: `
      <div class="w-full max-w-md space-y-6">
        <div>
          <h4 class="mb-3 text-sm font-semibold">macOS</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">Copy</span>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>C</Kbd>
              </KbdGroup>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Paste</span>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        </div>
        <div>
          <h4 class="mb-3 text-sm font-semibold">Windows/Linux</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">Copy</span>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>C</Kbd>
              </KbdGroup>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Paste</span>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>V</Kbd>
              </KbdGroup>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const FunctionKeys: Story = {
  render: () => ({
    components: { Kbd },
    template: `
      <div class="flex flex-wrap gap-2">
        <Kbd>F1</Kbd>
        <Kbd>F2</Kbd>
        <Kbd>F3</Kbd>
        <Kbd>F4</Kbd>
        <Kbd>F5</Kbd>
        <Kbd>F6</Kbd>
        <Kbd>F7</Kbd>
        <Kbd>F8</Kbd>
        <Kbd>F9</Kbd>
        <Kbd>F10</Kbd>
        <Kbd>F11</Kbd>
        <Kbd>F12</Kbd>
      </div>
    `,
  }),
}
