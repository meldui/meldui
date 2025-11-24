import type { MeldChartConfig } from '@meldui/charts-vue'
import { MeldAreaChart } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof MeldAreaChart> = {
  title: 'Components/Charts/AreaChart',
  component: MeldAreaChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Area charts are similar to line charts but with the area below the line filled with color. Great for showing cumulative totals and volume over time.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldAreaChart>

export const Default: Story = {
  render: () => ({
    components: { MeldAreaChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Users', data: [100, 150, 200, 250, 300, 350, 400] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }
      return { config }
    },
    template: `
      <MeldAreaChart :config="config" title="User Growth" />
    `,
  }),
}

export const MultipleSeries: Story = {
  render: () => ({
    components: { MeldAreaChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Desktop', data: [100, 120, 150, 180, 200, 220, 250] },
          { name: 'Mobile', data: [50, 70, 90, 110, 130, 150, 180] },
          { name: 'Tablet', data: [30, 40, 50, 60, 70, 80, 90] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldAreaChart :config="config" title="Traffic by Device" />
    `,
  }),
}

export const StackedArea: Story = {
  render: () => ({
    components: { MeldAreaChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Organic', data: [120, 132, 151, 134, 190, 230, 210] },
          { name: 'Direct', data: [85, 91, 94, 99, 103, 109, 115] },
          { name: 'Social', data: [40, 45, 52, 48, 61, 75, 81] },
          { name: 'Referral', data: [20, 25, 31, 29, 38, 42, 49] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        stacked: true,
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldAreaChart :config="config" title="Traffic Sources (Stacked)" />
    `,
  }),
}

export const SmoothArea: Story = {
  render: () => ({
    components: { MeldAreaChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Temperature', data: [18, 21, 24, 27, 25, 22, 20] },
          { name: 'Humidity', data: [55, 60, 65, 68, 63, 58, 56] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
      }
      return { config }
    },
    template: `
      <MeldAreaChart :config="config" title="Weather Conditions" />
    `,
  }),
}

export const WithCustomColors: Story = {
  render: () => ({
    components: { MeldAreaChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Series A', data: [30, 40, 35, 50, 49, 60, 70] },
          { name: 'Series B', data: [20, 30, 45, 40, 39, 50, 55] },
        ],
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        colors: 'vibrant',
      }
      return { config }
    },
    template: `
      <MeldAreaChart :config="config" title="Vibrant Palette" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldAreaChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Data', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }
      return { config }
    },
    template: `
      <MeldAreaChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const TimeSeriesData: Story = {
  render: () => ({
    components: { MeldAreaChart },
    setup() {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      const config: MeldChartConfig = {
        series: [
          {
            name: '2023 Revenue',
            data: [45, 52, 58, 62, 68, 75, 82, 88, 95, 102, 108, 115],
          },
          {
            name: '2024 Revenue',
            data: [50, 58, 65, 72, 78, 85, 92, 98, 105, 112, 118, 125],
          },
        ],
        xAxis: {
          categories: months,
        },
        stroke: {
          curve: 'smooth',
        },
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldAreaChart :config="config" title="Annual Revenue Comparison" :height="400" />
    `,
  }),
}

export const SingleDataPoint: Story = {
  render: () => ({
    components: { MeldAreaChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Value', data: [100] }],
        xAxis: {
          categories: ['Today'],
        },
      }
      return { config }
    },
    template: `
      <MeldAreaChart :config="config" title="Single Data Point" />
    `,
  }),
}
