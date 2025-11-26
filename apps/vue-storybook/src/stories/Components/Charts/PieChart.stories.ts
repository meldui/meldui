import type { MeldPieChartConfig } from '@meldui/charts-vue'
import { MeldPieChart } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof MeldPieChart> = {
  title: 'Components/Charts/PieChart',
  component: MeldPieChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pie charts display data as slices of a circle, with each slice representing a proportion of the whole. Perfect for showing percentage distributions and composition.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldPieChart>

export const Default: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
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
      <MeldPieChart :config="config" title="Traffic by Device" />
    `,
  }),
}

export const MarketShare: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
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
      }
      return { config }
    },
    template: `
      <MeldPieChart :config="config" title="Browser Market Share" :height="400" />
    `,
  }),
}

export const WithCustomColors: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
        series: [
          { name: 'Completed', data: [65] },
          { name: 'In Progress', data: [25] },
          { name: 'Pending', data: [10] },
        ],
        colors: 'accessible',
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldPieChart :config="config" title="Task Status" />
    `,
  }),
}

export const SimpleTwoSlices: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
        series: [
          { name: 'Pass', data: [85] },
          { name: 'Fail', data: [15] },
        ],
        colors: 'accessible',
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldPieChart :config="config" title="Test Results" />
    `,
  }),
}

export const ManySlices: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
        series: [
          { name: 'Electronics', data: [18] },
          { name: 'Clothing', data: [22] },
          { name: 'Home & Garden', data: [15] },
          { name: 'Sports', data: [12] },
          { name: 'Books', data: [8] },
          { name: 'Toys', data: [10] },
          { name: 'Food', data: [7] },
          { name: 'Other', data: [8] },
        ],
        legend: {
          position: 'right',
        },
      }
      return { config }
    },
    template: `
      <MeldPieChart :config="config" title="Sales by Category" :height="450" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
        series: [
          { name: 'A', data: [44] },
          { name: 'B', data: [55] },
          { name: 'C', data: [13] },
        ],
      }
      return { config }
    },
    template: `
      <MeldPieChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const RevenueDistribution: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
        series: [
          { name: 'North America', data: [42.5] },
          { name: 'Europe', data: [28.3] },
          { name: 'Asia Pacific', data: [19.8] },
          { name: 'Latin America', data: [6.2] },
          { name: 'Middle East & Africa', data: [3.2] },
        ],
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldPieChart :config="config" title="Global Revenue Distribution" />
    `,
  }),
}

export const BudgetAllocation: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
        series: [
          { name: 'Marketing', data: [30] },
          { name: 'Development', data: [40] },
          { name: 'Operations', data: [15] },
          { name: 'Sales', data: [10] },
          { name: 'HR', data: [5] },
        ],
        colors: 'corporate',
        legend: {
          position: 'right',
        },
      }
      return { config }
    },
    template: `
      <MeldPieChart :config="config" title="Department Budget Allocation" :height="400" />
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { MeldPieChart },
    setup() {
      const config: MeldPieChartConfig = {
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
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3>Small (250px)</h3>
          <MeldPieChart :config="config" :height="250" />
        </div>
        <div>
          <h3>Medium (350px - default)</h3>
          <MeldPieChart :config="config" />
        </div>
        <div>
          <h3>Large (500px)</h3>
          <MeldPieChart :config="config" :height="500" />
        </div>
      </div>
    `,
  }),
}
