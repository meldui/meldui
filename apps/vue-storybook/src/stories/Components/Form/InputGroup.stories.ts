import {
  IconArrowUp,
  IconCheck,
  IconCopy,
  IconInfoCircle,
  IconMail,
  IconPlus,
  IconSearch,
  IconUser,
  IconX,
} from '@meldui/tabler-vue'
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  Label,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof InputGroup> = {
  title: 'Components/Form/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A composite input component that allows grouping inputs with addons like icons, text, and buttons. Perfect for creating search bars, URL inputs, and other enhanced input fields.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      InputGroup,
      InputGroupAddon,
      InputGroupInput,
      InputGroupText,
    },
    template: `
      <InputGroup class="max-w-xs">
        <InputGroupAddon>
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Username" />
      </InputGroup>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: {
      IconMail,
      InputGroup,
      InputGroupAddon,
      InputGroupInput,
      InputGroupText,
    },
    template: `
      <InputGroup class="max-w-sm">
        <InputGroupAddon>
          <InputGroupText>
            <IconMail />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput type="email" placeholder="Email" />
      </InputGroup>
    `,
  }),
}

export const WithButton: Story = {
  render: () => ({
    components: {
      IconSearch,
      InputGroup,
      InputGroupAddon,
      InputGroupButton,
      InputGroupInput,
    },
    template: `
      <InputGroup class="max-w-sm">
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <IconSearch />
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    `,
  }),
}

export const SearchWithResults: Story = {
  render: () => ({
    components: {
      IconSearch,
      InputGroup,
      InputGroupAddon,
      InputGroupInput,
      InputGroupText,
    },
    template: `
      <InputGroup class="max-w-sm">
        <InputGroupAddon>
          <InputGroupText>
            <IconSearch />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupText>12 results</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    `,
  }),
}

export const URLWithTooltip: Story = {
  render: () => ({
    components: {
      IconInfoCircle,
      InputGroup,
      InputGroupAddon,
      InputGroupButton,
      InputGroupInput,
      InputGroupText,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    },
    template: `
      <TooltipProvider>
        <InputGroup class="max-w-md">
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger as-child>
                <InputGroupButton size="icon-xs" variant="ghost">
                  <IconInfoCircle />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter your website URL without the protocol</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </TooltipProvider>
    `,
  }),
}

export const CopyToClipboard: Story = {
  render: () => ({
    components: {
      IconCheck,
      IconCopy,
      InputGroup,
      InputGroupAddon,
      InputGroupButton,
      InputGroupInput,
    },
    setup() {
      const copied = ref(false)
      const url = ref('https://ui.shadcn.com/docs/components/input-group')

      const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText(url.value)
          copied.value = true
          setTimeout(() => {
            copied.value = false
          }, 2000)
        } catch (err) {
          console.error('Failed to copy:', err)
        }
      }

      return { copied, url, copyToClipboard }
    },
    template: `
      <InputGroup class="max-w-md">
        <InputGroupInput :model-value="url" readonly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" @click="copyToClipboard">
            <IconCheck v-if="copied" />
            <IconCopy v-else />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    `,
  }),
}

export const InteractiveSearch: Story = {
  render: () => ({
    components: {
      IconSearch,
      IconX,
      InputGroup,
      InputGroupAddon,
      InputGroupButton,
      InputGroupInput,
    },
    setup() {
      const search = ref('')
      const clearSearch = () => {
        search.value = ''
      }
      return { search, clearSearch }
    },
    template: `
      <InputGroup class="max-w-md">
        <InputGroupAddon>
          <InputGroupButton size="icon-xs">
            <IconSearch />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          v-model="search"
          type="search"
          placeholder="Search anything..."
        />
        <InputGroupAddon v-if="search" align="inline-end">
          <InputGroupButton size="icon-xs" variant="ghost" @click="clearSearch">
            <IconX />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    `,
  }),
}

export const PriceInput: Story = {
  render: () => ({
    components: {
      InputGroup,
      InputGroupAddon,
      InputGroupInput,
      InputGroupText,
      Label,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label for="price">Price</Label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="price"
            type="number"
            placeholder="0.00"
            step="0.01"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    `,
  }),
}

export const TextareaWithActions: Story = {
  render: () => ({
    components: {
      IconArrowUp,
      IconPlus,
      InputGroup,
      InputGroupAddon,
      InputGroupButton,
      InputGroupText,
      InputGroupTextarea,
      Separator,
    },
    setup() {
      const message = ref('')
      const maxChars = 500
      const usedPercentage = ref(0)

      const updateUsage = (value: string) => {
        usedPercentage.value = Math.round((value.length / maxChars) * 100)
      }

      return { message, usedPercentage, updateUsage }
    },
    template: `
      <InputGroup class="max-w-xl">
        <InputGroupTextarea
          v-model="message"
          @input="updateUsage(message)"
          placeholder="Ask, Search or Chat..."
          rows="4"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="icon-xs" variant="ghost">
            <IconPlus />
          </InputGroupButton>
          <InputGroupText class="ml-auto">{{ usedPercentage }}% used</InputGroupText>
          <Separator orientation="vertical" class="h-4" />
          <InputGroupButton
            size="icon-xs"
            variant="default"
            :disabled="!message"
          >
            <IconArrowUp />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    `,
  }),
}

export const BlockAlignments: Story = {
  render: () => ({
    components: {
      IconSearch,
      InputGroup,
      InputGroupAddon,
      InputGroupInput,
      InputGroupText,
      Label,
    },
    template: `
      <div class="flex flex-col gap-6 max-w-md">
        <div class="flex flex-col gap-2">
          <Label>Block Start Addon</Label>
          <InputGroup>
            <InputGroupAddon align="block-start">
              <InputGroupText>
                <IconSearch />
                Search Label
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="Enter search query" />
          </InputGroup>
        </div>

        <div class="flex flex-col gap-2">
          <Label>Block End Addon</Label>
          <InputGroup>
            <InputGroupInput placeholder="Enter your message" />
            <InputGroupAddon align="block-end">
              <InputGroupText>
                <IconSearch />
                Footer Information
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: {
      InputGroup,
      InputGroupAddon,
      InputGroupInput,
      InputGroupText,
      Label,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label for="username">Username</Label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="username"
            placeholder="username"
            aria-invalid="true"
            aria-describedby="username-error"
          />
        </InputGroup>
        <p id="username-error" class="text-xs text-destructive">
          Username is already taken
        </p>
      </div>
    `,
  }),
}

export const LoginForm: Story = {
  render: () => ({
    components: {
      Button,
      IconMail,
      IconUser,
      InputGroup,
      InputGroupAddon,
      InputGroupInput,
      InputGroupText,
      Label,
    },
    setup() {
      const formData = ref({
        email: '',
        password: '',
      })

      const handleSubmit = () => {
        alert(`Email: ${formData.value.email}\nPassword: ${formData.value.password}`)
      }

      return { formData, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="login-email">Email</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>
                <IconMail />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="login-email"
              v-model="formData.email"
              type="email"
              placeholder="email@example.com"
            />
          </InputGroup>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="login-password">Password</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>🔒</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="login-password"
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
            />
          </InputGroup>
        </div>

        <Button type="submit">
          Sign in
        </Button>
      </form>
    `,
  }),
}
