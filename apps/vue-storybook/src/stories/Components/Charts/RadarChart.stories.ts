import type { MeldRadarChartConfig } from '@meldui/charts-vue'
import { MeldRadarChart } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof MeldRadarChart> = {
  title: 'Components/Charts/RadarChart',
  component: MeldRadarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Radar charts (also known as spider or web charts) display multivariate data on axes starting from the same point. Perfect for comparing multiple variables across different categories.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldRadarChart>

export const Default: Story = {
  render: () => ({
    components: { MeldRadarChart },
    setup() {
      const config: MeldRadarChartConfig = {
        series: [
          {
            name: 'Product A',
            data: [80, 90, 70, 85, 75],
          },
        ],
        xAxis: {
          categories: ['Quality', 'Performance', 'Price', 'Design', 'Support'],
        },
        yAxis: {
          max: 100,
        },
      }
      return { config }
    },
    template: `
      <MeldRadarChart :config="config" title="Product Evaluation" />
    `,
  }),
}

export const Comparison: Story = {
  render: () => ({
    components: { MeldRadarChart },
    setup() {
      const config: MeldRadarChartConfig = {
        series: [
          {
            name: 'Product A',
            data: [80, 90, 70, 85, 75, 88],
          },
          {
            name: 'Product B',
            data: [70, 85, 90, 75, 80, 82],
          },
        ],
        xAxis: {
          categories: ['Quality', 'Performance', 'Price', 'Design', 'Support', 'Features'],
        },
        yAxis: {
          max: 100,
        },
        legend: {
          position: 'bottom',
        },
        colors: 'vibrant',
      }
      return { config }
    },
    template: `
      <MeldRadarChart :config="config" title="Product Comparison" />
    `,
  }),
}

export const SkillsAssessment: Story = {
  render: () => ({
    components: { MeldRadarChart },
    setup() {
      const config: MeldRadarChartConfig = {
        series: [
          {
            name: 'Candidate A',
            data: [85, 90, 75, 80, 88, 82, 78],
          },
          {
            name: 'Candidate B',
            data: [78, 85, 88, 90, 82, 85, 80],
          },
          {
            name: 'Candidate C',
            data: [82, 80, 90, 85, 80, 88, 85],
          },
        ],
        xAxis: {
          categories: ['JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js', 'Testing', 'DevOps'],
        },
        yAxis: {
          max: 100,
        },
        legend: {
          position: 'bottom',
        },
        colors: 'corporate',
      }
      return { config }
    },
    template: `
      <MeldRadarChart :config="config" title="Developer Skills Assessment" :height="450" />
    `,
  }),
}

export const TeamPerformance: Story = {
  render: () => ({
    components: { MeldRadarChart },
    setup() {
      const config: MeldRadarChartConfig = {
        series: [
          {
            name: 'Team Alpha',
            data: [92, 88, 85, 90, 87],
          },
          {
            name: 'Team Beta',
            data: [85, 92, 88, 85, 90],
          },
          {
            name: 'Team Gamma',
            data: [88, 85, 92, 87, 88],
          },
        ],
        xAxis: {
          categories: ['Communication', 'Collaboration', 'Innovation', 'Delivery', 'Quality'],
        },
        yAxis: {
          max: 100,
        },
        legend: {
          position: 'bottom',
        },
        colors: 'ocean',
      }
      return { config }
    },
    template: `
      <MeldRadarChart :config="config" title="Team Performance Metrics" :height="400" />
    `,
  }),
}

export const NutritionalValue: Story = {
  render: () => ({
    components: { MeldRadarChart },
    setup() {
      const config: MeldRadarChartConfig = {
        series: [
          {
            name: 'Apple',
            data: [20, 10, 85, 5, 15, 80],
          },
          {
            name: 'Banana',
            data: [30, 15, 75, 10, 25, 70],
          },
          {
            name: 'Orange',
            data: [15, 5, 90, 8, 20, 85],
          },
        ],
        xAxis: {
          categories: ['Calories', 'Fat', 'Vitamin C', 'Sodium', 'Carbs', 'Fiber'],
        },
        yAxis: {
          max: 100,
        },
        legend: {
          position: 'bottom',
        },
        colors: 'earth',
      }
      return { config }
    },
    template: `
      <MeldRadarChart :config="config" title="Nutritional Comparison" :height="400" />
    `,
  }),
}

export const BusinessMetrics: Story = {
  render: () => ({
    components: { MeldRadarChart },
    setup() {
      const config: MeldRadarChartConfig = {
        series: [
          {
            name: 'Q1 2024',
            data: [75, 82, 88, 90, 85, 78, 80, 88],
          },
          {
            name: 'Q2 2024',
            data: [80, 85, 90, 88, 90, 82, 85, 90],
          },
        ],
        xAxis: {
          categories: [
            'Revenue',
            'Growth',
            'Customer Satisfaction',
            'Market Share',
            'Innovation',
            'Efficiency',
            'Employee Satisfaction',
            'Profitability',
          ],
        },
        yAxis: {
          max: 100,
        },
        legend: {
          position: 'bottom',
        },
        colors: 'sunset',
      }
      return { config }
    },
    template: `
      <MeldRadarChart :config="config" title="Business Performance Dashboard" :height="450" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldRadarChart },
    setup() {
      const config: MeldRadarChartConfig = {
        series: [
          {
            name: 'Data',
            data: [80, 90, 70, 85, 75],
          },
        ],
        xAxis: {
          categories: ['A', 'B', 'C', 'D', 'E'],
        },
        yAxis: {
          max: 100,
        },
      }
      return { config }
    },
    template: `
      <MeldRadarChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { MeldRadarChart },
    setup() {
      const config: MeldRadarChartConfig = {
        series: [
          {
            name: 'Series',
            data: [80, 90, 70, 85, 75],
          },
        ],
        xAxis: {
          categories: ['A', 'B', 'C', 'D', 'E'],
        },
        yAxis: {
          max: 100,
        },
        legend: { show: false },
      }
      return { config }
    },
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-medium mb-4">Small (250px)</h3>
          <MeldRadarChart :config="config" :height="250" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Medium (350px - default)</h3>
          <MeldRadarChart :config="config" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Large (500px)</h3>
          <MeldRadarChart :config="config" :height="500" />
        </div>
      </div>
    `,
  }),
}
