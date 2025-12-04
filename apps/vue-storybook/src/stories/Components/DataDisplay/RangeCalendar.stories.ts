import { getLocalTimeZone, today } from '@internationalized/date'
import type { DateRange } from '@meldui/vue'
import { DateRangePicker, RangeCalendar } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof RangeCalendar> = {
  title: 'Components/DataDisplay/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A standalone calendar component for selecting date ranges. Use this when you need an inline calendar embedded directly in your UI.

For a click-to-open date picker with presets, see the **DateRangePicker** component instead.`,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof RangeCalendar>

export const Default: Story = {
  render: () => ({
    components: { RangeCalendar },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="w-fit">
        <RangeCalendar v-model="value" />
      </div>
    `,
  }),
}

export const WithSelectedRange: Story = {
  render: () => ({
    components: { RangeCalendar },
    setup() {
      const todayDate = today(getLocalTimeZone())
      const value = ref<DateRange>({
        start: todayDate.subtract({ days: 7 }),
        end: todayDate,
      })
      return { value }
    },
    template: `
      <div class="w-fit space-y-4">
        <RangeCalendar v-model="value" />
        <div class="text-sm text-muted-foreground">
          Selected: {{ value?.start?.toString() }} - {{ value?.end?.toString() }}
        </div>
      </div>
    `,
  }),
}

export const MultipleMonths: Story = {
  render: () => ({
    components: { RangeCalendar },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="w-fit">
        <RangeCalendar v-model="value" :number-of-months="2" />
      </div>
    `,
  }),
}

export const WithMinMaxDates: Story = {
  render: () => ({
    components: { RangeCalendar },
    setup() {
      const value = ref<DateRange>()
      const todayDate = today(getLocalTimeZone())
      const minValue = todayDate
      const maxValue = todayDate.add({ days: 30 })
      return { value, minValue, maxValue }
    },
    template: `
      <div class="w-fit space-y-4">
        <RangeCalendar v-model="value" :min-value="minValue" :max-value="maxValue" />
        <div class="text-xs text-muted-foreground">
          Only dates within the next 30 days can be selected
        </div>
      </div>
    `,
  }),
}

export const InlineInForm: Story = {
  name: 'Inline in Form',
  render: () => ({
    components: { RangeCalendar },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="w-fit rounded-lg border">
        <div class="border-b bg-muted/50 p-4">
          <h3 class="font-semibold">Select Date Range</h3>
          <p class="text-sm text-muted-foreground">Choose start and end dates for your report</p>
        </div>
        <div class="p-4">
          <RangeCalendar v-model="value" class="p-0" />
        </div>
        <div v-if="value?.start && value?.end" class="border-t p-4">
          <div class="text-sm">
            <span class="text-muted-foreground">Selected:</span>
            <span class="ml-2 font-medium">{{ value.start.toString() }} - {{ value.end.toString() }}</span>
          </div>
        </div>
      </div>
    `,
  }),
}

export const ComparisonWithDateRangePicker: Story = {
  name: 'Comparison: RangeCalendar vs DateRangePicker',
  parameters: {
    docs: {
      description: {
        story: `This story shows the difference between **RangeCalendar** (inline) and **DateRangePicker** (popover with presets).

- **RangeCalendar**: Use when you need an inline calendar embedded in your UI
- **DateRangePicker**: Use when you want a click-to-open picker with preset quick selections`,
      },
    },
  },
  render: () => ({
    components: { RangeCalendar, DateRangePicker },
    setup() {
      const inlineValue = ref<DateRange>()
      const pickerValue = ref<DateRange>()
      return { inlineValue, pickerValue }
    },
    template: `
      <div class="flex gap-8">
        <div class="space-y-4">
          <div>
            <h3 class="font-semibold mb-1">RangeCalendar</h3>
            <p class="text-sm text-muted-foreground mb-4">Inline calendar, always visible</p>
          </div>
          <div class="w-fit">
            <RangeCalendar v-model="inlineValue" />
          </div>
          <div v-if="inlineValue?.start" class="text-sm text-muted-foreground">
            {{ inlineValue.start.toString() }} - {{ inlineValue.end?.toString() || '...' }}
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h3 class="font-semibold mb-1">DateRangePicker</h3>
            <p class="text-sm text-muted-foreground mb-4">Click to open, with presets</p>
          </div>
          <DateRangePicker v-model="pickerValue" class="w-72" />
          <div v-if="pickerValue?.start" class="text-sm text-muted-foreground">
            {{ pickerValue.start.toString() }} - {{ pickerValue.end?.toString() || '...' }}
          </div>
        </div>
      </div>
    `,
  }),
}

export const SidebarFilterExample: Story = {
  name: 'Sidebar Filter Example',
  parameters: {
    docs: {
      description: {
        story:
          'A common use case for inline RangeCalendar: a sidebar filter panel where the calendar is always visible.',
      },
    },
  },
  render: () => ({
    components: { RangeCalendar },
    setup() {
      const value = ref<DateRange>()
      return { value }
    },
    template: `
      <div class="w-72 rounded-lg border bg-card">
        <div class="p-4 border-b">
          <h3 class="font-semibold text-sm">Filters</h3>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">Date Range</label>
            <RangeCalendar v-model="value" class="p-0 border rounded-md" />
          </div>
          <div v-if="value?.start && value?.end" class="text-xs text-muted-foreground">
            Showing data from {{ value.start.toString() }} to {{ value.end.toString() }}
          </div>
        </div>
      </div>
    `,
  }),
}
