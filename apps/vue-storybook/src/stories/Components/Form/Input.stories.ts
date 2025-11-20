import { Button, Input, Label } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Input> = {
  title: 'Components/Form/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'],
      description: 'The type of input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    modelValue: {
      control: 'text',
      description: 'The controlled value of the input',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A text input component for capturing user text input. Supports all standard HTML input types and attributes.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Input },
    template: '<Input placeholder="Enter text..." />',
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="email@example.com" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Input },
    template: '<Input placeholder="Disabled input" disabled />',
  }),
}

export const WithValue: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('Hello World')
      return { value }
    },
    template: '<Input v-model="value" />',
  }),
}

export const InputTypes: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-6 max-w-md">
        <div class="flex flex-col gap-2">
          <Label for="text">Text</Label>
          <Input id="text" type="text" placeholder="Enter text" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="email@example.com" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter password" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="number">Number</Label>
          <Input id="number" type="number" placeholder="Enter number" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="tel">Phone</Label>
          <Input id="tel" type="tel" placeholder="+1 (555) 000-0000" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="url">URL</Label>
          <Input id="url" type="url" placeholder="https://example.com" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="search">Search</Label>
          <Input id="search" type="search" placeholder="Search..." />
        </div>
      </div>
    `,
  }),
}

export const WithHelperText: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label for="username">Username</Label>
        <Input id="username" placeholder="johndoe" />
        <p class="text-xs text-muted-foreground">
          Choose a unique username for your account.
        </p>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: { Input, Label },
    setup() {
      const email = ref('')
      return { email }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label for="error-email">Email</Label>
        <Input
          id="error-email"
          v-model="email"
          type="email"
          placeholder="email@example.com"
          aria-invalid="true"
          aria-describedby="error-message"
        />
        <p id="error-message" class="text-xs text-destructive">
          Please enter a valid email address.
        </p>
      </div>
    `,
  }),
}

export const FileInput: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="file">Choose file</Label>
        <Input id="file" type="file" />
      </div>
    `,
  }),
}

export const LoginForm: Story = {
  render: () => ({
    components: { Button, Input, Label },
    setup() {
      const formData = ref({
        email: '',
        password: '',
      })

      const errors = ref({
        email: '',
        password: '',
      })

      const handleSubmit = () => {
        errors.value = { email: '', password: '' }

        if (!formData.value.email) {
          errors.value.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
          errors.value.email = 'Please enter a valid email'
        }

        if (!formData.value.password) {
          errors.value.password = 'Password is required'
        } else if (formData.value.password.length < 8) {
          errors.value.password = 'Password must be at least 8 characters'
        }

        if (!errors.value.email && !errors.value.password) {
          alert('Login successful!')
        }
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="login-email">Email</Label>
          <Input
            id="login-email"
            v-model="formData.email"
            type="email"
            placeholder="email@example.com"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'email-error' : undefined"
          />
          <p v-if="errors.email" id="email-error" class="text-xs text-destructive">
            {{ errors.email }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="login-password">Password</Label>
          <Input
            id="login-password"
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            :aria-invalid="!!errors.password"
            :aria-describedby="errors.password ? 'password-error' : undefined"
          />
          <p v-if="errors.password" id="password-error" class="text-xs text-destructive">
            {{ errors.password }}
          </p>
        </div>

        <Button type="submit">
          Sign in
        </Button>
      </form>
    `,
  }),
}

export const DateTimeInputs: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-6 max-w-md">
        <div class="flex flex-col gap-2">
          <Label for="date">Date</Label>
          <Input id="date" type="date" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="time">Time</Label>
          <Input id="time" type="time" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="datetime">Date & Time</Label>
          <Input id="datetime" type="datetime-local" />
        </div>
      </div>
    `,
  }),
}
