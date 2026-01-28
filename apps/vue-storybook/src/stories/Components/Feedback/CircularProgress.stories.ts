import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressLabel,
  CircularProgressRange,
  CircularProgressTrack,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onMounted, onUnmounted, ref } from 'vue'

const meta: Meta<typeof CircularProgress> = {
  title: 'Components/Feedback/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100), null for indeterminate',
    },
    min: {
      control: 'number',
      description: 'Minimum progress value',
    },
    max: {
      control: 'number',
      description: 'Maximum progress value',
    },
    size: {
      control: { type: 'range', min: 24, max: 200, step: 4 },
      description: 'Size in pixels',
    },
    thickness: {
      control: { type: 'range', min: 2, max: 16, step: 1 },
      description: 'Stroke thickness in pixels',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info', 'neutral'],
      description: 'Color variant of the progress',
    },
  },
}

export default meta
type Story = StoryObj<typeof CircularProgress>

export const Default: Story = {
  render: (args) => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    setup() {
      return { args }
    },
    template: `
      <CircularProgress v-bind="args">
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
        <CircularProgressLabel />
      </CircularProgress>
    `,
  }),
  args: {
    value: 60,
    size: 80,
    thickness: 6,
  },
}

export const WithoutLabel: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
    },
    template: `
      <CircularProgress :value="75" :size="80" :thickness="6">
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
      </CircularProgress>
    `,
  }),
}

export const CustomLabel: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    template: `
      <CircularProgress :value="75" :size="100" :thickness="8">
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
        <CircularProgressLabel class="text-base font-semibold">
          75/100
        </CircularProgressLabel>
      </CircularProgress>
    `,
  }),
}

export const Indeterminate: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    template: `
      <div class="flex items-center gap-6">
        <CircularProgress :value="null" :size="80" :thickness="6">
          <CircularProgressIndicator>
            <CircularProgressTrack />
            <CircularProgressRange />
          </CircularProgressIndicator>
        </CircularProgress>
        <div class="flex flex-col gap-1">
          <div class="font-medium text-sm">Loading...</div>
          <div class="text-muted-foreground text-xs">Processing your request</div>
        </div>
      </div>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    template: `
      <div class="flex flex-wrap gap-8">
        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="80" :thickness="6" variant="default">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">Default</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="85" :size="80" :thickness="6" variant="destructive">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">Destructive</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="100" :size="80" :thickness="6" variant="success">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">Success</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="78" :size="80" :thickness="6" variant="warning">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">Warning</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="45" :size="80" :thickness="6" variant="info">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">Info</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="50" :size="80" :thickness="6" variant="neutral">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">Neutral</span>
        </div>
      </div>
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    template: `
      <div class="flex items-end gap-8">
        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="48" :thickness="4">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="text-xs" />
          </CircularProgress>
          <span class="text-xs text-muted-foreground">Small</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="80" :thickness="6">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="text-sm" />
          </CircularProgress>
          <span class="text-xs text-muted-foreground">Medium</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="120" :thickness="8">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="text-base" />
          </CircularProgress>
          <span class="text-xs text-muted-foreground">Large</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="160" :thickness="12">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="text-lg" />
          </CircularProgress>
          <span class="text-xs text-muted-foreground">Extra Large</span>
        </div>
      </div>
    `,
  }),
}

export const DifferentThickness: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    template: `
      <div class="flex items-center gap-8">
        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="80" :thickness="2">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-xs text-muted-foreground">Thin</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="80" :thickness="6">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-xs text-muted-foreground">Default</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="80" :thickness="10">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-xs text-muted-foreground">Thick</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="60" :size="80" :thickness="14">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-xs text-muted-foreground">Extra Thick</span>
        </div>
      </div>
    `,
  }),
}

export const Animated: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
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
      <div class="flex items-center gap-6">
        <CircularProgress :value="progress" :size="100" :thickness="8">
          <CircularProgressIndicator>
            <CircularProgressTrack />
            <CircularProgressRange />
          </CircularProgressIndicator>
          <CircularProgressLabel class="text-base font-semibold" />
        </CircularProgress>
        <div class="flex flex-col gap-1">
          <div class="font-medium text-sm">Loading...</div>
          <div class="text-muted-foreground text-xs">Progress: {{ progress }}%</div>
        </div>
      </div>
    `,
  }),
}

function handleUploadStart(
  uploadProgress: { value: number },
  isUploading: { value: boolean },
  interval: { value: NodeJS.Timeout | null },
) {
  isUploading.value = true
  uploadProgress.value = 0

  interval.value = setInterval(() => {
    uploadProgress.value = Math.min(100, uploadProgress.value + Math.random() * 15)

    if (uploadProgress.value >= 100) {
      if (interval.value) {
        clearInterval(interval.value)
        interval.value = null
      }
      isUploading.value = false
    }
  }, 200)
}

function handleUploadReset(
  uploadProgress: { value: number },
  isUploading: { value: boolean },
  interval: { value: NodeJS.Timeout | null },
) {
  uploadProgress.value = 0
  isUploading.value = false
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = null
  }
}

function handleSetIndeterminate(
  uploadProgress: { value: number | null },
  isUploading: { value: boolean },
  interval: { value: NodeJS.Timeout | null },
) {
  uploadProgress.value = null
  isUploading.value = false
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = null
  }
}

export const UploadProgress: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    setup() {
      const uploadProgress = ref(0)
      const isUploading = ref(false)
      const interval = { value: null as NodeJS.Timeout | null }

      const onUploadStart = () => handleUploadStart(uploadProgress, isUploading, interval)
      const onUploadReset = () => handleUploadReset(uploadProgress, isUploading, interval)
      const setIndeterminate = () => handleSetIndeterminate(uploadProgress, isUploading, interval)

      onUnmounted(() => {
        if (interval.value) {
          clearInterval(interval.value)
          interval.value = null
        }
      })

      return {
        uploadProgress,
        isUploading,
        onUploadStart,
        onUploadReset,
        setIndeterminate,
      }
    },
    template: `
      <div class="flex flex-col items-center gap-6">
        <div class="flex items-center gap-6">
          <CircularProgress
            :value="uploadProgress"
            :min="0"
            :max="100"
            :size="80"
            :thickness="6"
          >
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="font-semibold text-base" />
          </CircularProgress>
          <div class="flex flex-col gap-2">
            <div class="font-medium text-sm">Upload Progress</div>
            <div class="text-muted-foreground text-xs">
              Status: {{ isUploading ? 'Uploading...' : uploadProgress === 100 ? 'Complete' : 'Ready' }}
            </div>
            <div class="text-muted-foreground text-xs">
              Progress: {{ uploadProgress === null ? 'Indeterminate' : Math.round(uploadProgress) + '%' }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="onUploadStart"
            :disabled="isUploading"
            class="px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start upload
          </button>
          <button
            @click="onUploadReset"
            :disabled="isUploading"
            class="px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            @click="setIndeterminate"
            :disabled="isUploading"
            class="px-3 py-1.5 text-sm rounded bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Indeterminate
          </button>
        </div>
      </div>
    `,
  }),
}

export const MultipleProgress: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    template: `
      <div class="flex flex-wrap gap-8">
        <div class="flex items-center gap-4">
          <CircularProgress :value="45" :size="64" :thickness="5" variant="info">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="text-xs font-semibold" />
          </CircularProgress>
          <div class="flex flex-col">
            <span class="text-sm font-medium">CPU Usage</span>
            <span class="text-xs text-muted-foreground">Normal</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <CircularProgress :value="72" :size="64" :thickness="5" variant="warning">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="text-xs font-semibold" />
          </CircularProgress>
          <div class="flex flex-col">
            <span class="text-sm font-medium">Memory</span>
            <span class="text-xs text-muted-foreground">High</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <CircularProgress :value="88" :size="64" :thickness="5" variant="destructive">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="text-xs font-semibold" />
          </CircularProgress>
          <div class="flex flex-col">
            <span class="text-sm font-medium">Storage</span>
            <span class="text-xs text-muted-foreground">Critical</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <CircularProgress :value="23" :size="64" :thickness="5" variant="success">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel class="text-xs font-semibold" />
          </CircularProgress>
          <div class="flex flex-col">
            <span class="text-sm font-medium">Network</span>
            <span class="text-xs text-muted-foreground">Low</span>
          </div>
        </div>
      </div>
    `,
  }),
}

export const ProgressStates: Story = {
  render: () => ({
    components: {
      CircularProgress,
      CircularProgressIndicator,
      CircularProgressTrack,
      CircularProgressRange,
      CircularProgressLabel,
    },
    template: `
      <div class="flex flex-wrap gap-8">
        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="0" :size="80" :thickness="6">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">Not Started</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="50" :size="80" :thickness="6">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">In Progress</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="100" :size="80" :thickness="6" variant="success">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
            <CircularProgressLabel />
          </CircularProgress>
          <span class="text-sm font-medium">Complete</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <CircularProgress :value="null" :size="80" :thickness="6">
            <CircularProgressIndicator>
              <CircularProgressTrack />
              <CircularProgressRange />
            </CircularProgressIndicator>
          </CircularProgress>
          <span class="text-sm font-medium">Loading</span>
        </div>
      </div>
    `,
  }),
}
