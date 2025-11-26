import type { MeldMixedChartConfig } from '@meldui/charts-vue'
import { MeldMixedChart } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof MeldMixedChart> = {
  title: 'Components/Charts/MixedChart',
  component: MeldMixedChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mixed charts combine different visualization types (line, bar, area) in a single chart. Perfect for comparing different metrics with varying magnitudes or showing relationships between data sets.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldMixedChart>

export const LineAndBar: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Revenue',
            type: 'bar',
            data: [30, 40, 45, 50, 49, 60, 70],
          },
          {
            name: 'Growth Rate',
            type: 'line',
            data: [20, 25, 28, 30, 32, 35, 38],
          },
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
      <MeldMixedChart :config="config" title="Revenue and Growth Rate" />
    `,
  }),
}

export const AreaAndLine: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Total Users',
            type: 'area',
            data: [100, 150, 200, 250, 300, 350, 400],
          },
          {
            name: 'Active Users',
            type: 'line',
            data: [80, 120, 160, 200, 240, 280, 320],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'bottom',
        },
        colors: 'ocean',
      }
      return { config }
    },
    template: `
      <MeldMixedChart :config="config" title="User Metrics" />
    `,
  }),
}

export const TripleCombo: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Sales',
            type: 'bar',
            data: [50, 60, 55, 70, 65, 80, 75],
          },
          {
            name: 'Forecast',
            type: 'area',
            data: [45, 55, 60, 65, 70, 75, 80],
          },
          {
            name: 'Target',
            type: 'line',
            data: [60, 60, 60, 60, 60, 60, 60],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'bottom',
        },
        colors: 'corporate',
      }
      return { config }
    },
    template: `
      <MeldMixedChart :config="config" title="Sales Performance vs Forecast" />
    `,
  }),
}

export const FinancialDashboard: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Revenue',
            type: 'bar',
            data: [120, 140, 135, 160, 155, 180, 175, 190, 185, 200, 210, 220],
          },
          {
            name: 'Profit',
            type: 'bar',
            data: [40, 50, 45, 60, 55, 70, 65, 75, 70, 80, 85, 90],
          },
          {
            name: 'Profit Margin %',
            type: 'line',
            data: [33, 36, 33, 38, 35, 39, 37, 39, 38, 40, 40, 41],
          },
        ],
        xAxis: {
          categories: [
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
          ],
        },
        legend: {
          position: 'bottom',
        },
        colors: 'vibrant',
      }
      return { config }
    },
    template: `
      <MeldMixedChart :config="config" title="Annual Financial Performance" :height="450" />
    `,
  }),
}

export const WeatherData: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Temperature (°C)',
            type: 'line',
            data: [18, 20, 22, 24, 26, 28, 27],
          },
          {
            name: 'Rainfall (mm)',
            type: 'bar',
            data: [5, 2, 8, 12, 6, 3, 10],
          },
          {
            name: 'Humidity %',
            type: 'area',
            data: [60, 55, 65, 70, 68, 62, 67],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'bottom',
        },
        colors: 'earth',
        stroke: {
          curve: 'smooth',
        },
      }
      return { config }
    },
    template: `
      <MeldMixedChart :config="config" title="Weekly Weather Forecast" :height="400" />
    `,
  }),
}

export const EcommerceMetrics: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Orders',
            type: 'bar',
            data: [150, 180, 165, 200, 195, 220, 210],
          },
          {
            name: 'Conversion Rate %',
            type: 'line',
            data: [3.5, 3.8, 3.6, 4.0, 3.9, 4.2, 4.1],
          },
          {
            name: 'Visitors',
            type: 'area',
            data: [4000, 4500, 4200, 5000, 4800, 5200, 5100],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'bottom',
        },
        colors: 'sunset',
      }
      return { config }
    },
    template: `
      <MeldMixedChart :config="config" title="E-commerce Performance" :height="400" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Bar',
            type: 'bar',
            data: [30, 40, 45],
          },
          {
            name: 'Line',
            type: 'line',
            data: [20, 25, 28],
          },
        ],
        xAxis: {
          categories: ['A', 'B', 'C'],
        },
      }
      return { config }
    },
    template: `
      <MeldMixedChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Sales',
            type: 'bar',
            data: [30, 40, 45, 50, 49, 60, 70],
          },
          {
            name: 'Target',
            type: 'line',
            data: [45, 45, 45, 45, 45, 45, 45],
          },
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
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-medium mb-4">Small (250px)</h3>
          <MeldMixedChart :config="config" :height="250" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Medium (350px - default)</h3>
          <MeldMixedChart :config="config" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Large (500px)</h3>
          <MeldMixedChart :config="config" :height="500" />
        </div>
      </div>
    `,
  }),
}

export const DualAxisBarAndLine: Story = {
  render: () => ({
    components: { MeldMixedChart },
    setup() {
      const config: MeldMixedChartConfig = {
        series: [
          {
            name: 'Revenue',
            type: 'bar',
            data: [120, 200, 150, 180, 220, 190, 250],
          },
          {
            name: 'Growth %',
            type: 'line',
            data: [15, 22, 18, 20, 25, 21, 28],
          },
        ],
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        stroke: {
          curve: 'smooth',
        },
        legend: {
          position: 'top',
        },
        // Use advanced config for dual Y-axes
        advanced: {
          yAxis: [
            {
              type: 'value',
              name: 'Revenue ($K)',
              position: 'left',
              axisLabel: {
                formatter: '${value}',
                color: 'hsl(var(--muted-foreground))',
                fontSize: 14,
              },
              nameTextStyle: {
                color: 'hsl(var(--muted-foreground))',
                fontSize: 12,
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(128, 128, 128, 0.25)',
                  type: 'dashed',
                },
              },
            },
            {
              type: 'value',
              name: 'Growth Rate (%)',
              position: 'right',
              axisLabel: {
                formatter: '{value}%',
                color: 'hsl(var(--muted-foreground))',
                fontSize: 14,
              },
              nameTextStyle: {
                color: 'hsl(var(--muted-foreground))',
                fontSize: 12,
              },
              splitLine: {
                show: false, // Hide second axis grid lines
              },
            },
          ],
          series: [
            {
              name: 'Revenue',
              data: [120, 200, 150, 180, 220, 190, 250],
              type: 'bar',
              yAxisIndex: 0,
            },
            {
              name: 'Growth %',
              data: [15, 22, 18, 20, 25, 21, 28],
              type: 'line',
              smooth: true,
              yAxisIndex: 1,
            },
          ],
        },
      }
      return { config }
    },
    template: `
      <MeldMixedChart :config="config" title="Revenue and Growth Rate (Dual Y-Axis)" />
    `,
  }),
}
