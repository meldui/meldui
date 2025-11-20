import {
  Button,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Field> = {
  title: 'Components/Form/Field',
  component: Field,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'responsive'],
      description: 'Field layout orientation',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A flexible field layout component for building forms. Supports vertical, horizontal, and responsive layouts with labels, descriptions, and error messages. Unlike Form component, this is purely for layout without validation logic.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const VerticalLayout: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldLabel, Input },
    setup() {
      const email = ref('')
      return { email }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="vertical">
          <FieldLabel>Email Address</FieldLabel>
          <FieldContent>
            <Input v-model="email" type="email" placeholder="you@example.com" />
            <FieldDescription>
              We'll never share your email with anyone else.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const HorizontalLayout: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldLabel, Input },
    setup() {
      const username = ref('')
      return { username }
    },
    template: `
      <div class="max-w-2xl">
        <Field orientation="horizontal">
          <FieldLabel>Username</FieldLabel>
          <FieldContent>
            <Input v-model="username" type="text" placeholder="johndoe" />
            <FieldDescription>
              Choose a unique username for your account.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const ResponsiveLayout: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldLabel, Input },
    setup() {
      const name = ref('')
      return { name }
    },
    template: `
      <div class="max-w-2xl">
        <Field orientation="responsive">
          <FieldLabel>Full Name</FieldLabel>
          <FieldContent>
            <Input v-model="name" type="text" placeholder="John Doe" />
            <FieldDescription>
              Switches to horizontal layout on larger screens.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input },
    setup() {
      const email = ref('invalid-email')
      const errors = ref(['Please enter a valid email address'])
      return { email, errors }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="vertical">
          <FieldLabel>Email Address</FieldLabel>
          <FieldContent>
            <Input v-model="email" type="email" aria-invalid="true" />
            <FieldDescription>
              Enter your email to receive notifications.
            </FieldDescription>
            <FieldError :errors="errors" />
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const WithMultipleErrors: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldError, FieldLabel, Input },
    setup() {
      const password = ref('123')
      const errors = ref([
        'Password must be at least 8 characters',
        'Password must contain at least one uppercase letter',
        'Password must contain at least one number',
      ])
      return { password, errors }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="vertical">
          <FieldLabel>Password</FieldLabel>
          <FieldContent>
            <Input v-model="password" type="password" aria-invalid="true" />
            <FieldError :errors="errors" />
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const WithTextarea: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldLabel, Textarea },
    setup() {
      const bio = ref('')
      return { bio }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="vertical">
          <FieldLabel>Bio</FieldLabel>
          <FieldContent>
            <Textarea v-model="bio" placeholder="Tell us about yourself..." />
            <FieldDescription>
              Write a brief description for your profile (max 200 characters).
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const WithSelect: Story = {
  render: () => ({
    components: {
      Field,
      FieldContent,
      FieldDescription,
      FieldLabel,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const country = ref('')
      return { country }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="vertical">
          <FieldLabel>Country</FieldLabel>
          <FieldContent>
            <Select v-model="country">
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Choose your country of residence.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const WithCheckbox: Story = {
  render: () => ({
    components: { Checkbox, Field, FieldContent, FieldDescription, FieldLabel },
    setup() {
      const agreed = ref(false)
      return { agreed }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="horizontal">
          <Checkbox v-model="agreed" id="terms" />
          <FieldLabel for="terms" class="cursor-pointer">
            <FieldContent>
              I agree to the terms and conditions
              <FieldDescription>
                You must accept the terms to continue.
              </FieldDescription>
            </FieldContent>
          </FieldLabel>
        </Field>
      </div>
    `,
  }),
}

export const WithSwitch: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldLabel, Switch },
    setup() {
      const enabled = ref(true)
      return { enabled }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="horizontal">
          <FieldLabel class="flex-1">
            <FieldContent>
              Email Notifications
              <FieldDescription>
                Receive email updates about your account activity.
              </FieldDescription>
            </FieldContent>
          </FieldLabel>
          <Switch v-model="enabled" />
        </Field>
      </div>
    `,
  }),
}

export const WithRadioGroup: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldLabel, RadioGroup, RadioGroupItem },
    setup() {
      const plan = ref('free')
      return { plan }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="vertical">
          <FieldLabel>Subscription Plan</FieldLabel>
          <FieldContent>
            <RadioGroup v-model="plan">
              <div class="flex items-center gap-2">
                <RadioGroupItem value="free" id="plan-free" />
                <FieldLabel for="plan-free" class="font-normal cursor-pointer">
                  Free - $0/month
                </FieldLabel>
              </div>
              <div class="flex items-center gap-2">
                <RadioGroupItem value="pro" id="plan-pro" />
                <FieldLabel for="plan-pro" class="font-normal cursor-pointer">
                  Pro - $19/month
                </FieldLabel>
              </div>
              <div class="flex items-center gap-2">
                <RadioGroupItem value="enterprise" id="plan-enterprise" />
                <FieldLabel for="plan-enterprise" class="font-normal cursor-pointer">
                  Enterprise - Contact us
                </FieldLabel>
              </div>
            </RadioGroup>
            <FieldDescription>
              Choose the plan that best fits your needs.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const FieldGroupExample: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, Input },
    setup() {
      const formData = ref({
        firstName: '',
        lastName: '',
        email: '',
      })
      return { formData }
    },
    template: `
      <div class="max-w-2xl">
        <FieldGroup>
          <Field orientation="vertical">
            <FieldLabel>First Name</FieldLabel>
            <FieldContent>
              <Input v-model="formData.firstName" type="text" />
            </FieldContent>
          </Field>

          <Field orientation="vertical">
            <FieldLabel>Last Name</FieldLabel>
            <FieldContent>
              <Input v-model="formData.lastName" type="text" />
            </FieldContent>
          </Field>

          <Field orientation="vertical">
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input v-model="formData.email" type="email" />
              <FieldDescription>
                We'll use this to contact you.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </div>
    `,
  }),
}

export const HorizontalFieldGroup: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, Input, Switch },
    setup() {
      const settings = ref({
        username: '',
        notifications: true,
        autoSave: false,
      })
      return { settings }
    },
    template: `
      <div class="max-w-2xl">
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel>Username</FieldLabel>
            <FieldContent>
              <Input v-model="settings.username" type="text" />
              <FieldDescription>
                Your unique identifier across the platform.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <FieldLabel class="flex-1">
              <FieldContent>
                Enable Notifications
                <FieldDescription>
                  Receive push notifications for important updates.
                </FieldDescription>
              </FieldContent>
            </FieldLabel>
            <Switch v-model="settings.notifications" />
          </Field>

          <Field orientation="horizontal">
            <FieldLabel class="flex-1">
              <FieldContent>
                Auto-save Changes
                <FieldDescription>
                  Automatically save your work as you type.
                </FieldDescription>
              </FieldContent>
            </FieldLabel>
            <Switch v-model="settings.autoSave" />
          </Field>
        </FieldGroup>
      </div>
    `,
  }),
}

export const ComplexForm: Story = {
  render: () => ({
    components: {
      Button,
      Checkbox,
      Field,
      FieldContent,
      FieldDescription,
      FieldError,
      FieldGroup,
      FieldLabel,
      Input,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Textarea,
    },
    setup() {
      const formData = ref({
        name: '',
        email: '',
        phone: '',
        country: '',
        message: '',
        newsletter: false,
      })

      const errors = ref<Record<string, string[]>>({})

      const validateForm = () => {
        errors.value = {}

        if (!formData.value.name) {
          errors.value.name = ['Name is required']
        }

        if (!formData.value.email) {
          errors.value.email = ['Email is required']
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
          errors.value.email = ['Please enter a valid email address']
        }

        if (!formData.value.message || formData.value.message.length < 10) {
          errors.value.message = ['Message must be at least 10 characters']
        }

        return Object.keys(errors.value).length === 0
      }

      const handleSubmit = () => {
        if (validateForm()) {
          alert(JSON.stringify(formData.value, null, 2))
        }
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <div class="max-w-2xl p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-2xl font-semibold">Contact Form</h2>
          <p class="text-sm text-muted-foreground">
            Fill out the form below and we'll get back to you soon.
          </p>
        </div>

        <FieldGroup>
          <Field orientation="vertical">
            <FieldLabel>Name</FieldLabel>
            <FieldContent>
              <Input v-model="formData.name" type="text" placeholder="John Doe" />
              <FieldError v-if="errors.name" :errors="errors.name" />
            </FieldContent>
          </Field>

          <div class="grid grid-cols-2 gap-4">
            <Field orientation="vertical">
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input v-model="formData.email" type="email" placeholder="you@example.com" />
                <FieldError v-if="errors.email" :errors="errors.email" />
              </FieldContent>
            </Field>

            <Field orientation="vertical">
              <FieldLabel>Phone (Optional)</FieldLabel>
              <FieldContent>
                <Input v-model="formData.phone" type="tel" placeholder="+1 (555) 000-0000" />
              </FieldContent>
            </Field>
          </div>

          <Field orientation="vertical">
            <FieldLabel>Country</FieldLabel>
            <FieldContent>
              <Select v-model="formData.country">
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Select your country of residence.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="vertical">
            <FieldLabel>Message</FieldLabel>
            <FieldContent>
              <Textarea
                v-model="formData.message"
                placeholder="How can we help you?"
                class="min-h-32"
              />
              <FieldDescription>
                Minimum 10 characters required.
              </FieldDescription>
              <FieldError v-if="errors.message" :errors="errors.message" />
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <Checkbox v-model="formData.newsletter" id="newsletter" />
            <FieldLabel for="newsletter" class="cursor-pointer">
              <FieldContent>
                Subscribe to newsletter
                <FieldDescription>
                  Receive updates about our products and services.
                </FieldDescription>
              </FieldContent>
            </FieldLabel>
          </Field>

          <div class="flex items-center gap-2 mt-4">
            <Button @click="handleSubmit">
              Submit
            </Button>
            <Button variant="outline" @click="formData = { name: '', email: '', phone: '', country: '', message: '', newsletter: false }; errors = {}">
              Reset
            </Button>
          </div>
        </FieldGroup>
      </div>
    `,
  }),
}

export const SettingsPanel: Story = {
  render: () => ({
    components: {
      Field,
      FieldContent,
      FieldDescription,
      FieldGroup,
      FieldLabel,
      Input,
      Switch,
    },
    setup() {
      const settings = ref({
        displayName: 'John Doe',
        email: 'john@example.com',
        notifications: true,
        marketing: false,
        autoUpdate: true,
        analytics: false,
      })
      return { settings }
    },
    template: `
      <div class="max-w-2xl p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-xl font-semibold">Settings</h2>
          <p class="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <FieldGroup>
          <div class="flex flex-col gap-2">
            <h3 class="font-medium">Profile</h3>
            <div class="flex flex-col gap-4 pl-4 border-l-2">
              <Field orientation="responsive">
                <FieldLabel>Display Name</FieldLabel>
                <FieldContent>
                  <Input v-model="settings.displayName" type="text" />
                  <FieldDescription>
                    This is your public display name.
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field orientation="responsive">
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <Input v-model="settings.email" type="email" />
                  <FieldDescription>
                    Your primary email address.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <h3 class="font-medium">Notifications</h3>
            <div class="flex flex-col gap-4 pl-4 border-l-2">
              <Field orientation="horizontal">
                <FieldLabel class="flex-1">
                  <FieldContent>
                    Push Notifications
                    <FieldDescription>
                      Receive push notifications on this device.
                    </FieldDescription>
                  </FieldContent>
                </FieldLabel>
                <Switch v-model="settings.notifications" />
              </Field>

              <Field orientation="horizontal">
                <FieldLabel class="flex-1">
                  <FieldContent>
                    Marketing Emails
                    <FieldDescription>
                      Receive emails about new products and features.
                    </FieldDescription>
                  </FieldContent>
                </FieldLabel>
                <Switch v-model="settings.marketing" />
              </Field>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <h3 class="font-medium">Advanced</h3>
            <div class="flex flex-col gap-4 pl-4 border-l-2">
              <Field orientation="horizontal">
                <FieldLabel class="flex-1">
                  <FieldContent>
                    Automatic Updates
                    <FieldDescription>
                      Automatically download and install updates.
                    </FieldDescription>
                  </FieldContent>
                </FieldLabel>
                <Switch v-model="settings.autoUpdate" />
              </Field>

              <Field orientation="horizontal">
                <FieldLabel class="flex-1">
                  <FieldContent>
                    Analytics
                    <FieldDescription>
                      Help us improve by sharing anonymous usage data.
                    </FieldDescription>
                  </FieldContent>
                </FieldLabel>
                <Switch v-model="settings.analytics" />
              </Field>
            </div>
          </div>
        </FieldGroup>
      </div>
    `,
  }),
}
