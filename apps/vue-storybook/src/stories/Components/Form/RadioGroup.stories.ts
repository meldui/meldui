import {
  Button,
  Card,
  CardContent,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Form/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the radio group is disabled',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the radio group',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time. Built on reka-ui.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem },
    setup() {
      const value = ref('option1')
      return { value }
    },
    template: `
      <RadioGroup v-model="value">
        <div class="flex items-center gap-2">
          <RadioGroupItem id="option1" value="option1" />
          <Label for="option1" class="cursor-pointer font-normal">Option 1</Label>
        </div>
        <div class="flex items-center gap-2">
          <RadioGroupItem id="option2" value="option2" />
          <Label for="option2" class="cursor-pointer font-normal">Option 2</Label>
        </div>
        <div class="flex items-center gap-2">
          <RadioGroupItem id="option3" value="option3" />
          <Label for="option3" class="cursor-pointer font-normal">Option 3</Label>
        </div>
      </RadioGroup>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem },
    setup() {
      const notification = ref('all')
      return { notification }
    },
    template: `
      <div class="flex flex-col gap-3 max-w-sm">
        <Label>Notification Settings</Label>
        <RadioGroup v-model="notification">
          <div class="flex items-center gap-2">
            <RadioGroupItem id="all" value="all" />
            <Label for="all" class="cursor-pointer font-normal">All notifications</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="mentions" value="mentions" />
            <Label for="mentions" class="cursor-pointer font-normal">Mentions only</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="none" value="none" />
            <Label for="none" class="cursor-pointer font-normal">None</Label>
          </div>
        </RadioGroup>
      </div>
    `,
  }),
}

export const WithDescriptions: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem },
    setup() {
      const plan = ref('free')
      return { plan }
    },
    template: `
      <div class="flex flex-col gap-3 max-w-md">
        <Label>Choose your plan</Label>
        <RadioGroup v-model="plan">
          <div class="flex items-start gap-2">
            <RadioGroupItem id="free" value="free" class="mt-1" />
            <div class="flex flex-col gap-1">
              <Label for="free" class="cursor-pointer font-normal">Free</Label>
              <p class="text-xs text-muted-foreground">
                Perfect for trying out our service
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <RadioGroupItem id="pro" value="pro" class="mt-1" />
            <div class="flex flex-col gap-1">
              <Label for="pro" class="cursor-pointer font-normal">Pro ($9/month)</Label>
              <p class="text-xs text-muted-foreground">
                Ideal for individuals and small teams
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <RadioGroupItem id="enterprise" value="enterprise" class="mt-1" />
            <div class="flex flex-col gap-1">
              <Label for="enterprise" class="cursor-pointer font-normal">Enterprise (Custom)</Label>
              <p class="text-xs text-muted-foreground">
                Advanced features for large organizations
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Button, Label, RadioGroup, RadioGroupItem },
    setup() {
      const size = ref('medium')
      const reset = () => {
        size.value = 'medium'
      }
      return { size, reset }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <div class="flex flex-col gap-3">
          <Label>Size</Label>
          <RadioGroup v-model="size">
            <div class="flex items-center gap-2">
              <RadioGroupItem id="small" value="small" />
              <Label for="small" class="cursor-pointer font-normal">Small</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="medium" value="medium" />
              <Label for="medium" class="cursor-pointer font-normal">Medium</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="large" value="large" />
              <Label for="large" class="cursor-pointer font-normal">Large</Label>
            </div>
          </RadioGroup>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm text-muted-foreground">
            Selected: <span class="font-mono font-semibold">{{ size }}</span>
          </div>
          <Button size="sm" variant="outline" @click="reset">
            Reset
          </Button>
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem },
    setup() {
      const value = ref('option1')
      return { value }
    },
    template: `
      <div class="flex flex-col gap-3 max-w-sm">
        <Label>Disabled Radio Group</Label>
        <RadioGroup v-model="value" disabled>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="disabled1" value="option1" />
            <Label for="disabled1" class="cursor-pointer font-normal">Option 1</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="disabled2" value="option2" />
            <Label for="disabled2" class="cursor-pointer font-normal">Option 2</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="disabled3" value="option3" />
            <Label for="disabled3" class="cursor-pointer font-normal">Option 3</Label>
          </div>
        </RadioGroup>
      </div>
    `,
  }),
}

export const DisabledItem: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem },
    setup() {
      const value = ref('available1')
      return { value }
    },
    template: `
      <div class="flex flex-col gap-3 max-w-sm">
        <Label>Select an option (some disabled)</Label>
        <RadioGroup v-model="value">
          <div class="flex items-center gap-2">
            <RadioGroupItem id="available1" value="available1" />
            <Label for="available1" class="cursor-pointer font-normal">Available Option 1</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="unavailable" value="unavailable" disabled />
            <Label for="unavailable" class="cursor-not-allowed font-normal text-muted-foreground">
              Unavailable Option
            </Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="available2" value="available2" />
            <Label for="available2" class="cursor-pointer font-normal">Available Option 2</Label>
          </div>
        </RadioGroup>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="flex flex-col gap-3 max-w-sm">
        <Label for="payment-method">
          Payment Method
          <span class="text-destructive ml-1">*</span>
        </Label>
        <RadioGroup
          id="payment-method"
          v-model="value"
          aria-invalid="true"
          aria-describedby="payment-error"
        >
          <div class="flex items-center gap-2">
            <RadioGroupItem id="credit-card" value="credit-card" />
            <Label for="credit-card" class="cursor-pointer font-normal">Credit Card</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="paypal" value="paypal" />
            <Label for="paypal" class="cursor-pointer font-normal">PayPal</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="bank" value="bank" />
            <Label for="bank" class="cursor-pointer font-normal">Bank Transfer</Label>
          </div>
        </RadioGroup>
        <p id="payment-error" class="text-xs text-destructive">
          Please select a payment method
        </p>
      </div>
    `,
  }),
}

export const HorizontalLayout: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem },
    setup() {
      const alignment = ref('left')
      return { alignment }
    },
    template: `
      <div class="flex flex-col gap-3 max-w-md">
        <Label>Text Alignment</Label>
        <RadioGroup v-model="alignment" class="flex flex-row gap-4">
          <div class="flex items-center gap-2">
            <RadioGroupItem id="left" value="left" />
            <Label for="left" class="cursor-pointer font-normal">Left</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="center" value="center" />
            <Label for="center" class="cursor-pointer font-normal">Center</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="right" value="right" />
            <Label for="right" class="cursor-pointer font-normal">Right</Label>
          </div>
        </RadioGroup>
      </div>
    `,
  }),
}

export const CardStyle: Story = {
  render: () => ({
    components: { Card, CardContent, Label, RadioGroup, RadioGroupItem },
    setup() {
      const plan = ref('starter')
      return { plan }
    },
    template: `
      <div class="flex flex-col gap-3 max-w-2xl">
        <Label>Select your plan</Label>
        <RadioGroup v-model="plan" class="grid gap-4 md:grid-cols-3">
          <Label for="starter" class="cursor-pointer">
            <Card :class="plan === 'starter' ? 'border-primary' : ''">
              <CardContent class="flex items-start gap-3 p-4">
                <RadioGroupItem id="starter" value="starter" class="mt-1" />
                <div class="flex flex-col gap-1">
                  <div class="font-semibold">Starter</div>
                  <div class="text-2xl font-bold">$9<span class="text-sm font-normal text-muted-foreground">/mo</span></div>
                  <p class="text-xs text-muted-foreground">
                    Perfect for individuals
                  </p>
                </div>
              </CardContent>
            </Card>
          </Label>

          <Label for="professional" class="cursor-pointer">
            <Card :class="plan === 'professional' ? 'border-primary' : ''">
              <CardContent class="flex items-start gap-3 p-4">
                <RadioGroupItem id="professional" value="professional" class="mt-1" />
                <div class="flex flex-col gap-1">
                  <div class="font-semibold">Professional</div>
                  <div class="text-2xl font-bold">$29<span class="text-sm font-normal text-muted-foreground">/mo</span></div>
                  <p class="text-xs text-muted-foreground">
                    Great for small teams
                  </p>
                </div>
              </CardContent>
            </Card>
          </Label>

          <Label for="enterprise-plan" class="cursor-pointer">
            <Card :class="plan === 'enterprise' ? 'border-primary' : ''">
              <CardContent class="flex items-start gap-3 p-4">
                <RadioGroupItem id="enterprise-plan" value="enterprise" class="mt-1" />
                <div class="flex flex-col gap-1">
                  <div class="font-semibold">Enterprise</div>
                  <div class="text-2xl font-bold">Custom</div>
                  <p class="text-xs text-muted-foreground">
                    For large organizations
                  </p>
                </div>
              </CardContent>
            </Card>
          </Label>
        </RadioGroup>
      </div>
    `,
  }),
}

export const ShippingOptions: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem, Separator },
    setup() {
      const shipping = ref('standard')
      return { shipping }
    },
    template: `
      <div class="flex flex-col gap-3 max-w-md">
        <Label>Shipping Method</Label>
        <RadioGroup v-model="shipping">
          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-start gap-2">
              <RadioGroupItem id="standard" value="standard" class="mt-1" />
              <div class="flex flex-col gap-1">
                <Label for="standard" class="cursor-pointer font-normal">Standard Shipping</Label>
                <p class="text-xs text-muted-foreground">5-7 business days</p>
              </div>
            </div>
            <span class="text-sm font-medium">$5.00</span>
          </div>

          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-start gap-2">
              <RadioGroupItem id="express" value="express" class="mt-1" />
              <div class="flex flex-col gap-1">
                <Label for="express" class="cursor-pointer font-normal">Express Shipping</Label>
                <p class="text-xs text-muted-foreground">2-3 business days</p>
              </div>
            </div>
            <span class="text-sm font-medium">$15.00</span>
          </div>

          <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-start gap-2">
              <RadioGroupItem id="overnight" value="overnight" class="mt-1" />
              <div class="flex flex-col gap-1">
                <Label for="overnight" class="cursor-pointer font-normal">Overnight</Label>
                <p class="text-xs text-muted-foreground">Next business day</p>
              </div>
            </div>
            <span class="text-sm font-medium">$25.00</span>
          </div>
        </RadioGroup>
      </div>
    `,
  }),
}

export const FormIntegration: Story = {
  render: () => ({
    components: { Button, Label, RadioGroup, RadioGroupItem, Separator },
    setup() {
      const formData = ref({
        account: 'personal',
        visibility: 'public',
        license: '',
      })

      const errors = ref({
        license: '',
      })

      const handleSubmit = () => {
        errors.value.license = ''

        if (!formData.value.license) {
          errors.value.license = 'Please select a license'
          return
        }

        alert(JSON.stringify(formData.value, null, 2))
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-3">
          <Label>Account Type</Label>
          <RadioGroup v-model="formData.account">
            <div class="flex items-start gap-2">
              <RadioGroupItem id="personal" value="personal" class="mt-1" />
              <div class="flex flex-col gap-1">
                <Label for="personal" class="cursor-pointer font-normal">Personal</Label>
                <p class="text-xs text-muted-foreground">
                  For your personal projects
                </p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <RadioGroupItem id="organization" value="organization" class="mt-1" />
              <div class="flex flex-col gap-1">
                <Label for="organization" class="cursor-pointer font-normal">Organization</Label>
                <p class="text-xs text-muted-foreground">
                  For team collaboration
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div class="flex flex-col gap-3">
          <Label>Repository Visibility</Label>
          <RadioGroup v-model="formData.visibility" class="flex flex-row gap-4">
            <div class="flex items-center gap-2">
              <RadioGroupItem id="public" value="public" />
              <Label for="public" class="cursor-pointer font-normal">Public</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="private" value="private" />
              <Label for="private" class="cursor-pointer font-normal">Private</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div class="flex flex-col gap-3">
          <Label>
            License
            <span class="text-destructive ml-1">*</span>
          </Label>
          <RadioGroup
            v-model="formData.license"
            :aria-invalid="!!errors.license"
            :aria-describedby="errors.license ? 'license-error' : undefined"
          >
            <div class="flex items-center gap-2">
              <RadioGroupItem id="mit" value="mit" />
              <Label for="mit" class="cursor-pointer font-normal">MIT</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="apache" value="apache" />
              <Label for="apache" class="cursor-pointer font-normal">Apache 2.0</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="gpl" value="gpl" />
              <Label for="gpl" class="cursor-pointer font-normal">GPL 3.0</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="none-license" value="none" />
              <Label for="none-license" class="cursor-pointer font-normal">None</Label>
            </div>
          </RadioGroup>
          <p v-if="errors.license" id="license-error" class="text-xs text-destructive">
            {{ errors.license }}
          </p>
        </div>

        <Button type="submit">
          Create Repository
        </Button>
      </form>
    `,
  }),
}

export const SurveyQuestion: Story = {
  render: () => ({
    components: { Button, Label, RadioGroup, RadioGroupItem },
    setup() {
      const satisfaction = ref('')

      return { satisfaction }
    },
    template: `
      <div class="max-w-xl flex flex-col gap-6 p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Customer Satisfaction Survey</h3>
          <p class="text-sm text-muted-foreground">
            How satisfied are you with our service?
          </p>
        </div>

        <RadioGroup v-model="satisfaction">
          <div class="flex items-center gap-2">
            <RadioGroupItem id="very-satisfied" value="5" />
            <Label for="very-satisfied" class="cursor-pointer font-normal">
              Very Satisfied
            </Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="satisfied" value="4" />
            <Label for="satisfied" class="cursor-pointer font-normal">
              Satisfied
            </Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="neutral" value="3" />
            <Label for="neutral" class="cursor-pointer font-normal">
              Neutral
            </Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="dissatisfied" value="2" />
            <Label for="dissatisfied" class="cursor-pointer font-normal">
              Dissatisfied
            </Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="very-dissatisfied" value="1" />
            <Label for="very-dissatisfied" class="cursor-pointer font-normal">
              Very Dissatisfied
            </Label>
          </div>
        </RadioGroup>

        <Button class="w-full" :disabled="!satisfaction">
          Submit Feedback
        </Button>
      </div>
    `,
  }),
}
