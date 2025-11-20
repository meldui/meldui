import { Progress } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onMounted, onUnmounted, ref } from 'vue'

const meta: Meta<typeof Progress> = {
  title: 'Components/Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    max: {
      control: 'number',
      description: 'Maximum progress value',
    },
  },
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: (args) => ({
    components: { Progress },
    setup() {
      return { args }
    },
    template: '<Progress v-bind="args" class="w-[400px]" />',
  }),
  args: {
    modelValue: 60,
  },
}

export const Empty: Story = {
  render: () => ({
    components: { Progress },
    template: '<Progress :model-value="0" class="w-[400px]" />',
  }),
}

export const Half: Story = {
  render: () => ({
    components: { Progress },
    template: '<Progress :model-value="50" class="w-[400px]" />',
  }),
}

export const Complete: Story = {
  render: () => ({
    components: { Progress },
    template: '<Progress :model-value="100" class="w-[400px]" />',
  }),
}

export const MultipleValues: Story = {
  render: () => ({
    components: { Progress },
    template: `
      <div class="flex flex-col gap-4 w-[400px]">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">0%</span>
          </div>
          <Progress :model-value="0" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">25%</span>
          </div>
          <Progress :model-value="25" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">50%</span>
          </div>
          <Progress :model-value="50" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">75%</span>
          </div>
          <Progress :model-value="75" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">100%</span>
          </div>
          <Progress :model-value="100" />
        </div>
      </div>
    `,
  }),
}

export const Animated: Story = {
  render: () => ({
    components: { Progress },
    setup() {
      const progress = ref(0)
      let interval: NodeJS.Timeout

      onMounted(() => {
        interval = setInterval(() => {
          progress.value = (progress.value + 1) % 101
        }, 50)
      })

      onUnmounted(() => {
        if (interval) clearInterval(interval)
      })

      return { progress }
    },
    template: `
      <div class="w-[400px]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">Loading...</span>
          <span class="text-sm text-muted-foreground">{{ progress }}%</span>
        </div>
        <Progress :model-value="progress" />
      </div>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Progress },
    template: `
      <div class="w-[400px]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">Uploading file...</span>
          <span class="text-sm text-muted-foreground">65%</span>
        </div>
        <Progress :model-value="65" />
      </div>
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { Progress },
    template: `
      <div class="flex flex-col gap-6 w-[400px]">
        <div>
          <div class="text-sm font-medium mb-2">Small (h-1)</div>
          <Progress :model-value="60" class="h-1" />
        </div>
        <div>
          <div class="text-sm font-medium mb-2">Default (h-2)</div>
          <Progress :model-value="60" class="h-2" />
        </div>
        <div>
          <div class="text-sm font-medium mb-2">Medium (h-3)</div>
          <Progress :model-value="60" class="h-3" />
        </div>
        <div>
          <div class="text-sm font-medium mb-2">Large (h-4)</div>
          <Progress :model-value="60" class="h-4" />
        </div>
      </div>
    `,
  }),
}

export const FileUpload: Story = {
  render: () => ({
    components: { Progress },
    setup() {
      const progress = ref(0)
      let interval: NodeJS.Timeout

      onMounted(() => {
        interval = setInterval(() => {
          if (progress.value < 100) {
            progress.value += 2
          } else {
            clearInterval(interval)
          }
        }, 100)
      })

      onUnmounted(() => {
        if (interval) clearInterval(interval)
      })

      return { progress }
    },
    template: `
      <div class="w-[500px] p-6 border rounded-lg">
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <h3 class="font-medium text-sm mb-1">document.pdf</h3>
            <p class="text-sm text-muted-foreground mb-3">2.4 MB</p>
            <Progress :model-value="progress" />
            <p class="text-sm text-muted-foreground mt-2">
              {{ progress < 100 ? 'Uploading...' : 'Upload complete' }} {{ progress }}%
            </p>
          </div>
        </div>
      </div>
    `,
  }),
}

export const MultipleProgress: Story = {
  render: () => ({
    components: { Progress },
    template: `
      <div class="flex flex-col gap-6 w-[500px]">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">CPU Usage</span>
            <span class="text-sm text-muted-foreground">45%</span>
          </div>
          <Progress :model-value="45" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">Memory</span>
            <span class="text-sm text-muted-foreground">72%</span>
          </div>
          <Progress :model-value="72" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">Storage</span>
            <span class="text-sm text-muted-foreground">88%</span>
          </div>
          <Progress :model-value="88" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">Network</span>
            <span class="text-sm text-muted-foreground">23%</span>
          </div>
          <Progress :model-value="23" />
        </div>
      </div>
    `,
  }),
}

export const StepProgress: Story = {
  render: () => ({
    components: { Progress },
    setup() {
      const currentStep = ref(2)
      const totalSteps = 4
      const progress = ref((currentStep.value / totalSteps) * 100)

      return { progress, currentStep, totalSteps }
    },
    template: `
      <div class="w-[500px]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">Setup Progress</span>
          <span class="text-sm text-muted-foreground">Step {{ currentStep }} of {{ totalSteps }}</span>
        </div>
        <Progress :model-value="progress" />
        <div class="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>Account</span>
          <span>Profile</span>
          <span>Preferences</span>
          <span>Complete</span>
        </div>
      </div>
    `,
  }),
}
