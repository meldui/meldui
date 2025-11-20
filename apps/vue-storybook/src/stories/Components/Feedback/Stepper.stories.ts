import { IconCheck } from '@meldui/tabler-vue'
import {
  Button,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Stepper> = {
  title: 'Components/Feedback/Stepper',
  component: Stepper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stepper>

export const Default: Story = {
  render: () => ({
    components: {
      Stepper,
      StepperItem,
      StepperSeparator,
      StepperTrigger,
      StepperIndicator,
      StepperTitle,
    },
    setup() {
      const currentStep = ref(1)
      return { currentStep }
    },
    template: `
      <Stepper v-model="currentStep" class="flex w-full max-w-md">
        <StepperItem :step="1">
          <StepperTrigger>
            <StepperIndicator>1</StepperIndicator>
            <StepperTitle>Step 1</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="2">
          <StepperTrigger>
            <StepperIndicator>2</StepperIndicator>
            <StepperTitle>Step 2</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="3">
          <StepperTrigger>
            <StepperIndicator>3</StepperIndicator>
            <StepperTitle>Step 3</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    `,
  }),
}

export const WithDescription: Story = {
  render: () => ({
    components: {
      Stepper,
      StepperItem,
      StepperSeparator,
      StepperTrigger,
      StepperIndicator,
      StepperTitle,
      StepperDescription,
    },
    setup() {
      const currentStep = ref(2)
      return { currentStep }
    },
    template: `
      <Stepper v-model="currentStep" class="flex w-full max-w-2xl">
        <StepperItem :step="1">
          <StepperTrigger class="flex-col items-start">
            <StepperIndicator>1</StepperIndicator>
            <div class="flex flex-col gap-1">
              <StepperTitle>Account</StepperTitle>
              <StepperDescription>Create your account</StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="2">
          <StepperTrigger class="flex-col items-start">
            <StepperIndicator>2</StepperIndicator>
            <div class="flex flex-col gap-1">
              <StepperTitle>Profile</StepperTitle>
              <StepperDescription>Set up your profile</StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="3">
          <StepperTrigger class="flex-col items-start">
            <StepperIndicator>3</StepperIndicator>
            <div class="flex flex-col gap-1">
              <StepperTitle>Complete</StepperTitle>
              <StepperDescription>Review and finish</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    `,
  }),
}

export const WithCheckmarks: Story = {
  render: () => ({
    components: {
      Stepper,
      StepperItem,
      StepperSeparator,
      StepperTrigger,
      StepperIndicator,
      StepperTitle,
      IconCheck,
    },
    setup() {
      const currentStep = ref(3)
      return { currentStep }
    },
    template: `
      <Stepper v-model="currentStep" class="flex w-full max-w-md">
        <StepperItem :step="1">
          <StepperTrigger>
            <StepperIndicator>
              <IconCheck class="size-4" />
            </StepperIndicator>
            <StepperTitle>Step 1</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="2">
          <StepperTrigger>
            <StepperIndicator>
              <IconCheck class="size-4" />
            </StepperIndicator>
            <StepperTitle>Step 2</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="3">
          <StepperTrigger>
            <StepperIndicator>3</StepperIndicator>
            <StepperTitle>Step 3</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    `,
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: {
      Stepper,
      StepperItem,
      StepperSeparator,
      StepperTrigger,
      StepperIndicator,
      StepperTitle,
      StepperDescription,
      Button,
      IconCheck,
    },
    setup() {
      const currentStep = ref(1)
      const nextStep = () => {
        if (currentStep.value < 4) {
          currentStep.value++
        }
      }
      const prevStep = () => {
        if (currentStep.value > 1) {
          currentStep.value--
        }
      }
      return { currentStep, nextStep, prevStep }
    },
    template: `
      <div class="flex flex-col gap-6 w-full max-w-2xl">
        <Stepper v-model="currentStep" class="flex w-full">
          <StepperItem :step="1">
            <StepperTrigger class="flex-col items-start">
              <StepperIndicator>
                <IconCheck v-if="currentStep > 1" class="size-4" />
                <span v-else>1</span>
              </StepperIndicator>
              <div class="flex flex-col gap-1">
                <StepperTitle>Account</StepperTitle>
                <StepperDescription>Create account</StepperDescription>
              </div>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>

          <StepperItem :step="2">
            <StepperTrigger class="flex-col items-start">
              <StepperIndicator>
                <IconCheck v-if="currentStep > 2" class="size-4" />
                <span v-else>2</span>
              </StepperIndicator>
              <div class="flex flex-col gap-1">
                <StepperTitle>Profile</StepperTitle>
                <StepperDescription>Setup profile</StepperDescription>
              </div>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>

          <StepperItem :step="3">
            <StepperTrigger class="flex-col items-start">
              <StepperIndicator>
                <IconCheck v-if="currentStep > 3" class="size-4" />
                <span v-else>3</span>
              </StepperIndicator>
              <div class="flex flex-col gap-1">
                <StepperTitle>Preferences</StepperTitle>
                <StepperDescription>Set preferences</StepperDescription>
              </div>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>

          <StepperItem :step="4">
            <StepperTrigger class="flex-col items-start">
              <StepperIndicator>4</StepperIndicator>
              <div class="flex flex-col gap-1">
                <StepperTitle>Complete</StepperTitle>
                <StepperDescription>Finish setup</StepperDescription>
              </div>
            </StepperTrigger>
          </StepperItem>
        </Stepper>

        <div class="flex gap-2 justify-between">
          <Button @click="prevStep" :disabled="currentStep === 1" variant="outline">
            Previous
          </Button>
          <Button @click="nextStep" :disabled="currentStep === 4">
            {{ currentStep === 4 ? 'Finish' : 'Next' }}
          </Button>
        </div>
      </div>
    `,
  }),
}

export const VerticalOrientation: Story = {
  render: () => ({
    components: {
      Stepper,
      StepperItem,
      StepperSeparator,
      StepperTrigger,
      StepperIndicator,
      StepperTitle,
      StepperDescription,
    },
    setup() {
      const currentStep = ref(2)
      return { currentStep }
    },
    template: `
      <Stepper v-model="currentStep" orientation="vertical" class="flex-col w-full max-w-md">
        <StepperItem :step="1" class="flex-col items-start">
          <StepperTrigger>
            <StepperIndicator>1</StepperIndicator>
            <div class="flex flex-col gap-1">
              <StepperTitle>Account Setup</StepperTitle>
              <StepperDescription>Enter your email and create a password</StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator class="ml-4 h-8 w-px" />
        </StepperItem>

        <StepperItem :step="2" class="flex-col items-start">
          <StepperTrigger>
            <StepperIndicator>2</StepperIndicator>
            <div class="flex flex-col gap-1">
              <StepperTitle>Personal Information</StepperTitle>
              <StepperDescription>Tell us about yourself</StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator class="ml-4 h-8 w-px" />
        </StepperItem>

        <StepperItem :step="3" class="flex-col items-start">
          <StepperTrigger>
            <StepperIndicator>3</StepperIndicator>
            <div class="flex flex-col gap-1">
              <StepperTitle>Review & Confirm</StepperTitle>
              <StepperDescription>Check your information and submit</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    `,
  }),
}

export const FiveSteps: Story = {
  render: () => ({
    components: {
      Stepper,
      StepperItem,
      StepperSeparator,
      StepperTrigger,
      StepperIndicator,
      StepperTitle,
    },
    setup() {
      const currentStep = ref(3)
      return { currentStep }
    },
    template: `
      <Stepper v-model="currentStep" class="flex w-full max-w-3xl">
        <StepperItem :step="1">
          <StepperTrigger>
            <StepperIndicator>1</StepperIndicator>
            <StepperTitle>Cart</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="2">
          <StepperTrigger>
            <StepperIndicator>2</StepperIndicator>
            <StepperTitle>Shipping</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="3">
          <StepperTrigger>
            <StepperIndicator>3</StepperIndicator>
            <StepperTitle>Payment</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="4">
          <StepperTrigger>
            <StepperIndicator>4</StepperIndicator>
            <StepperTitle>Review</StepperTitle>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        <StepperItem :step="5">
          <StepperTrigger>
            <StepperIndicator>5</StepperIndicator>
            <StepperTitle>Complete</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    `,
  }),
}
