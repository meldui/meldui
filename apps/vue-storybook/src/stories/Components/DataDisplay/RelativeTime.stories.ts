import { RelativeTime } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof RelativeTime> = {
  title: 'Components/DataDisplay/RelativeTime',
  component: RelativeTime,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Displays relative time (e.g., "5 minutes ago", "in 2 hours") with optional auto-updating and internationalization support. Built on VueUse useTimeAgoIntl composable powered by native Intl.RelativeTimeFormat API.',
      },
    },
  },
  argTypes: {
    date: {
      control: 'date',
      description: 'The date to format as relative time (Date, string, or timestamp)',
    },
    autoUpdate: {
      control: 'boolean',
      description: 'Whether to automatically update the relative time',
      defaultValue: false,
    },
    updateInterval: {
      control: 'number',
      description: 'Update interval in milliseconds when autoUpdate is enabled',
      defaultValue: 30000,
    },
    locale: {
      control: 'text',
      description: 'BCP 47 language tag for localization (e.g., "en-US", "fr-FR", "ja-JP")',
    },
    as: {
      control: 'text',
      description: 'HTML element to render as',
      defaultValue: 'time',
    },
  },
}

export default meta
type Story = StoryObj<typeof RelativeTime>

export const Default: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return { fiveMinutesAgo }
    },
    template: `
      <RelativeTime :date="fiveMinutesAgo" />
    `,
  }),
}

export const AutoUpdate: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const now = new Date()
      return { now }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">This timestamp will auto-update every 5 seconds:</p>
        <RelativeTime :date="now" :auto-update="true" :update-interval="5000" class="font-medium" />
      </div>
    `,
  }),
}

export const VariousTimes: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const justNow = new Date()
      const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000)
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

      return {
        justNow,
        oneMinuteAgo,
        fiveMinutesAgo,
        oneHourAgo,
        threeDaysAgo,
        oneWeekAgo,
        oneMonthAgo,
        oneYearAgo,
      }
    },
    template: `
      <div class="space-y-3">
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">Just now:</span>
          <RelativeTime :date="justNow" class="font-medium" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">1 minute ago:</span>
          <RelativeTime :date="oneMinuteAgo" class="font-medium" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">5 minutes ago:</span>
          <RelativeTime :date="fiveMinutesAgo" class="font-medium" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">1 hour ago:</span>
          <RelativeTime :date="oneHourAgo" class="font-medium" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">3 days ago:</span>
          <RelativeTime :date="threeDaysAgo" class="font-medium" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">1 week ago:</span>
          <RelativeTime :date="oneWeekAgo" class="font-medium" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">1 month ago:</span>
          <RelativeTime :date="oneMonthAgo" class="font-medium" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">1 year ago:</span>
          <RelativeTime :date="oneYearAgo" class="font-medium" />
        </div>
      </div>
    `,
  }),
}

export const FutureDates: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const inFiveMinutes = new Date(Date.now() + 5 * 60 * 1000)
      const inOneHour = new Date(Date.now() + 1 * 60 * 60 * 1000)
      const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      const inOneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      return { inFiveMinutes, inOneHour, inThreeDays, inOneWeek }
    },
    template: `
      <div class="space-y-3">
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">In 5 minutes:</span>
          <RelativeTime :date="inFiveMinutes" class="font-medium text-blue-600" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">In 1 hour:</span>
          <RelativeTime :date="inOneHour" class="font-medium text-blue-600" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">In 3 days:</span>
          <RelativeTime :date="inThreeDays" class="font-medium text-blue-600" />
        </div>
        <div class="flex items-center justify-between rounded-lg border p-3">
          <span class="text-sm text-muted-foreground">In 1 week:</span>
          <RelativeTime :date="inOneWeek" class="font-medium text-blue-600" />
        </div>
      </div>
    `,
  }),
}

export const DifferentFormats: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const timestamp = Date.now() - 2 * 60 * 60 * 1000
      const dateObject = new Date(timestamp)
      const isoString = dateObject.toISOString()

      return { timestamp, dateObject, isoString }
    },
    template: `
      <div class="space-y-3">
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">Date Object:</div>
          <RelativeTime :date="dateObject" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">ISO String:</div>
          <RelativeTime :date="isoString" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">Timestamp (milliseconds):</div>
          <RelativeTime :date="timestamp" class="text-muted-foreground" />
        </div>
      </div>
    `,
  }),
}

export const Localization: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)

      return { twoHoursAgo }
    },
    template: `
      <div class="space-y-3">
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">English (US):</div>
          <RelativeTime :date="twoHoursAgo" locale="en-US" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">Spanish (Spain):</div>
          <RelativeTime :date="twoHoursAgo" locale="es-ES" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">French (France):</div>
          <RelativeTime :date="twoHoursAgo" locale="fr-FR" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">German (Germany):</div>
          <RelativeTime :date="twoHoursAgo" locale="de-DE" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">Japanese (Japan):</div>
          <RelativeTime :date="twoHoursAgo" locale="ja-JP" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">Chinese (Simplified):</div>
          <RelativeTime :date="twoHoursAgo" locale="zh-CN" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">Arabic (Saudi Arabia):</div>
          <RelativeTime :date="twoHoursAgo" locale="ar-SA" class="text-muted-foreground" />
        </div>
      </div>
    `,
  }),
}

export const InComments: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
      const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

      return { twoHoursAgo, oneHourAgo, thirtyMinutesAgo }
    },
    template: `
      <div class="w-full max-w-2xl space-y-4">
        <div class="rounded-lg border p-4">
          <div class="mb-2 flex items-center justify-between">
            <div class="font-semibold">Alice Johnson</div>
            <RelativeTime :date="twoHoursAgo" class="text-xs text-muted-foreground" />
          </div>
          <p class="text-sm text-muted-foreground">
            This is a great component! I really like how it handles relative time formatting.
          </p>
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 flex items-center justify-between">
            <div class="font-semibold">Bob Smith</div>
            <RelativeTime :date="oneHourAgo" class="text-xs text-muted-foreground" />
          </div>
          <p class="text-sm text-muted-foreground">
            Agreed! The auto-update feature is really useful for live applications.
          </p>
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 flex items-center justify-between">
            <div class="font-semibold">Carol Williams</div>
            <RelativeTime :date="thirtyMinutesAgo" class="text-xs text-muted-foreground" />
          </div>
          <p class="text-sm text-muted-foreground">
            The customization options are fantastic. Very flexible component!
          </p>
        </div>
      </div>
    `,
  }),
}

export const LiveUpdating: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const startTime = ref(new Date())

      return { startTime }
    },
    template: `
      <div class="space-y-4 rounded-lg border p-6">
        <div class="text-sm font-medium">Live Timer (updates every 1 second):</div>
        <div class="text-2xl font-bold">
          <RelativeTime :date="startTime" :auto-update="true" :update-interval="1000" />
        </div>
        <p class="text-xs text-muted-foreground">
          This demonstrates the auto-update feature with a 1-second interval
        </p>
      </div>
    `,
  }),
}

export const InActivityFeed: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const activities = [
        {
          user: 'Alice',
          action: 'created a new project',
          time: new Date(Date.now() - 10 * 60 * 1000),
        },
        {
          user: 'Bob',
          action: 'commented on issue #123',
          time: new Date(Date.now() - 25 * 60 * 1000),
        },
        {
          user: 'Carol',
          action: 'merged pull request #456',
          time: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          user: 'David',
          action: 'opened issue #789',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          user: 'Eve',
          action: 'pushed 3 commits',
          time: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
      ]

      return { activities }
    },
    template: `
      <div class="w-full max-w-md space-y-2">
        <div class="mb-4 text-lg font-semibold">Recent Activity</div>
        <div v-for="(activity, index) in activities" :key="index" class="flex items-start gap-3 rounded-lg border p-3">
          <div class="flex-1">
            <span class="font-medium">{{ activity.user }}</span>
            <span class="text-sm text-muted-foreground"> {{ activity.action }}</span>
          </div>
          <RelativeTime :date="activity.time" class="text-xs text-muted-foreground whitespace-nowrap" />
        </div>
      </div>
    `,
  }),
}

export const WithDifferentElements: Story = {
  render: () => ({
    components: { RelativeTime },
    setup() {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000)
      return { date }
    },
    template: `
      <div class="space-y-3">
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">Default (time element):</div>
          <RelativeTime :date="date" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">As span element:</div>
          <RelativeTime :date="date" as="span" class="text-muted-foreground" />
        </div>
        <div class="rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">As div element:</div>
          <RelativeTime :date="date" as="div" class="text-muted-foreground" />
        </div>
      </div>
    `,
  }),
}
