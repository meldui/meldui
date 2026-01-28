import type { MeldScatterChartConfig } from '@meldui/charts-vue'
import { MeldScatterChart } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof MeldScatterChart> = {
  title: 'Components/Charts/ScatterChart',
  component: MeldScatterChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Scatter charts display data as points on a two-dimensional graph. Perfect for showing correlations, distributions, and relationships between variables.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldScatterChart>

function generateHeightWeightData() {
  const data = []
  for (let i = 0; i < 50; i++) {
    const height = 150 + Math.random() * 50
    const weight = 50 + Math.random() * 40
    data.push({ x: height, y: weight })
  }
  return data
}

function generateLargeScatterDataset() {
  const data = []
  for (let i = 0; i < 200; i++) {
    data.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
    })
  }
  return data
}

export const Default: Story = {
  render: () => ({
    components: { MeldScatterChart },
    setup() {
      const config: MeldScatterChartConfig = {
        series: [
          {
            name: 'Dataset 1',
            data: [
              { x: 10, y: 20 },
              { x: 15, y: 30 },
              { x: 20, y: 25 },
              { x: 25, y: 35 },
              { x: 30, y: 40 },
              { x: 35, y: 38 },
              { x: 40, y: 45 },
            ],
          },
        ],
        xAxis: {
          type: 'numeric',
          title: 'Variable X',
        },
        yAxis: {
          type: 'numeric',
          title: 'Variable Y',
        },
      }
      return { config }
    },
    template: `
      <MeldScatterChart :config="config" title="Simple Scatter Plot" />
    `,
  }),
}

export const MultipleSeries: Story = {
  render: () => ({
    components: { MeldScatterChart },
    setup() {
      const config: MeldScatterChartConfig = {
        series: [
          {
            name: 'Group A',
            data: [
              { x: 10, y: 20 },
              { x: 15, y: 25 },
              { x: 20, y: 30 },
              { x: 25, y: 28 },
              { x: 30, y: 35 },
            ],
          },
          {
            name: 'Group B',
            data: [
              { x: 12, y: 40 },
              { x: 18, y: 45 },
              { x: 22, y: 50 },
              { x: 28, y: 48 },
              { x: 32, y: 55 },
            ],
          },
          {
            name: 'Group C',
            data: [
              { x: 14, y: 15 },
              { x: 19, y: 18 },
              { x: 24, y: 22 },
              { x: 29, y: 20 },
              { x: 34, y: 25 },
            ],
          },
        ],
        xAxis: {
          type: 'numeric',
          title: 'Feature 1',
        },
        yAxis: {
          type: 'numeric',
          title: 'Feature 2',
        },
        legend: {
          position: 'bottom',
        },
        colors: 'vibrant',
      }
      return { config }
    },
    template: `
      <MeldScatterChart :config="config" title="Multi-Group Scatter Plot" />
    `,
  }),
}

export const HeightVsWeight: Story = {
  render: () => ({
    components: { MeldScatterChart },
    setup() {
      const config: MeldScatterChartConfig = {
        series: [
          {
            name: 'Measurements',
            data: generateHeightWeightData(),
          },
        ],
        xAxis: {
          type: 'numeric',
          title: 'Height (cm)',
          min: 140,
          max: 210,
        },
        yAxis: {
          type: 'numeric',
          title: 'Weight (kg)',
          min: 40,
          max: 100,
        },
        legend: { show: false },
        colors: 'ocean',
      }
      return { config }
    },
    template: `
      <MeldScatterChart :config="config" title="Height vs Weight Correlation" :height="400" />
    `,
  }),
}

export const SalesAnalysis: Story = {
  render: () => ({
    components: { MeldScatterChart },
    setup() {
      const config: MeldScatterChartConfig = {
        series: [
          {
            name: 'Q1',
            data: [
              { x: 100, y: 50 },
              { x: 150, y: 75 },
              { x: 200, y: 100 },
              { x: 250, y: 125 },
              { x: 300, y: 150 },
            ],
          },
          {
            name: 'Q2',
            data: [
              { x: 120, y: 60 },
              { x: 170, y: 85 },
              { x: 220, y: 110 },
              { x: 270, y: 135 },
              { x: 320, y: 160 },
            ],
          },
          {
            name: 'Q3',
            data: [
              { x: 110, y: 55 },
              { x: 160, y: 80 },
              { x: 210, y: 105 },
              { x: 260, y: 130 },
              { x: 310, y: 155 },
            ],
          },
          {
            name: 'Q4',
            data: [
              { x: 130, y: 65 },
              { x: 180, y: 90 },
              { x: 230, y: 115 },
              { x: 280, y: 140 },
              { x: 330, y: 165 },
            ],
          },
        ],
        xAxis: {
          type: 'numeric',
          title: 'Marketing Spend ($1000s)',
        },
        yAxis: {
          type: 'numeric',
          title: 'Revenue ($1000s)',
        },
        legend: {
          position: 'bottom',
        },
        colors: 'corporate',
      }
      return { config }
    },
    template: `
      <MeldScatterChart :config="config" title="Marketing Spend vs Revenue by Quarter" :height="450" />
    `,
  }),
}

export const LargeDataset: Story = {
  render: () => ({
    components: { MeldScatterChart },
    setup() {
      const config: MeldScatterChartConfig = {
        series: [
          {
            name: 'Data Points',
            data: generateLargeScatterDataset(),
          },
        ],
        xAxis: {
          type: 'numeric',
        },
        yAxis: {
          type: 'numeric',
        },
        legend: { show: false },
        colors: 'accessible',
      }
      return { config }
    },
    template: `
      <MeldScatterChart :config="config" title="Large Dataset (200 points)" :height="400" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldScatterChart },
    setup() {
      const config: MeldScatterChartConfig = {
        series: [
          {
            name: 'Data',
            data: [
              { x: 10, y: 20 },
              { x: 20, y: 30 },
              { x: 30, y: 40 },
            ],
          },
        ],
        xAxis: {
          type: 'numeric',
        },
        yAxis: {
          type: 'numeric',
        },
      }
      return { config }
    },
    template: `
      <MeldScatterChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { MeldScatterChart },
    setup() {
      const config: MeldScatterChartConfig = {
        series: [
          {
            name: 'Data',
            data: [
              { x: 10, y: 20 },
              { x: 20, y: 30 },
              { x: 30, y: 40 },
              { x: 40, y: 35 },
              { x: 50, y: 50 },
            ],
          },
        ],
        xAxis: {
          type: 'numeric',
        },
        yAxis: {
          type: 'numeric',
        },
        legend: { show: false },
      }
      return { config }
    },
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-medium mb-4">Small (250px)</h3>
          <MeldScatterChart :config="config" :height="250" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Medium (350px - default)</h3>
          <MeldScatterChart :config="config" />
        </div>
        <div>
          <h3 class="text-lg font-medium mb-4">Large (500px)</h3>
          <MeldScatterChart :config="config" :height="500" />
        </div>
      </div>
    `,
  }),
}
