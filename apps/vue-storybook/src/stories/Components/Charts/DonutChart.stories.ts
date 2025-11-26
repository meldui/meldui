import type { MeldDonutChartConfig } from '@meldui/charts-vue'
import { MeldDonutChart } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof MeldDonutChart> = {
  title: 'Components/Charts/DonutChart',
  component: MeldDonutChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Donut charts are similar to pie charts but with a hollow center. Perfect for showing percentage distributions with a focus area in the middle for totals or key metrics.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldDonutChart>

export const Default: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'Desktop', data: [44] },
          { name: 'Mobile', data: [55] },
          { name: 'Tablet', data: [13] },
        ],
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldDonutChart :config="config" title="Traffic by Device" />
    `,
  }),
}

export const BrowserShare: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'Chrome', data: [65.52] },
          { name: 'Safari', data: [18.33] },
          { name: 'Edge', data: [5.21] },
          { name: 'Firefox', data: [3.19] },
          { name: 'Opera', data: [2.44] },
          { name: 'Other', data: [5.31] },
        ],
        legend: {
          position: 'right',
        },
        colors: 'vibrant',
      }
      return { config }
    },
    template: `
      <MeldDonutChart :config="config" title="Browser Market Share" :height="400" />
    `,
  }),
}

export const ProjectStatus: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'Completed', data: [45] },
          { name: 'In Progress', data: [30] },
          { name: 'Planned', data: [15] },
          { name: 'On Hold', data: [10] },
        ],
        colors: 'accessible',
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldDonutChart :config="config" title="Project Status Distribution" />
    `,
  }),
}

export const RevenueByRegion: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'North America', data: [42.5] },
          { name: 'Europe', data: [28.3] },
          { name: 'Asia Pacific', data: [19.8] },
          { name: 'Latin America', data: [6.2] },
          { name: 'Middle East & Africa', data: [3.2] },
        ],
        colors: 'corporate',
        legend: {
          position: 'right',
        },
      }
      return { config }
    },
    template: `
      <MeldDonutChart :config="config" title="Global Revenue Distribution" :height="400" />
    `,
  }),
}

export const SimpleTwoSegments: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'Achieved', data: [75] },
          { name: 'Remaining', data: [25] },
        ],
        colors: 'ocean',
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldDonutChart :config="config" title="Goal Progress" />
    `,
  }),
}

export const ExpenseBreakdown: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'Salaries', data: [45] },
          { name: 'Infrastructure', data: [25] },
          { name: 'Marketing', data: [15] },
          { name: 'R&D', data: [10] },
          { name: 'Other', data: [5] },
        ],
        colors: 'sunset',
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldDonutChart :config="config" title="Monthly Expense Breakdown" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'A', data: [44] },
          { name: 'B', data: [55] },
          { name: 'C', data: [13] },
        ],
      }
      return { config }
    },
    template: `
      <MeldDonutChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'A', data: [44] },
          { name: 'B', data: [55] },
          { name: 'C', data: [13] },
        ],
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
          <MeldDonutChart :config="config" :height="250" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Medium (350px - default)</h3>
          <MeldDonutChart :config="config" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Large (500px)</h3>
          <MeldDonutChart :config="config" :height="500" />
        </div>
      </div>
    `,
  }),
}

export const CustomerSegmentation: Story = {
  render: () => ({
    components: { MeldDonutChart },
    setup() {
      const config: MeldDonutChartConfig = {
        series: [
          { name: 'Enterprise', data: [35] },
          { name: 'Mid-Market', data: [30] },
          { name: 'Small Business', data: [20] },
          { name: 'Startup', data: [15] },
        ],
        colors: 'earth',
        legend: {
          position: 'right',
        },
      }
      return { config }
    },
    template: `
      <MeldDonutChart :config="config" title="Customer Segmentation" :height="400" />
    `,
  }),
}
