import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

// Define regex patterns locally to avoid dependency
const REGEXP_ONLY_DIGITS = '^\\d+$'
const REGEXP_ONLY_CHARS = '^[a-zA-Z]+$'
const REGEXP_ONLY_DIGITS_AND_CHARS = '^[a-zA-Z0-9]+$'

const meta: Meta<typeof InputOTP> = {
  title: 'Components/Form/InputOtp',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {
    maxlength: {
      control: 'number',
      description: 'Maximum number of characters',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A one-time password (OTP) input component with individual character slots. Perfect for verification codes, 2FA, and security confirmations.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSlot },
    template: `
      <InputOTP :maxlength="6">
        <InputOTPGroup>
          <InputOTPSlot :index="0" />
          <InputOTPSlot :index="1" />
          <InputOTPSlot :index="2" />
          <InputOTPSlot :index="3" />
          <InputOTPSlot :index="4" />
          <InputOTPSlot :index="5" />
        </InputOTPGroup>
      </InputOTP>
    `,
  }),
}

export const WithSeparator: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot },
    template: `
      <InputOTP :maxlength="6">
        <InputOTPGroup>
          <InputOTPSlot :index="0" />
          <InputOTPSlot :index="1" />
          <InputOTPSlot :index="2" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot :index="3" />
          <InputOTPSlot :index="4" />
          <InputOTPSlot :index="5" />
        </InputOTPGroup>
      </InputOTP>
    `,
  }),
}

export const NumericOnly: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot },
    setup() {
      return { REGEXP_ONLY_DIGITS }
    },
    template: `
      <div class="flex flex-col gap-2">
        <Label>Enter numeric PIN</Label>
        <InputOTP :maxlength="4" :pattern="REGEXP_ONLY_DIGITS">
          <InputOTPGroup>
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
            <InputOTPSlot :index="2" />
            <InputOTPSlot :index="3" />
          </InputOTPGroup>
        </InputOTP>
      </div>
    `,
  }),
}

export const Alphanumeric: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot },
    setup() {
      return { REGEXP_ONLY_DIGITS_AND_CHARS }
    },
    template: `
      <div class="flex flex-col gap-2">
        <Label>Enter alphanumeric code</Label>
        <InputOTP :maxlength="6" :pattern="REGEXP_ONLY_DIGITS_AND_CHARS">
          <InputOTPGroup>
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
            <InputOTPSlot :index="2" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot :index="3" />
            <InputOTPSlot :index="4" />
            <InputOTPSlot :index="5" />
          </InputOTPGroup>
        </InputOTP>
      </div>
    `,
  }),
}

export const LettersOnly: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSlot },
    setup() {
      return { REGEXP_ONLY_CHARS }
    },
    template: `
      <div class="flex flex-col gap-2">
        <Label>Enter letters only</Label>
        <InputOTP :maxlength="6" :pattern="REGEXP_ONLY_CHARS">
          <InputOTPGroup>
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
            <InputOTPSlot :index="2" />
            <InputOTPSlot :index="3" />
            <InputOTPSlot :index="4" />
            <InputOTPSlot :index="5" />
          </InputOTPGroup>
        </InputOTP>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <Label>Enter verification code</Label>
          <InputOTP v-model="value" :maxlength="6">
            <InputOTPGroup>
              <InputOTPSlot :index="0" />
              <InputOTPSlot :index="1" />
              <InputOTPSlot :index="2" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot :index="3" />
              <InputOTPSlot :index="4" />
              <InputOTPSlot :index="5" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div class="text-sm text-muted-foreground">
          Value: <span class="font-mono font-semibold">{{ value || '(empty)' }}</span>
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot },
    template: `
      <InputOTP :maxlength="6" disabled>
        <InputOTPGroup>
          <InputOTPSlot :index="0" />
          <InputOTPSlot :index="1" />
          <InputOTPSlot :index="2" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot :index="3" />
          <InputOTPSlot :index="4" />
          <InputOTPSlot :index="5" />
        </InputOTPGroup>
      </InputOTP>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Label },
    setup() {
      const value = ref('')
      const error = ref(true)
      return { value, error }
    },
    template: `
      <div class="flex flex-col gap-2">
        <Label for="otp">Verification Code</Label>
        <InputOTP
          id="otp"
          v-model="value"
          :maxlength="6"
          :aria-invalid="error"
          aria-describedby="otp-error"
        >
          <InputOTPGroup>
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
            <InputOTPSlot :index="2" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot :index="3" />
            <InputOTPSlot :index="4" />
            <InputOTPSlot :index="5" />
          </InputOTPGroup>
        </InputOTP>
        <p id="otp-error" class="text-xs text-destructive">
          Invalid verification code. Please try again.
        </p>
      </div>
    `,
  }),
}

export const DifferentLengths: Story = {
  render: () => ({
    components: { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Label },
    template: `
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label>4-digit PIN</Label>
          <InputOTP :maxlength="4">
            <InputOTPGroup>
              <InputOTPSlot :index="0" />
              <InputOTPSlot :index="1" />
              <InputOTPSlot :index="2" />
              <InputOTPSlot :index="3" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div class="flex flex-col gap-2">
          <Label>6-digit code</Label>
          <InputOTP :maxlength="6">
            <InputOTPGroup>
              <InputOTPSlot :index="0" />
              <InputOTPSlot :index="1" />
              <InputOTPSlot :index="2" />
              <InputOTPSlot :index="3" />
              <InputOTPSlot :index="4" />
              <InputOTPSlot :index="5" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div class="flex flex-col gap-2">
          <Label>8-digit code</Label>
          <InputOTP :maxlength="8">
            <InputOTPGroup>
              <InputOTPSlot :index="0" />
              <InputOTPSlot :index="1" />
              <InputOTPSlot :index="2" />
              <InputOTPSlot :index="3" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot :index="4" />
              <InputOTPSlot :index="5" />
              <InputOTPSlot :index="6" />
              <InputOTPSlot :index="7" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
    `,
  }),
}

export const VerificationForm: Story = {
  render: () => ({
    components: { Button, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Label },
    setup() {
      const code = ref('')
      const error = ref('')
      const isVerifying = ref(false)

      const handleVerify = () => {
        error.value = ''

        if (code.value.length !== 6) {
          error.value = 'Please enter the complete 6-digit code'
          return
        }

        isVerifying.value = true

        // Simulate verification
        setTimeout(() => {
          if (code.value === '123456') {
            alert('Verification successful!')
            code.value = ''
          } else {
            error.value = 'Invalid code. Please try again.'
          }
          isVerifying.value = false
        }, 1500)
      }

      const handleComplete = (value: string) => {
        if (value.length === 6) {
          handleVerify()
        }
      }

      return { code, error, isVerifying, handleVerify, handleComplete }
    },
    template: `
      <form @submit.prevent="handleVerify" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="verification-code">Verification Code</Label>
          <p class="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
          <InputOTP
            id="verification-code"
            v-model="code"
            :maxlength="6"
            :aria-invalid="!!error"
            :aria-describedby="error ? 'code-error' : undefined"
            @complete="handleComplete"
          >
            <InputOTPGroup>
              <InputOTPSlot :index="0" />
              <InputOTPSlot :index="1" />
              <InputOTPSlot :index="2" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot :index="3" />
              <InputOTPSlot :index="4" />
              <InputOTPSlot :index="5" />
            </InputOTPGroup>
          </InputOTP>
          <p v-if="error" id="code-error" class="text-xs text-destructive">
            {{ error }}
          </p>
        </div>

        <div class="flex gap-2">
          <Button type="submit" :disabled="code.length !== 6 || isVerifying">
            {{ isVerifying ? 'Verifying...' : 'Verify' }}
          </Button>
          <Button type="button" variant="outline">
            Resend Code
          </Button>
        </div>

        <p class="text-xs text-muted-foreground">
          Hint: Try code <span class="font-mono font-semibold">123456</span>
        </p>
      </form>
    `,
  }),
}

export const TwoFactorAuth: Story = {
  render: () => ({
    components: { Button, InputOTP, InputOTPGroup, InputOTPSlot, Label },
    setup() {
      const otp = ref('')
      const REGEXP_ONLY_DIGITS = /^\d+$/

      return { otp, REGEXP_ONLY_DIGITS }
    },
    template: `
      <div class="max-w-sm flex flex-col gap-6 p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Two-Factor Authentication</h3>
          <p class="text-sm text-muted-foreground">
            Enter the authentication code from your authenticator app
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="2fa-code">Authentication Code</Label>
          <InputOTP
            id="2fa-code"
            v-model="otp"
            :maxlength="6"
            :pattern="REGEXP_ONLY_DIGITS"
          >
            <InputOTPGroup>
              <InputOTPSlot :index="0" />
              <InputOTPSlot :index="1" />
              <InputOTPSlot :index="2" />
              <InputOTPSlot :index="3" />
              <InputOTPSlot :index="4" />
              <InputOTPSlot :index="5" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button :disabled="otp.length !== 6" class="w-full">
          Verify & Continue
        </Button>

        <button type="button" class="text-xs text-center text-muted-foreground hover:text-foreground transition-colors">
          Use backup code instead
        </button>
      </div>
    `,
  }),
}
