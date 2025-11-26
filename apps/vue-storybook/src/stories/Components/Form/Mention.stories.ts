import { IconAt, IconHash, IconSlash, IconUser } from '@meldui/tabler-vue'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Mention,
  MentionContent,
  MentionEmpty,
  MentionInput,
  MentionItem,
  MentionLabel,
  MentionLoading,
  MentionPortal,
  Spinner,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'

const meta: Meta<typeof Mention> = {
  title: 'Components/Form/Mention',
  component: Mention,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Serialized value with mention markers',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all interactions',
    },
    readonly: {
      control: 'boolean',
      description: 'Read-only mode',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    multiline: {
      control: 'boolean',
      description: 'Use textarea instead of input',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A composable mention component that allows users to trigger and select items from a dropdown by typing trigger characters (like @, #, /).

## Features
- Inline mention tag rendering using overlay technique
- Multiple configurable trigger characters
- Keyboard navigation (Arrow keys, Enter, Escape)
- Async loading support
- Heavily customizable item rendering via slots
- Accessible with ARIA attributes

## Components
- \`Mention\` - Root component managing state
- \`MentionInput\` - Text input with trigger detection
- \`MentionPortal\` - Teleports popover outside DOM
- \`MentionContent\` - Positioned popover container
- \`MentionItem\` - Individual selectable item
- \`MentionEmpty\` - Shown when no matches
- \`MentionLoading\` - Loading state indicator
- \`MentionLabel\` - Accessible label

## Serialization Format
Mentions are serialized as: \`@[value:label]\`
Example: \`Hello @[user:123:John Doe] how are you?\`
`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample data
const users = [
  {
    value: 'user:1',
    label: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=john',
    role: 'Engineer',
  },
  {
    value: 'user:2',
    label: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    role: 'Designer',
  },
  {
    value: 'user:3',
    label: 'Bob Wilson',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    role: 'Product Manager',
  },
  {
    value: 'user:4',
    label: 'Alice Brown',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    role: 'Developer',
  },
  {
    value: 'user:5',
    label: 'Charlie Davis',
    avatar: 'https://i.pravatar.cc/150?u=charlie',
    role: 'QA Engineer',
  },
]

export const Default: Story = {
  render: () => ({
    components: {
      Mention,
      MentionInput,
      MentionPortal,
      MentionContent,
      MentionItem,
      MentionEmpty,
      IconAt,
    },
    setup() {
      const value = ref('')
      const searchQuery = ref('')

      const filteredUsers = computed(() => {
        if (!searchQuery.value) return users
        const query = searchQuery.value.toLowerCase()
        return users.filter((user) => user.label.toLowerCase().includes(query))
      })

      const handleSearch = (_trigger: string, query: string) => {
        searchQuery.value = query
      }

      return { value, filteredUsers, handleSearch }
    },
    template: `
      <div class="w-full max-w-md">
        <Mention v-model="value" placeholder="Type @ to mention someone..." @search="handleSearch">
          <MentionInput
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          />

          <MentionPortal>
            <MentionContent
              :items="filteredUsers"
              class="w-64 p-1"
            >
              <MentionEmpty class="px-3 py-6 text-center text-sm text-muted-foreground">
                No users found
              </MentionEmpty>

              <MentionItem
                v-for="user in filteredUsers"
                :key="user.value"
                :item="user"
                class="flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer"
              >
                <IconAt :size="16" class="text-muted-foreground" />
                <span>{{ user.label }}</span>
              </MentionItem>
            </MentionContent>
          </MentionPortal>
        </Mention>

        <p class="mt-4 text-xs text-muted-foreground">
          Serialized value: <code class="bg-muted px-1 py-0.5 rounded">{{ value || '(empty)' }}</code>
        </p>
      </div>
    `,
  }),
}

export const WithAvatars: Story = {
  render: () => ({
    components: {
      Mention,
      MentionInput,
      MentionPortal,
      MentionContent,
      MentionItem,
      MentionEmpty,
      Avatar,
      AvatarImage,
      AvatarFallback,
    },
    setup() {
      const value = ref('')
      const searchQuery = ref('')

      const filteredUsers = computed(() => {
        if (!searchQuery.value) return users
        const query = searchQuery.value.toLowerCase()
        return users.filter((user) => user.label.toLowerCase().includes(query))
      })

      const handleSearch = (_trigger: string, query: string) => {
        searchQuery.value = query
      }

      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      }

      return { value, filteredUsers, handleSearch, getInitials }
    },
    template: `
      <div class="w-full max-w-md">
        <Mention v-model="value" placeholder="Type @ to mention a team member..." @search="handleSearch">
          <MentionInput
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          />

          <MentionPortal>
            <MentionContent
              :items="filteredUsers"
              class="w-72 p-1"
            >
              <MentionEmpty class="px-3 py-6 text-center text-sm text-muted-foreground">
                No users found
              </MentionEmpty>

              <MentionItem
                v-for="user in filteredUsers"
                :key="user.value"
                :item="user"
                v-slot="{ item, highlighted }"
                class="flex items-center gap-3 px-2 py-2 rounded-sm cursor-pointer"
              >
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="item.avatar" :alt="item.label" />
                  <AvatarFallback>{{ getInitials(item.label) }}</AvatarFallback>
                </Avatar>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ item.label }}</div>
                  <div class="text-xs text-muted-foreground">{{ item.role }}</div>
                </div>
              </MentionItem>
            </MentionContent>
          </MentionPortal>
        </Mention>

        <p class="mt-4 text-xs text-muted-foreground">
          Serialized value: <code class="bg-muted px-1 py-0.5 rounded">{{ value || '(empty)' }}</code>
        </p>
      </div>
    `,
  }),
}

export const MultipleTriggers: Story = {
  render: () => ({
    components: {
      Mention,
      MentionInput,
      MentionPortal,
      MentionContent,
      MentionItem,
      MentionEmpty,
      IconAt,
      IconHash,
      IconSlash,
    },
    setup() {
      const value = ref('')
      const searchQuery = ref('')
      const activeTrigger = ref<string | null>(null)

      const channels = [
        {
          value: 'channel:1',
          label: 'general',
          description: 'General discussion',
        },
        { value: 'channel:2', label: 'random', description: 'Random stuff' },
        {
          value: 'channel:3',
          label: 'engineering',
          description: 'Engineering team',
        },
        { value: 'channel:4', label: 'design', description: 'Design team' },
      ]

      const commands = [
        { value: 'cmd:giphy', label: 'giphy', description: 'Search for GIFs' },
        { value: 'cmd:remind', label: 'remind', description: 'Set a reminder' },
        { value: 'cmd:poll', label: 'poll', description: 'Create a poll' },
      ]

      const items = computed(() => {
        let source: typeof users | typeof channels | typeof commands = []

        if (activeTrigger.value === '@') source = users
        else if (activeTrigger.value === '#') source = channels
        else if (activeTrigger.value === '/') source = commands

        if (!searchQuery.value) return source

        const query = searchQuery.value.toLowerCase()
        return source.filter((item) => item.label.toLowerCase().includes(query))
      })

      const handleOpen = (trigger: string) => {
        activeTrigger.value = trigger
      }

      const handleClose = () => {
        activeTrigger.value = null
        searchQuery.value = ''
      }

      const handleSearch = (_trigger: string, query: string) => {
        searchQuery.value = query
      }

      const getTriggerIcon = () => {
        if (activeTrigger.value === '@') return IconAt
        if (activeTrigger.value === '#') return IconHash
        if (activeTrigger.value === '/') return IconSlash
        return IconAt
      }

      return {
        value,
        items,
        activeTrigger,
        handleOpen,
        handleClose,
        handleSearch,
        getTriggerIcon,
      }
    },
    template: `
      <div class="w-full max-w-md">
        <Mention
          v-model="value"
          :triggers="[
            { char: '@' },
            { char: '#' },
            { char: '/' }
          ]"
          placeholder="Type @user, #channel, or /command..."
          @open="handleOpen"
          @close="handleClose"
          @search="handleSearch"
        >
          <MentionInput
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          />

          <MentionPortal>
            <MentionContent
              :items="items"
              class="w-72 p-1"
            >
              <div v-if="activeTrigger" class="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
                <span v-if="activeTrigger === '@'">Users</span>
                <span v-else-if="activeTrigger === '#'">Channels</span>
                <span v-else-if="activeTrigger === '/'">Commands</span>
              </div>

              <MentionEmpty class="px-3 py-6 text-center text-sm text-muted-foreground">
                No results found
              </MentionEmpty>

              <MentionItem
                v-for="item in items"
                :key="item.value"
                :item="item"
                v-slot="{ item: data }"
                class="flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer"
              >
                <component :is="getTriggerIcon()" :size="16" class="text-muted-foreground flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <span class="text-sm">{{ data.label }}</span>
                  <span v-if="data.description" class="text-xs text-muted-foreground ml-2">
                    {{ data.description }}
                  </span>
                </div>
              </MentionItem>
            </MentionContent>
          </MentionPortal>
        </Mention>

        <p class="mt-4 text-xs text-muted-foreground">
          Serialized value: <code class="bg-muted px-1 py-0.5 rounded">{{ value || '(empty)' }}</code>
        </p>
      </div>
    `,
  }),
}

export const Multiline: Story = {
  render: () => ({
    components: {
      Mention,
      MentionInput,
      MentionPortal,
      MentionContent,
      MentionItem,
      MentionEmpty,
    },
    setup() {
      const value = ref('')
      const searchQuery = ref('')

      const filteredUsers = computed(() => {
        if (!searchQuery.value) return users
        const query = searchQuery.value.toLowerCase()
        return users.filter((user) => user.label.toLowerCase().includes(query))
      })

      const handleSearch = (_trigger: string, query: string) => {
        searchQuery.value = query
      }

      return { value, filteredUsers, handleSearch }
    },
    template: `
      <div class="w-full max-w-md">
        <Mention
          v-model="value"
          multiline
          placeholder="Write a message... Use @ to mention"
          @search="handleSearch"
        >
          <MentionInput
            class="w-full min-h-[120px] px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          />

          <MentionPortal>
            <MentionContent
              :items="filteredUsers"
              class="w-64 p-1"
            >
              <MentionEmpty class="px-3 py-6 text-center text-sm text-muted-foreground">
                No users found
              </MentionEmpty>

              <MentionItem
                v-for="user in filteredUsers"
                :key="user.value"
                :item="user"
              >
                {{ user.label }}
              </MentionItem>
            </MentionContent>
          </MentionPortal>
        </Mention>

        <p class="mt-4 text-xs text-muted-foreground">
          Serialized value: <code class="bg-muted px-1 py-0.5 rounded whitespace-pre-wrap">{{ value || '(empty)' }}</code>
        </p>
      </div>
    `,
  }),
}

export const AsyncLoading: Story = {
  render: () => ({
    components: {
      Mention,
      MentionInput,
      MentionPortal,
      MentionContent,
      MentionItem,
      MentionEmpty,
      MentionLoading,
      Spinner,
    },
    setup() {
      const value = ref('')
      const items = ref<typeof users>([])
      const loading = ref(false)

      const handleSearch = async (_trigger: string, query: string) => {
        if (query.length < 2) {
          items.value = []
          return
        }

        loading.value = true

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        const queryLower = query.toLowerCase()
        items.value = users.filter((user) => user.label.toLowerCase().includes(queryLower))

        loading.value = false
      }

      return { value, items, loading, handleSearch }
    },
    template: `
      <div class="w-full max-w-md">
        <Mention v-model="value" placeholder="Type @ and at least 2 characters to search..." @search="handleSearch">
          <MentionInput
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          />

          <MentionPortal>
            <MentionContent
              :items="items"
              :loading="loading"
              class="w-64 p-1"
            >
              <MentionLoading class="flex items-center justify-center gap-2 px-3 py-6">
                <Spinner size="sm" />
                <span class="text-sm text-muted-foreground">Searching...</span>
              </MentionLoading>

              <MentionEmpty class="px-3 py-6 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </MentionEmpty>

              <MentionItem
                v-for="user in items"
                :key="user.value"
                :item="user"
              >
                {{ user.label }}
              </MentionItem>
            </MentionContent>
          </MentionPortal>
        </Mention>
      </div>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: {
      Mention,
      MentionInput,
      MentionPortal,
      MentionContent,
      MentionItem,
      MentionEmpty,
      MentionLabel,
    },
    setup() {
      const value = ref('')
      const searchQuery = ref('')

      const filteredUsers = computed(() => {
        if (!searchQuery.value) return users
        const query = searchQuery.value.toLowerCase()
        return users.filter((user) => user.label.toLowerCase().includes(query))
      })

      const handleSearch = (_trigger: string, query: string) => {
        searchQuery.value = query
      }

      return { value, filteredUsers, handleSearch }
    },
    template: `
      <div class="w-full max-w-md space-y-2">
        <Mention v-model="value" @search="handleSearch">
          <MentionLabel class="text-sm font-medium">
            Assignees
          </MentionLabel>

          <MentionInput
            placeholder="Type @ to assign someone..."
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 mt-1.5"
          />

          <MentionPortal>
            <MentionContent
              :items="filteredUsers"
              class="w-64 p-1"
            >
              <MentionEmpty class="px-3 py-6 text-center text-sm text-muted-foreground">
                No users found
              </MentionEmpty>

              <MentionItem
                v-for="user in filteredUsers"
                :key="user.value"
                :item="user"
              >
                {{ user.label }}
              </MentionItem>
            </MentionContent>
          </MentionPortal>
        </Mention>

        <p class="text-xs text-muted-foreground">
          Use @ to mention team members who will be assigned to this task.
        </p>
      </div>
    `,
  }),
}

export const CustomStyling: Story = {
  render: () => ({
    components: {
      Mention,
      MentionInput,
      MentionPortal,
      MentionContent,
      MentionItem,
      MentionEmpty,
      IconUser,
    },
    setup() {
      const value = ref('')
      const searchQuery = ref('')

      const filteredUsers = computed(() => {
        if (!searchQuery.value) return users
        const query = searchQuery.value.toLowerCase()
        return users.filter((user) => user.label.toLowerCase().includes(query))
      })

      const handleSearch = (_trigger: string, query: string) => {
        searchQuery.value = query
      }

      return { value, filteredUsers, handleSearch }
    },
    template: `
      <div class="w-full max-w-md">
        <Mention v-model="value" placeholder="Type @ to mention someone..." @search="handleSearch">
          <MentionInput
            class="w-full px-4 py-3 border-2 border-info/20 rounded-xl bg-background text-sm ring-offset-background focus-within:outline-none focus-within:border-info/50 transition-colors"
            tag-class="bg-success/30 rounded-full px-0 py-0.5"
          />

          <MentionPortal>
            <MentionContent
              :items="filteredUsers"
              class="w-64 p-2 rounded-xl shadow-xl border-2"
            >
              <MentionEmpty class="px-3 py-6 text-center text-sm text-muted-foreground">
                No users found
              </MentionEmpty>

              <MentionItem
                v-for="user in filteredUsers"
                :key="user.value"
                :item="user"
                v-slot="{ highlighted }"
                class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                :class="highlighted ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="highlighted ? 'bg-primary-foreground/20' : 'bg-primary/10'"
                >
                  <IconUser :size="16" :class="highlighted ? 'text-primary-foreground' : 'text-primary'" />
                </div>
                <span class="font-medium">{{ user.label }}</span>
              </MentionItem>
            </MentionContent>
          </MentionPortal>
        </Mention>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: {
      Mention,
      MentionInput,
    },
    setup() {
      const value = ref('Hello @[user:1:John Doe] this is a disabled input')
      return { value }
    },
    template: `
      <div class="w-full max-w-md">
        <Mention v-model="value" disabled placeholder="This input is disabled">
          <MentionInput
            class="w-full px-3 py-2 border border-input rounded-md bg-muted text-sm opacity-50 cursor-not-allowed"
          />
        </Mention>
      </div>
    `,
  }),
}

export const EventHandling: Story = {
  parameters: {
    docs: {
      description: {
        story: `Demonstrates all events emitted by the Mention component:
- \`update:modelValue\` - Fired when the serialized value changes
- \`open\` - Fired when the popover opens (trigger detected)
- \`close\` - Fired when the popover closes
- \`search\` - Fired when the search query changes
- \`select\` - Fired when an item is selected
- \`remove\` - Fired when a mention is removed`,
      },
    },
  },
  render: () => ({
    components: {
      Mention,
      MentionInput,
      MentionPortal,
      MentionContent,
      MentionItem,
      MentionEmpty,
    },
    setup() {
      const value = ref('')
      const searchQuery = ref('')
      const eventLog = ref<Array<{ type: string; message: string; time: string }>>([])

      const filteredUsers = computed(() => {
        if (!searchQuery.value) return users
        const query = searchQuery.value.toLowerCase()
        return users.filter((user) => user.label.toLowerCase().includes(query))
      })

      const logEvent = (type: string, message: string) => {
        const time = new Date().toLocaleTimeString()
        eventLog.value.unshift({ type, message, time })
        if (eventLog.value.length > 10) {
          eventLog.value.pop()
        }
      }

      const handleOpen = (trigger: string, query: string) => {
        logEvent('open', `Trigger: "${trigger}", Query: "${query}"`)
      }

      const handleClose = () => {
        logEvent('close', 'Popover closed')
      }

      const handleSearch = (trigger: string, query: string) => {
        searchQuery.value = query
        logEvent('search', `Trigger: "${trigger}", Query: "${query}"`)
      }

      const handleSelect = (item: (typeof users)[0], trigger: string) => {
        logEvent('select', `Item: "${item.label}", Trigger: "${trigger}"`)
      }

      const handleRemove = (mention: { value: string; label: string }) => {
        logEvent('remove', `Removed: "${mention.label}" (${mention.value})`)
      }

      const clearLog = () => {
        eventLog.value = []
      }

      return {
        value,
        filteredUsers,
        eventLog,
        handleOpen,
        handleClose,
        handleSearch,
        handleSelect,
        handleRemove,
        clearLog,
      }
    },
    template: `
      <div class="flex gap-6 w-full max-w-4xl">
        <div class="flex-1">
          <Mention
            v-model="value"
            placeholder="Type @ to mention someone..."
            @open="handleOpen"
            @close="handleClose"
            @search="handleSearch"
            @select="handleSelect"
            @remove="handleRemove"
          >
            <MentionInput
              class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            />

            <MentionPortal>
              <MentionContent
                :items="filteredUsers"
                class="w-64 p-1"
              >
                <MentionEmpty class="px-3 py-6 text-center text-sm text-muted-foreground">
                  No users found
                </MentionEmpty>

                <MentionItem
                  v-for="user in filteredUsers"
                  :key="user.value"
                  :item="user"
                >
                  {{ user.label }}
                </MentionItem>
              </MentionContent>
            </MentionPortal>
          </Mention>

          <p class="mt-4 text-xs text-muted-foreground">
            Serialized value: <code class="bg-muted px-1 py-0.5 rounded">{{ value || '(empty)' }}</code>
          </p>
        </div>

        <div class="flex-1 border border-border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
            <span class="text-sm font-medium">Event Log</span>
            <button
              class="text-xs text-muted-foreground hover:text-foreground"
              @click="clearLog"
            >
              Clear
            </button>
          </div>
          <div class="p-3 h-64 overflow-y-auto">
            <div v-if="eventLog.length === 0" class="text-sm text-muted-foreground text-center py-8">
              Interact with the input to see events
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(event, index) in eventLog"
                :key="index"
                class="text-xs p-2 rounded bg-muted/50"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="px-1.5 py-0.5 rounded font-mono text-[10px]"
                    :class="{
                      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': event.type === 'open',
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': event.type === 'close',
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': event.type === 'search',
                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': event.type === 'select',
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': event.type === 'remove',
                    }"
                  >
                    {{ event.type }}
                  </span>
                  <span class="text-muted-foreground">{{ event.time }}</span>
                </div>
                <p class="text-muted-foreground">{{ event.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}
