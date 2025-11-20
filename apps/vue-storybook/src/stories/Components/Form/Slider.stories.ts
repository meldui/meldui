import { Button, Label, Slider } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Slider> = {
  title: 'Components/Form/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A slider component for selecting values from a range. Supports single and range selection, with customizable min, max, and step values. Built on reka-ui.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Slider },
    setup() {
      const value = ref([50])
      return { value }
    },
    template: `
      <div class="max-w-xs">
        <Slider v-model="value" :max="100" :step="1" />
      </div>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const volume = ref([50])
      return { volume }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label>Volume</Label>
        <Slider v-model="volume" :max="100" :step="1" />
      </div>
    `,
  }),
}

export const WithValue: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const value = ref([33])
      return { value }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <div class="flex items-center justify-between">
          <Label>Brightness</Label>
          <span class="text-sm text-muted-foreground">{{ value[0] }}%</span>
        </div>
        <Slider v-model="value" :max="100" :step="1" />
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Button, Label, Slider },
    setup() {
      const value = ref([50])
      const reset = () => {
        value.value = [50]
      }
      return { value, reset }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <Label>Value</Label>
            <span class="text-sm font-mono font-semibold">{{ value[0] }}</span>
          </div>
          <Slider v-model="value" :max="100" :step="1" />
        </div>

        <Button size="sm" variant="outline" @click="reset">
          Reset to 50
        </Button>
      </div>
    `,
  }),
}

export const CustomRange: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const temperature = ref([20])
      return { temperature }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <div class="flex items-center justify-between">
          <Label>Temperature</Label>
          <span class="text-sm text-muted-foreground">{{ temperature[0] }}°C</span>
        </div>
        <Slider v-model="temperature" :min="0" :max="40" :step="1" />
        <div class="flex justify-between text-xs text-muted-foreground">
          <span>0°C</span>
          <span>40°C</span>
        </div>
      </div>
    `,
  }),
}

export const WithSteps: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const value = ref([50])
      return { value }
    },
    template: `
      <div class="flex flex-col gap-6 max-w-sm">
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <Label>Step by 1</Label>
            <span class="text-sm text-muted-foreground">{{ value[0] }}</span>
          </div>
          <Slider v-model="value" :max="100" :step="1" />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <Label>Step by 5</Label>
            <span class="text-sm text-muted-foreground">{{ value[0] }}</span>
          </div>
          <Slider v-model="value" :max="100" :step="5" />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <Label>Step by 10</Label>
            <span class="text-sm text-muted-foreground">{{ value[0] }}</span>
          </div>
          <Slider v-model="value" :max="100" :step="10" />
        </div>
      </div>
    `,
  }),
}

export const RangeSlider: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const range = ref([25, 75])
      return { range }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <div class="flex items-center justify-between">
          <Label>Price Range</Label>
          <span class="text-sm text-muted-foreground">
            {{ '$' + range[0] }} - {{ '$' + range[1] }}
          </span>
        </div>
        <Slider v-model="range" :max="100" :step="1" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const value = ref([50])
      return { value }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label>Disabled Slider</Label>
        <Slider v-model="value" :max="100" :step="1" disabled />
      </div>
    `,
  }),
}

export const VerticalOrientation: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const value = ref([50])
      return { value }
    },
    template: `
      <div class="flex flex-col gap-2 items-center">
        <Label>Vertical Slider</Label>
        <Slider v-model="value" :max="100" :step="1" orientation="vertical" class="h-64" />
        <span class="text-sm text-muted-foreground">{{ value[0] }}%</span>
      </div>
    `,
  }),
}

export const VolumeControl: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const volume = ref([70])
      return { volume }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm p-6 border rounded-lg">
        <div class="flex items-center justify-between">
          <Label class="text-base">Volume</Label>
          <span class="text-sm font-medium">{{ volume[0] }}%</span>
        </div>
        <Slider v-model="volume" :max="100" :step="1" />
        <div class="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Muted</span>
          <span>Max</span>
        </div>
      </div>
    `,
  }),
}

export const PriceFilter: Story = {
  render: () => ({
    components: { Button, Label, Slider },
    setup() {
      const priceRange = ref([200, 800])
      const minPrice = 0
      const maxPrice = 1000

      const formatPrice = (value: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(value)
      }

      return { priceRange, minPrice, maxPrice, formatPrice }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Filter by Price</h3>
          <p class="text-sm text-muted-foreground">
            Select your price range
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Price Range</span>
            <span class="text-sm text-muted-foreground">
              {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}
            </span>
          </div>
          <Slider
            v-model="priceRange"
            :min="minPrice"
            :max="maxPrice"
            :step="10"
          />
          <div class="flex justify-between text-xs text-muted-foreground">
            <span>{{ formatPrice(minPrice) }}</span>
            <span>{{ formatPrice(maxPrice) }}</span>
          </div>
        </div>

        <Button class="w-full">
          Apply Filter
        </Button>
      </div>
    `,
  }),
}

export const ImageQuality: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const quality = ref([80])

      const getQualityLabel = (value: number) => {
        if (value <= 30) return 'Low'
        if (value <= 60) return 'Medium'
        if (value <= 85) return 'High'
        return 'Very High'
      }

      return { quality, getQualityLabel }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <div class="flex items-center justify-between">
          <Label>Image Quality</Label>
          <span class="text-sm font-medium">
            {{ getQualityLabel(quality[0]) }} ({{ quality[0] }}%)
          </span>
        </div>
        <Slider v-model="quality" :max="100" :step="5" />
        <p class="text-xs text-muted-foreground mt-1">
          Higher quality results in larger file sizes
        </p>
      </div>
    `,
  }),
}

export const MultipleSliders: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const settings = ref({
        brightness: [70],
        contrast: [50],
        saturation: [60],
      })
      return { settings }
    },
    template: `
      <div class="flex flex-col gap-6 max-w-md p-6 border rounded-lg">
        <h3 class="text-lg font-semibold">Image Settings</h3>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <Label>Brightness</Label>
            <span class="text-sm text-muted-foreground">{{ settings.brightness[0] }}%</span>
          </div>
          <Slider v-model="settings.brightness" :max="100" :step="1" />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <Label>Contrast</Label>
            <span class="text-sm text-muted-foreground">{{ settings.contrast[0] }}%</span>
          </div>
          <Slider v-model="settings.contrast" :max="100" :step="1" />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <Label>Saturation</Label>
            <span class="text-sm text-muted-foreground">{{ settings.saturation[0] }}%</span>
          </div>
          <Slider v-model="settings.saturation" :max="100" :step="1" />
        </div>
      </div>
    `,
  }),
}

export const TimeRange: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const timeRange = ref([9, 17])

      const formatTime = (hour: number) => {
        const period = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        return `${displayHour}:00 ${period}`
      }

      return { timeRange, formatTime }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <div class="flex items-center justify-between">
          <Label>Working Hours</Label>
          <span class="text-sm text-muted-foreground">
            {{ formatTime(timeRange[0]) }} - {{ formatTime(timeRange[1]) }}
          </span>
        </div>
        <Slider v-model="timeRange" :min="0" :max="24" :step="1" />
        <p class="text-xs text-muted-foreground mt-1">
          Select your preferred working hours
        </p>
      </div>
    `,
  }),
}

export const AgeRange: Story = {
  render: () => ({
    components: { Button, Label, Slider },
    setup() {
      const ageRange = ref([25, 45])
      return { ageRange }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Age Filter</h3>
          <p class="text-sm text-muted-foreground">
            Filter users by age range
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <Label>Age Range</Label>
            <span class="text-sm font-medium">
              {{ ageRange[0] }} - {{ ageRange[1] }} years
            </span>
          </div>
          <Slider v-model="ageRange" :min="18" :max="80" :step="1" />
          <div class="flex justify-between text-xs text-muted-foreground">
            <span>18 years</span>
            <span>80 years</span>
          </div>
        </div>

        <Button class="w-full">
          Apply Filter
        </Button>
      </div>
    `,
  }),
}

export const ZoomControl: Story = {
  render: () => ({
    components: { Label, Slider },
    setup() {
      const zoom = ref([100])
      return { zoom }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <div class="flex items-center justify-between">
          <Label>Zoom Level</Label>
          <span class="text-sm font-medium">{{ zoom[0] }}%</span>
        </div>
        <Slider v-model="zoom" :min="50" :max="200" :step="10" />
        <div class="flex justify-between text-xs text-muted-foreground">
          <span>50%</span>
          <span>100%</span>
          <span>200%</span>
        </div>
      </div>
    `,
  }),
}
