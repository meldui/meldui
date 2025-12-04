import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import type { DateRange, DateRangePreset } from '@meldui/vue'
import { DateRangePicker } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/Form/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A date picker component with preset quick selections. Supports both single date and date range selection modes, with configurable presets and calendar visibility.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range'],
      description: 'Selection mode: single date or date range',
    },
    showCalendar: {
      control: 'boolean',
      description: 'Whether to show the calendar alongside presets',
    },
    closeOnPresetSelect: {
      control: 'boolean',
      description: 'Whether to close the popover when a preset is selected',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the picker is disabled',
    },
  },
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

export const Default: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="w-80">
        <DateRangePicker v-model="value" />
      </div>
    `,
  }),
}

export const SingleMode: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <div class="w-80">
        <DateRangePicker v-model="value" mode="single" />
      </div>
    `,
  }),
}

export const RangeMode: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="space-y-4 w-80">
        <DateRangePicker v-model="value" mode="range" />
        <div v-if="value" class="text-sm text-muted-foreground">
          Selected: {{ value.start?.toString() }} - {{ value.end?.toString() }}
        </div>
      </div>
    `,
  }),
}

export const PresetsOnly: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="space-y-4 w-80">
        <DateRangePicker v-model="value" :show-calendar="false" />
        <div class="text-xs text-muted-foreground">
          Calendar is hidden, only presets are shown
        </div>
      </div>
    `,
  }),
}

export const StayOpenOnPresetSelect: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="space-y-4 w-80">
        <DateRangePicker v-model="value" :close-on-preset-select="false" />
        <div class="text-xs text-muted-foreground">
          Popover stays open after selecting a preset
        </div>
      </div>
    `,
  }),
}

export const CustomPresets: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      const getToday = () => today(getLocalTimeZone())

      const customPresets: DateRangePreset[] = [
        {
          label: 'This Week',
          value: () => {
            const now = getToday()
            const dayOfWeek = now.toDate(getLocalTimeZone()).getDay()
            const startOfWeek = now.subtract({ days: dayOfWeek })
            return { start: startOfWeek, end: now }
          },
        },
        {
          label: 'This Quarter',
          value: () => {
            const now = getToday()
            const quarterStart = now.set({
              month: Math.floor((now.month - 1) / 3) * 3 + 1,
              day: 1,
            })
            return { start: quarterStart, end: now }
          },
        },
        {
          label: 'Year to Date',
          value: () => {
            const now = getToday()
            const yearStart = now.set({ month: 1, day: 1 })
            return { start: yearStart, end: now }
          },
        },
        {
          label: 'Last Year',
          value: () => {
            const now = getToday()
            const lastYear = now.subtract({ years: 1 })
            const lastYearStart = lastYear.set({ month: 1, day: 1 })
            const lastYearEnd = lastYear.set({ month: 12, day: 31 })
            return { start: lastYearStart, end: lastYearEnd }
          },
        },
      ]

      return { value, customPresets }
    },
    template: `
      <div class="space-y-4 w-80">
        <DateRangePicker v-model="value" :presets="customPresets" />
        <div class="text-xs text-muted-foreground">
          Custom presets: This Week, This Quarter, Year to Date, Last Year
        </div>
      </div>
    `,
  }),
}

export const WithMinMaxDates: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      const todayDate = today(getLocalTimeZone())
      const minValue = todayDate.subtract({ days: 30 })
      const maxValue = todayDate.add({ days: 30 })
      return { value, minValue, maxValue }
    },
    template: `
      <div class="space-y-4 w-80">
        <DateRangePicker v-model="value" :min-value="minValue" :max-value="maxValue" />
        <div class="text-xs text-muted-foreground">
          Only dates within 30 days past and future can be selected
        </div>
      </div>
    `,
  }),
}

export const MultipleMonths: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="w-80">
        <DateRangePicker v-model="value" :number-of-months="2" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="w-80">
        <DateRangePicker v-model="value" disabled />
      </div>
    `,
  }),
}

export const WithInitialValue: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const todayDate = today(getLocalTimeZone())
      const value = ref<DateRange>({
        start: todayDate.subtract({ days: 7 }),
        end: todayDate,
      })
      return { value }
    },
    template: `
      <div class="space-y-4 w-80">
        <DateRangePicker v-model="value" />
        <div class="text-sm text-muted-foreground">
          Pre-selected: Last 7 days
        </div>
      </div>
    `,
  }),
}

export const WithPresetSelectEvent: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateRange>()
      const lastPreset = ref<string>('')

      const handlePresetSelect = (preset: { label: string }) => {
        lastPreset.value = preset.label
      }

      return { value, lastPreset, handlePresetSelect }
    },
    template: `
      <div class="space-y-4 w-80">
        <DateRangePicker v-model="value" @preset-select="handlePresetSelect" />
        <div v-if="lastPreset" class="text-sm text-muted-foreground">
          Last preset selected: {{ lastPreset }}
        </div>
      </div>
    `,
  }),
}

export const SingleModePresetsOnly: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <div class="space-y-4 w-80">
        <DateRangePicker v-model="value" mode="single" :show-calendar="false" />
        <div v-if="value" class="text-sm text-muted-foreground">
          Selected: {{ value.toString() }}
        </div>
      </div>
    `,
  }),
}

export const InFormLayout: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref<DateRange>()
      return { dateRange }
    },
    template: `
      <div class="w-96 space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Report Period</label>
          <DateRangePicker v-model="dateRange" placeholder="Select date range" />
          <p class="text-xs text-muted-foreground">
            Choose the date range for your report
          </p>
        </div>
      </div>
    `,
  }),
}
