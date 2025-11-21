import type { DateValue } from '@internationalized/date'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { Calendar } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Calendar> = {
  title: 'Components/DataDisplay/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A date picker calendar component with support for single and multiple selection, range selection, and various layout options.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <Calendar v-model="value" />
    `,
  }),
}

export const WithSelectedDate: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>(today(getLocalTimeZone()))
      return { value }
    },
    template: `
      <div class="space-y-4">
        <Calendar v-model="value" />
        <div class="text-center text-sm text-muted-foreground">
          Selected: {{ value ? value.toString() : 'None' }}
        </div>
      </div>
    `,
  }),
}

export const MonthAndYearLayout: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <Calendar v-model="value" layout="month-and-year" />
    `,
  }),
}

export const MonthOnlyLayout: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <Calendar v-model="value" layout="month-only" />
    `,
  }),
}

export const YearOnlyLayout: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <Calendar v-model="value" layout="year-only" />
    `,
  }),
}

export const WithMinMaxDates: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      const today_date = today(getLocalTimeZone())
      const minValue = today_date
      const maxValue = today_date.add({ days: 30 })
      return { value, minValue, maxValue }
    },
    template: `
      <div class="space-y-4">
        <Calendar v-model="value" :min-value="minValue" :max-value="maxValue" />
        <div class="text-center text-xs text-muted-foreground">
          Only dates within the next 30 days can be selected
        </div>
      </div>
    `,
  }),
}

export const WithDisabledDates: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      const isDateDisabled = (date: DateValue) => {
        // Disable weekends
        const day = date.toDate(getLocalTimeZone()).getDay()
        return day === 0 || day === 6
      }
      return { value, isDateDisabled }
    },
    template: `
      <div class="space-y-4">
        <Calendar v-model="value" :is-date-disabled="isDateDisabled" />
        <div class="text-center text-xs text-muted-foreground">
          Weekends are disabled
        </div>
      </div>
    `,
  }),
}

export const MultipleMonths: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <Calendar v-model="value" :number-of-months="2" />
    `,
  }),
}

export const ThreeMonths: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <Calendar v-model="value" :number-of-months="3" />
    `,
  }),
}

export const WithDefaultDate: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>(new CalendarDate(2025, 12, 25))
      return { value }
    },
    template: `
      <div class="space-y-4">
        <Calendar v-model="value" />
        <div class="text-center text-sm text-muted-foreground">
          Default date: December 25, 2025
        </div>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <div class="w-fit rounded-lg border p-0">
        <div class="border-b bg-muted/50 p-4">
          <h3 class="font-semibold">Select a Date</h3>
          <p class="text-sm text-muted-foreground">Choose a date from the calendar below</p>
        </div>
        <div class="p-4">
          <Calendar v-model="value" class="p-0" />
        </div>
        <div v-if="value" class="border-t p-4">
          <div class="text-sm">
            <span class="text-muted-foreground">Selected:</span>
            <span class="ml-2 font-medium">{{ value.toString() }}</span>
          </div>
        </div>
      </div>
    `,
  }),
}

export const WithCustomPlaceholder: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      const placeholder = ref<DateValue>(new CalendarDate(2024, 6, 15))
      return { value, placeholder }
    },
    template: `
      <div class="space-y-4">
        <Calendar v-model="value" v-model:placeholder="placeholder" />
        <div class="text-center text-xs text-muted-foreground">
          Opens to June 2024 by default
        </div>
      </div>
    `,
  }),
}

export const Readonly: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>(today(getLocalTimeZone()))
      return { value }
    },
    template: `
      <div class="space-y-4">
        <Calendar v-model="value" :readonly="true" />
        <div class="text-center text-xs text-muted-foreground">
          Calendar is in read-only mode
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <div class="space-y-4">
        <Calendar v-model="value" :disabled="true" />
        <div class="text-center text-xs text-muted-foreground">
          Calendar is disabled
        </div>
      </div>
    `,
  }),
}

export const WithLocale: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <div class="space-y-6">
        <div>
          <h4 class="mb-2 text-sm font-medium">French (fr)</h4>
          <Calendar v-model="value" locale="fr" />
        </div>
        <div>
          <h4 class="mb-2 text-sm font-medium">German (de)</h4>
          <Calendar v-model="value" locale="de" />
        </div>
      </div>
    `,
  }),
}

export const WithWeekStartsOn: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const value = ref<DateValue>()
      return { value }
    },
    template: `
      <div class="space-y-6">
        <div>
          <h4 class="mb-2 text-sm font-medium">Week starts on Sunday (default)</h4>
          <Calendar v-model="value" :week-starts-on="0" />
        </div>
        <div>
          <h4 class="mb-2 text-sm font-medium">Week starts on Monday</h4>
          <Calendar v-model="value" :week-starts-on="1" />
        </div>
      </div>
    `,
  }),
}
