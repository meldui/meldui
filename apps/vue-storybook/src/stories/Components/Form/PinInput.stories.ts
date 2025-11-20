import {
  Button,
  Label,
  PinInput,
  PinInputGroup,
  PinInputSeparator,
  PinInputSlot,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof PinInput> = {
  title: 'Components/Form/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  argTypes: {
    otp: {
      control: 'boolean',
      description: 'Whether the input is in OTP (One-Time Password) mode',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    type: {
      control: 'select',
      options: ['text', 'number'],
      description: 'The type of input',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A pin input component for entering a sequence of digits or characters, commonly used for OTP codes, PIN codes, and verification codes. Built on reka-ui.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    template: `
      <PinInput class="max-w-xs">
        <PinInputGroup>
          <PinInputSlot :index="0" />
          <PinInputSlot :index="1" />
          <PinInputSlot :index="2" />
          <PinInputSlot :index="3" />
        </PinInputGroup>
      </PinInput>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: {
      Label,
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label>Enter PIN</Label>
        <PinInput>
          <PinInputGroup>
            <PinInputSlot :index="0" />
            <PinInputSlot :index="1" />
            <PinInputSlot :index="2" />
            <PinInputSlot :index="3" />
          </PinInputGroup>
        </PinInput>
      </div>
    `,
  }),
}

export const WithSeparator: Story = {
  render: () => ({
    components: {
      Label,
      PinInput,
      PinInputGroup,
      PinInputSeparator,
      PinInputSlot,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label>Verification Code</Label>
        <PinInput>
          <PinInputGroup>
            <PinInputSlot :index="0" />
            <PinInputSlot :index="1" />
            <PinInputSlot :index="2" />
          </PinInputGroup>
          <PinInputSeparator />
          <PinInputGroup>
            <PinInputSlot :index="3" />
            <PinInputSlot :index="4" />
            <PinInputSlot :index="5" />
          </PinInputGroup>
        </PinInput>
      </div>
    `,
  }),
}

export const SixDigits: Story = {
  render: () => ({
    components: {
      Label,
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>6-Digit Code</Label>
        <PinInput>
          <PinInputGroup>
            <PinInputSlot :index="0" />
            <PinInputSlot :index="1" />
            <PinInputSlot :index="2" />
            <PinInputSlot :index="3" />
            <PinInputSlot :index="4" />
            <PinInputSlot :index="5" />
          </PinInputGroup>
        </PinInput>
        <p class="text-xs text-muted-foreground">
          Enter the 6-digit code sent to your device
        </p>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    setup() {
      const value = ref<string[]>([])
      const reset = () => {
        value.value = []
      }
      return { value, reset }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <div class="flex flex-col gap-2">
          <Label>Controlled PIN Input</Label>
          <PinInput v-model="value">
            <PinInputGroup>
              <PinInputSlot :index="0" />
              <PinInputSlot :index="1" />
              <PinInputSlot :index="2" />
              <PinInputSlot :index="3" />
            </PinInputGroup>
          </PinInput>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm text-muted-foreground">
            Value: <span class="font-mono font-semibold">{{ value.join('') || 'empty' }}</span>
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
    components: {
      Label,
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label>Disabled PIN Input</Label>
        <PinInput disabled>
          <PinInputGroup>
            <PinInputSlot :index="0" />
            <PinInputSlot :index="1" />
            <PinInputSlot :index="2" />
            <PinInputSlot :index="3" />
          </PinInputGroup>
        </PinInput>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: {
      Label,
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label for="pin-error">Security PIN</Label>
        <PinInput
          id="pin-error"
          aria-invalid="true"
          aria-describedby="pin-error-message"
        >
          <PinInputGroup>
            <PinInputSlot :index="0" />
            <PinInputSlot :index="1" />
            <PinInputSlot :index="2" />
            <PinInputSlot :index="3" />
          </PinInputGroup>
        </PinInput>
        <p id="pin-error-message" class="text-xs text-destructive">
          Invalid PIN code. Please try again.
        </p>
      </div>
    `,
  }),
}

export const TwoFactorAuth: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      PinInput,
      PinInputGroup,
      PinInputSeparator,
      PinInputSlot,
    },
    setup() {
      const code = ref<string[]>([])
      const error = ref('')
      const isSubmitting = ref(false)

      const handleSubmit = () => {
        error.value = ''

        if (code.value.length !== 6 || code.value.some((digit) => !digit)) {
          error.value = 'Please enter all 6 digits'
          return
        }

        isSubmitting.value = true
        setTimeout(() => {
          isSubmitting.value = false
          alert(`Verifying code: ${code.value.join('')}`)
        }, 1000)
      }

      return { code, error, isSubmitting, handleSubmit }
    },
    template: `
      <div class="max-w-md flex flex-col gap-6 p-6 border rounded-lg">
        <div class="flex flex-col gap-2 text-center">
          <h3 class="text-lg font-semibold">Two-Factor Authentication</h3>
          <p class="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <PinInput v-model="code">
            <PinInputGroup>
              <PinInputSlot :index="0" />
              <PinInputSlot :index="1" />
              <PinInputSlot :index="2" />
            </PinInputGroup>
            <PinInputSeparator />
            <PinInputGroup>
              <PinInputSlot :index="3" />
              <PinInputSlot :index="4" />
              <PinInputSlot :index="5" />
            </PinInputGroup>
          </PinInput>
          <p v-if="error" class="text-xs text-destructive">
            {{ error }}
          </p>
        </div>

        <Button
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="w-full"
        >
          {{ isSubmitting ? 'Verifying...' : 'Verify Code' }}
        </Button>

        <Button variant="link" class="text-xs">
          Didn't receive a code? Resend
        </Button>
      </div>
    `,
  }),
}

export const PhoneVerification: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    setup() {
      const phoneNumber = '+1 (555) 123-4567'
      const code = ref<string[]>([])
      const timeLeft = ref(60)
      const canResend = ref(false)

      const startTimer = () => {
        const timer = setInterval(() => {
          timeLeft.value--
          if (timeLeft.value === 0) {
            clearInterval(timer)
            canResend.value = true
          }
        }, 1000)
      }

      startTimer()

      const resendCode = () => {
        code.value = []
        timeLeft.value = 60
        canResend.value = false
        startTimer()
        alert('Verification code resent!')
      }

      return { phoneNumber, code, timeLeft, canResend, resendCode }
    },
    template: `
      <div class="max-w-md flex flex-col gap-6 p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Verify Your Phone Number</h3>
          <p class="text-sm text-muted-foreground">
            We sent a code to {{ phoneNumber }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label>Verification Code</Label>
          <PinInput v-model="code">
            <PinInputGroup>
              <PinInputSlot :index="0" />
              <PinInputSlot :index="1" />
              <PinInputSlot :index="2" />
              <PinInputSlot :index="3" />
              <PinInputSlot :index="4" />
              <PinInputSlot :index="5" />
            </PinInputGroup>
          </PinInput>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">
            {{ canResend ? 'Didn\\'t receive the code?' : \`Resend code in ${timeLeft}s\` }}
          </span>
          <Button
            variant="link"
            size="sm"
            :disabled="!canResend"
            @click="resendCode"
            class="p-0 h-auto"
          >
            Resend
          </Button>
        </div>

        <Button class="w-full">
          Verify Phone Number
        </Button>
      </div>
    `,
  }),
}

export const BankingPIN: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    setup() {
      const pin = ref<string[]>([])
      const showPin = ref(false)

      return { pin, showPin }
    },
    template: `
      <div class="max-w-sm flex flex-col gap-6 p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Enter Your PIN</h3>
          <p class="text-sm text-muted-foreground">
            Enter your 4-digit security PIN to continue
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label>Security PIN</Label>
          <PinInput v-model="pin" :type="showPin ? 'text' : 'number'">
            <PinInputGroup>
              <PinInputSlot :index="0" />
              <PinInputSlot :index="1" />
              <PinInputSlot :index="2" />
              <PinInputSlot :index="3" />
            </PinInputGroup>
          </PinInput>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-pin"
            v-model="showPin"
            class="rounded border-input"
          />
          <Label for="show-pin" class="cursor-pointer font-normal text-sm">
            Show PIN
          </Label>
        </div>

        <Button class="w-full">
          Confirm
        </Button>

        <Button variant="link" class="text-xs">
          Forgot your PIN?
        </Button>
      </div>
    `,
  }),
}

export const MultipleGroups: Story = {
  render: () => ({
    components: {
      Label,
      PinInput,
      PinInputGroup,
      PinInputSeparator,
      PinInputSlot,
    },
    template: `
      <div class="flex flex-col gap-6 max-w-2xl">
        <div class="flex flex-col gap-2">
          <Label>Credit Card Format (4-4-4-4)</Label>
          <PinInput>
            <PinInputGroup>
              <PinInputSlot :index="0" />
              <PinInputSlot :index="1" />
              <PinInputSlot :index="2" />
              <PinInputSlot :index="3" />
            </PinInputGroup>
            <PinInputSeparator />
            <PinInputGroup>
              <PinInputSlot :index="4" />
              <PinInputSlot :index="5" />
              <PinInputSlot :index="6" />
              <PinInputSlot :index="7" />
            </PinInputGroup>
            <PinInputSeparator />
            <PinInputGroup>
              <PinInputSlot :index="8" />
              <PinInputSlot :index="9" />
              <PinInputSlot :index="10" />
              <PinInputSlot :index="11" />
            </PinInputGroup>
            <PinInputSeparator />
            <PinInputGroup>
              <PinInputSlot :index="12" />
              <PinInputSlot :index="13" />
              <PinInputSlot :index="14" />
              <PinInputSlot :index="15" />
            </PinInputGroup>
          </PinInput>
        </div>

        <div class="flex flex-col gap-2">
          <Label>Product Key Format (5-5-5-5)</Label>
          <PinInput>
            <PinInputGroup>
              <PinInputSlot :index="0" />
              <PinInputSlot :index="1" />
              <PinInputSlot :index="2" />
              <PinInputSlot :index="3" />
              <PinInputSlot :index="4" />
            </PinInputGroup>
            <PinInputSeparator />
            <PinInputGroup>
              <PinInputSlot :index="5" />
              <PinInputSlot :index="6" />
              <PinInputSlot :index="7" />
              <PinInputSlot :index="8" />
              <PinInputSlot :index="9" />
            </PinInputGroup>
            <PinInputSeparator />
            <PinInputGroup>
              <PinInputSlot :index="10" />
              <PinInputSlot :index="11" />
              <PinInputSlot :index="12" />
              <PinInputSlot :index="13" />
              <PinInputSlot :index="14" />
            </PinInputGroup>
            <PinInputSeparator />
            <PinInputGroup>
              <PinInputSlot :index="15" />
              <PinInputSlot :index="16" />
              <PinInputSlot :index="17" />
              <PinInputSlot :index="18" />
              <PinInputSlot :index="19" />
            </PinInputGroup>
          </PinInput>
        </div>
      </div>
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: {
      Label,
      PinInput,
      PinInputGroup,
      PinInputSlot,
    },
    template: `
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label>Small (h-8 w-8)</Label>
          <PinInput>
            <PinInputGroup>
              <PinInputSlot :index="0" class="h-8 w-8 text-xs" />
              <PinInputSlot :index="1" class="h-8 w-8 text-xs" />
              <PinInputSlot :index="2" class="h-8 w-8 text-xs" />
              <PinInputSlot :index="3" class="h-8 w-8 text-xs" />
            </PinInputGroup>
          </PinInput>
        </div>

        <div class="flex flex-col gap-2">
          <Label>Default (h-9 w-9)</Label>
          <PinInput>
            <PinInputGroup>
              <PinInputSlot :index="0" />
              <PinInputSlot :index="1" />
              <PinInputSlot :index="2" />
              <PinInputSlot :index="3" />
            </PinInputGroup>
          </PinInput>
        </div>

        <div class="flex flex-col gap-2">
          <Label>Large (h-12 w-12)</Label>
          <PinInput>
            <PinInputGroup>
              <PinInputSlot :index="0" class="h-12 w-12 text-lg" />
              <PinInputSlot :index="1" class="h-12 w-12 text-lg" />
              <PinInputSlot :index="2" class="h-12 w-12 text-lg" />
              <PinInputSlot :index="3" class="h-12 w-12 text-lg" />
            </PinInputGroup>
          </PinInput>
        </div>
      </div>
    `,
  }),
}
