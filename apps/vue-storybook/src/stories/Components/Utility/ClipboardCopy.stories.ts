import {
  ClipboardCopy,
  ClipboardCopyButton,
  CopyIdle,
  CopySuccess,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { IconCheck, IconCopy, IconKey } from '@meldui/tabler-vue'
import { ref } from 'vue'
import { Button } from '@meldui/vue'

const meta: Meta<typeof ClipboardCopyButton> = {
  title: 'Components/Utility/ClipboardCopy',
  component: ClipboardCopyButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible clipboard copy system with provider-based state management. Includes an opinionated button component for common use cases and composable components for custom implementations.',
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to copy to clipboard',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Button variant',
      defaultValue: 'outline',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size',
      defaultValue: 'default',
    },
    copiedDuration: {
      control: 'number',
      description: 'Duration in milliseconds to show copied state',
      defaultValue: 2000,
    },
    label: {
      control: 'text',
      description: 'Custom label for idle state',
      defaultValue: 'Copy',
    },
    copiedLabel: {
      control: 'text',
      description: 'Custom label for success state',
      defaultValue: 'Copied!',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show icons',
      defaultValue: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof ClipboardCopyButton>

export const Default: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    template: `
      <ClipboardCopyButton text="npm install @meldui/vue" />
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    template: `
      <div class="flex flex-wrap gap-3">
        <ClipboardCopyButton text="Default variant" variant="default" />
        <ClipboardCopyButton text="Outline variant" variant="outline" />
        <ClipboardCopyButton text="Secondary variant" variant="secondary" />
        <ClipboardCopyButton text="Ghost variant" variant="ghost" />
        <ClipboardCopyButton text="Destructive variant" variant="destructive" />
        <ClipboardCopyButton text="Link variant" variant="link" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    template: `
      <div class="flex items-center gap-3">
        <ClipboardCopyButton text="Small size" size="sm" />
        <ClipboardCopyButton text="Default size" size="default" />
        <ClipboardCopyButton text="Large size" size="lg" />
      </div>
    `,
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    template: `
      <div class="flex items-center gap-3">
        <ClipboardCopyButton text="Copied text" size="icon-sm" label="" copied-label="" />
        <ClipboardCopyButton text="Copied text" size="icon" label="" copied-label="" />
        <ClipboardCopyButton text="Copied text" size="icon-lg" label="" copied-label="" />
      </div>
    `,
  }),
}

export const CustomLabels: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    template: `
      <div class="flex flex-wrap gap-3">
        <ClipboardCopyButton
          text="API_KEY_123456789"
          label="Copy API Key"
          copied-label="Key Copied!"
        />
        <ClipboardCopyButton
          text="user@example.com"
          label="Copy Email"
          copied-label="Email Copied!"
        />
        <ClipboardCopyButton
          text="https://example.com/share/abc123"
          label="Share Link"
          copied-label="Link Copied!"
        />
      </div>
    `,
  }),
}

export const WithoutIcons: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    template: `
      <ClipboardCopyButton
        text="Text without icons"
        :show-icon="false"
      />
    `,
  }),
}

export const LongDuration: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          This button shows the "Copied!" state for 5 seconds:
        </p>
        <ClipboardCopyButton
          text="This stays copied for 5 seconds"
          :copied-duration="5000"
        />
      </div>
    `,
  }),
}

export const AsChildCustomButton: Story = {
  render: () => ({
    components: { ClipboardCopy, CopyIdle, CopySuccess, Button, IconCopy, IconKey },
    template: `
      <ClipboardCopy as-child text="secret_api_key_xyz789">
        <Button variant="default">
          <CopyIdle>
            <IconKey :size="16" class="mr-2" />
            Copy Secret Key
          </CopyIdle>
          <CopySuccess>
            <IconCheck :size="16" class="mr-2 text-green-600" />
            Key Copied Securely!
          </CopySuccess>
        </Button>
      </ClipboardCopy>
    `,
  }),
}

export const AsChildDynamicVariant: Story = {
  render: () => ({
    components: { ClipboardCopy, CopyIdle, CopySuccess, Button, IconCopy, IconCheck },
    template: `
      <ClipboardCopy as-child text="Dynamic variant example" v-slot="{ isCopied }">
        <Button :variant="isCopied ? 'default' : 'outline'">
          <CopyIdle>
            <IconCopy :size="16" class="mr-2" />
            Click to Copy
          </CopyIdle>
          <CopySuccess>
            <IconCheck :size="16" class="mr-2" />
            Successfully Copied!
          </CopySuccess>
        </Button>
      </ClipboardCopy>
    `,
  }),
}

export const FunctionText: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    setup() {
      const getText = () => {
        const timestamp = new Date().toISOString()
        return `Generated at: ${timestamp}`
      }
      return { getText }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Each click copies a new timestamp:
        </p>
        <ClipboardCopyButton
          :text="getText"
          label="Copy Current Timestamp"
        />
      </div>
    `,
  }),
}

export const InCodeBlock: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    setup() {
      const codeSnippets = [
        'npm install @meldui/vue',
        'pnpm add @meldui/vue',
        'yarn add @meldui/vue',
      ]
      return { codeSnippets }
    },
    template: `
      <div class="space-y-4">
        <div
          v-for="(code, index) in codeSnippets"
          :key="index"
          class="relative rounded-lg border bg-muted p-4"
        >
          <div class="flex items-center justify-between">
            <code class="text-sm">{{ code }}</code>
            <ClipboardCopyButton
              :text="code"
              variant="ghost"
              size="sm"
            />
          </div>
        </div>
      </div>
    `,
  }),
}

export const InInputFields: Story = {
  render: () => ({
    components: { ClipboardCopy, CopyIdle, CopySuccess, Button, IconCopy, IconCheck },
    setup() {
      const apiKey = ref('sk_live_abc123xyz789def456ghi')
      const webhookUrl = ref('https://api.example.com/webhooks/xyz123')

      return { apiKey, webhookUrl }
    },
    template: `
      <div class="space-y-4 max-w-lg">
        <div class="space-y-2">
          <label class="text-sm font-medium">API Key</label>
          <div class="flex gap-2">
            <input
              v-model="apiKey"
              readonly
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <ClipboardCopy as-child :text="apiKey">
              <Button variant="outline" size="icon">
                <CopyIdle><IconCopy :size="16" /></CopyIdle>
                <CopySuccess><IconCheck :size="16" /></CopySuccess>
              </Button>
            </ClipboardCopy>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Webhook URL</label>
          <div class="flex gap-2">
            <input
              v-model="webhookUrl"
              readonly
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <ClipboardCopy as-child :text="webhookUrl">
              <Button variant="outline" size="icon">
                <CopyIdle><IconCopy :size="16" /></CopyIdle>
                <CopySuccess><IconCheck :size="16" /></CopySuccess>
              </Button>
            </ClipboardCopy>
          </div>
        </div>
      </div>
    `,
  }),
}

export const WithCallbacks: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    setup() {
      const messages = ref<string[]>([])

      const handleSuccess = () => {
        messages.value.unshift('✓ Successfully copied to clipboard!')
        setTimeout(() => {
          messages.value.pop()
        }, 3000)
      }

      const handleError = (error: Error) => {
        messages.value.unshift(`✗ Error: ${error.message}`)
        setTimeout(() => {
          messages.value.pop()
        }, 3000)
      }

      return { messages, handleSuccess, handleError }
    },
    template: `
      <div class="space-y-4">
        <ClipboardCopyButton
          text="Copy me and watch the log below"
          @success="handleSuccess"
          @error="handleError"
        />
        <div class="rounded-lg border p-4 min-h-[100px]">
          <div class="text-sm font-medium mb-2">Event Log:</div>
          <div class="space-y-1">
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="text-sm text-muted-foreground"
            >
              {{ message }}
            </div>
            <div v-if="messages.length === 0" class="text-sm text-muted-foreground italic">
              No events yet. Click the button above to copy.
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const MultipleInstancesWithSharedText: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    setup() {
      const sharedText = ref('Shared clipboard content across multiple buttons')
      return { sharedText }
    },
    template: `
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Shared Text:</label>
          <textarea
            v-model="sharedText"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <ClipboardCopyButton :text="sharedText" variant="default" />
          <ClipboardCopyButton :text="sharedText" variant="outline" />
          <ClipboardCopyButton :text="sharedText" variant="secondary" />
          <ClipboardCopyButton :text="sharedText" variant="ghost" />
        </div>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: { ClipboardCopyButton },
    setup() {
      const installations = [
        { title: 'npm', command: 'npm install @meldui/vue' },
        { title: 'pnpm', command: 'pnpm add @meldui/vue' },
        { title: 'yarn', command: 'yarn add @meldui/vue' },
        { title: 'bun', command: 'bun add @meldui/vue' },
      ]
      return { installations }
    },
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="install in installations"
          :key="install.title"
          class="rounded-lg border p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-semibold">{{ install.title }}</h3>
            <ClipboardCopyButton
              :text="install.command"
              variant="ghost"
              size="sm"
            />
          </div>
          <code class="text-sm text-muted-foreground">{{ install.command }}</code>
        </div>
      </div>
    `,
  }),
}
