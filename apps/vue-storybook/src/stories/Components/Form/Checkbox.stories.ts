import { Button, Checkbox, Label } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'The controlled checked state of the checkbox',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The default checked state when uncontrolled',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
    },
    name: {
      control: 'text',
      description: 'The name attribute of the checkbox input',
    },
    value: {
      control: 'text',
      description: 'The value attribute of the checkbox input',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A checkbox component that allows users to select one or more items from a set. Built on reka-ui with custom styling.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Checkbox },
    template: '<Checkbox />',
  }),
}

export const Checked: Story = {
  render: () => ({
    components: { Checkbox },
    template: '<Checkbox :default-checked="true" />',
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <div class="flex gap-4 items-center">
        <Checkbox disabled />
        <Checkbox disabled :default-checked="true" />
      </div>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Checkbox, Label },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <div class="flex items-center gap-2">
        <Checkbox id="terms" v-model:checked="checked" />
        <Label for="terms" class="cursor-pointer text-sm font-medium">
          Accept terms and conditions
        </Label>
      </div>
    `,
  }),
}

export const Multiple: Story = {
  render: () => ({
    components: { Checkbox, Label },
    setup() {
      const items = ref([
        { id: 'item1', label: 'Subscribe to newsletter', checked: false },
        { id: 'item2', label: 'Send me promotional emails', checked: true },
        { id: 'item3', label: 'Enable notifications', checked: false },
      ])
      return { items }
    },
    template: `
      <div class="flex flex-col gap-4">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center gap-2"
        >
          <Checkbox :id="item.id" v-model:checked="item.checked" />
          <Label :for="item.id" class="cursor-pointer text-sm font-normal">
            {{ item.label }}
          </Label>
        </div>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: { Checkbox, Label },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="required" v-model:checked="checked" aria-invalid="true" />
          <Label for="required" class="cursor-pointer text-sm font-medium">
            I agree to the terms *
          </Label>
        </div>
        <p class="text-xs text-destructive">
          You must accept the terms and conditions
        </p>
      </div>
    `,
  }),
}

export const InForm: Story = {
  render: () => ({
    components: { Button, Checkbox, Label },
    setup() {
      const preferences = ref({
        marketing: false,
        social: false,
        security: true,
      })

      const handleSubmit = () => {
        alert(JSON.stringify(preferences.value, null, 2))
      }

      return { preferences, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md">
        <fieldset class="border-none p-0 m-0">
          <legend class="text-base font-semibold mb-4">
            Email Preferences
          </legend>
          <div class="flex flex-col gap-4">
            <div class="flex items-start gap-2">
              <Checkbox
                id="marketing"
                v-model:checked="preferences.marketing"
                name="marketing"
              />
              <div class="flex flex-col gap-1">
                <Label for="marketing" class="cursor-pointer text-sm font-medium">
                  Marketing emails
                </Label>
                <p class="text-xs text-muted-foreground">
                  Receive emails about new products and features
                </p>
              </div>
            </div>

            <div class="flex items-start gap-2">
              <Checkbox
                id="social"
                v-model:checked="preferences.social"
                name="social"
              />
              <div class="flex flex-col gap-1">
                <Label for="social" class="cursor-pointer text-sm font-medium">
                  Social emails
                </Label>
                <p class="text-xs text-muted-foreground">
                  Receive emails for friend requests and follows
                </p>
              </div>
            </div>

            <div class="flex items-start gap-2">
              <Checkbox
                id="security"
                v-model:checked="preferences.security"
                name="security"
              />
              <div class="flex flex-col gap-1">
                <Label for="security" class="cursor-pointer text-sm font-medium">
                  Security emails
                </Label>
                <p class="text-xs text-muted-foreground">
                  Receive emails about account security
                </p>
              </div>
            </div>
          </div>
        </fieldset>

        <Button type="submit" class="mt-6">
          Save preferences
        </Button>
      </form>
    `,
  }),
}
