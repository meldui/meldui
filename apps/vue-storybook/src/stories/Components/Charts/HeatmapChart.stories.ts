import type { MeldHeatmapChartConfig } from '@meldui/charts-vue'
import { MeldHeatmapChart } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof MeldHeatmapChart> = {
  title: 'Components/Charts/HeatmapChart',
  component: MeldHeatmapChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Heatmap charts use color intensity to represent data values in a two-dimensional grid. Perfect for showing patterns, correlations, and density across time or categories.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldHeatmapChart>

export const Default: Story = {
  render: () => ({
    components: { MeldHeatmapChart },
    setup() {
      const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a']
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

      const data = []
      for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < hours.length; j++) {
          data.push([j, i, Math.floor(Math.random() * 100)])
        }
      }

      const config: MeldHeatmapChartConfig = {
        series: [
          {
            name: 'Activity',
            data,
          },
        ],
        xAxis: {
          categories: hours,
        },
        yAxis: {
          categories: days,
        },
      }
      return { config }
    },
    template: `
      <MeldHeatmapChart :config="config" title="User Activity Heatmap" :height="400" />
    `,
  }),
}

export const WebsiteTraffic: Story = {
  render: () => ({
    components: { MeldHeatmapChart },
    setup() {
      const hours = [
        '12am',
        '1am',
        '2am',
        '3am',
        '4am',
        '5am',
        '6am',
        '7am',
        '8am',
        '9am',
        '10am',
        '11am',
        '12pm',
        '1pm',
        '2pm',
        '3pm',
        '4pm',
        '5pm',
        '6pm',
        '7pm',
        '8pm',
        '9pm',
        '10pm',
        '11pm',
      ]
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

      const generateData = () => {
        const data = []
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < hours.length; j++) {
            let value = Math.floor(Math.random() * 50)
            // Peak hours (9am-5pm weekdays)
            if (i >= 1 && i <= 5 && j >= 9 && j <= 17) {
              value += 50
            }
            data.push([j, i, value])
          }
        }
        return data
      }

      const config: MeldHeatmapChartConfig = {
        series: [
          {
            name: 'Visits',
            data: generateData(),
          },
        ],
        xAxis: {
          categories: hours,
        },
        yAxis: {
          categories: days,
        },
        colors: 'ocean',
      }
      return { config }
    },
    template: `
      <MeldHeatmapChart :config="config" title="Website Traffic by Hour" :height="300" />
    `,
  }),
}

export const SalesHeatmap: Story = {
  render: () => ({
    components: { MeldHeatmapChart },
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
      const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys']

      const data = []
      for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < months.length; j++) {
          const value = Math.floor(Math.random() * 100)
          data.push([j, i, value])
        }
      }

      const config: MeldHeatmapChartConfig = {
        series: [
          {
            name: 'Sales',
            data,
          },
        ],
        xAxis: {
          categories: months,
        },
        yAxis: {
          categories,
        },
        colors: 'sunset',
      }
      return { config }
    },
    template: `
      <MeldHeatmapChart :config="config" title="Sales by Category and Month" :height="350" />
    `,
  }),
}

export const PerformanceMatrix: Story = {
  render: () => ({
    components: { MeldHeatmapChart },
    setup() {
      const servers = ['Server 1', 'Server 2', 'Server 3', 'Server 4', 'Server 5']
      const metrics = ['CPU', 'Memory', 'Disk', 'Network', 'Latency']

      const data = []
      for (let i = 0; i < metrics.length; i++) {
        for (let j = 0; j < servers.length; j++) {
          const value = 50 + Math.floor(Math.random() * 50)
          data.push([j, i, value])
        }
      }

      const config: MeldHeatmapChartConfig = {
        series: [
          {
            name: 'Usage %',
            data,
          },
        ],
        xAxis: {
          categories: servers,
        },
        yAxis: {
          categories: metrics,
        },
        colors: 'corporate',
      }
      return { config }
    },
    template: `
      <MeldHeatmapChart :config="config" title="Server Performance Matrix" :height="350" />
    `,
  }),
}

export const CorrelationMatrix: Story = {
  render: () => ({
    components: { MeldHeatmapChart },
    setup() {
      const variables = ['Revenue', 'Marketing', 'Sales', 'Support', 'Development']

      const data = []
      for (let i = 0; i < variables.length; i++) {
        for (let j = 0; j < variables.length; j++) {
          let value: number
          if (i === j) {
            value = 100 // Perfect correlation with itself
          } else {
            value = 50 + Math.floor(Math.random() * 50)
          }
          data.push([j, i, value])
        }
      }

      const config: MeldHeatmapChartConfig = {
        series: [
          {
            name: 'Correlation',
            data,
          },
        ],
        xAxis: {
          categories: variables,
        },
        yAxis: {
          categories: variables,
        },
        colors: 'vibrant',
      }
      return { config }
    },
    template: `
      <MeldHeatmapChart :config="config" title="Variable Correlation Matrix" :height="400" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldHeatmapChart },
    setup() {
      const config: MeldHeatmapChartConfig = {
        series: [
          {
            name: 'Data',
            data: [
              [0, 0, 10],
              [1, 0, 20],
              [2, 0, 30],
            ],
          },
        ],
        xAxis: {
          categories: ['A', 'B', 'C'],
        },
        yAxis: {
          categories: ['X'],
        },
      }
      return { config }
    },
    template: `
      <MeldHeatmapChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { MeldHeatmapChart },
    setup() {
      const hours = ['9am', '10am', '11am', '12pm', '1pm', '2pm']
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

      const data = []
      for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < hours.length; j++) {
          data.push([j, i, Math.floor(Math.random() * 100)])
        }
      }

      const config: MeldHeatmapChartConfig = {
        series: [
          {
            name: 'Activity',
            data,
          },
        ],
        xAxis: {
          categories: hours,
        },
        yAxis: {
          categories: days,
        },
      }
      return { config }
    },
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-medium mb-4">Small (250px)</h3>
          <MeldHeatmapChart :config="config" :height="250" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Medium (350px - default)</h3>
          <MeldHeatmapChart :config="config" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Large (500px)</h3>
          <MeldHeatmapChart :config="config" :height="500" />
        </div>
      </div>
    `,
  }),
}
