import type { ChartType, MeldChartConfig } from '@meldui/charts-vue'
import { MeldChart } from '@meldui/charts-vue'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof MeldChart> = {
  title: 'Components/Charts/MeldChart',
  component: MeldChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Smart chart wrapper with dynamic type switching. Automatically lazy-loads the appropriate chart component based on the type prop. Perfect for dashboards with user-selectable chart types.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldChart>

export const DynamicType: Story = {
  render: () => ({
    components: { MeldChart, Button },
    setup() {
      const chartType = ref<ChartType>('line')
      const config: MeldChartConfig = {
        series: [
          { name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] },
          { name: 'Expenses', data: [20, 30, 35, 40, 39, 50, 60] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'bottom',
        },
      }

      const setType = (type: ChartType) => {
        chartType.value = type
      }

      return { chartType, config, setType }
    },
    template: `
      <div class="space-y-4">
        <div class="flex gap-2 flex-wrap">
          <Button
            @click="setType('line')"
            :variant="chartType === 'line' ? 'default' : 'outline'"
            size="sm"
          >
            Line Chart
          </Button>
          <Button
            @click="setType('bar')"
            :variant="chartType === 'bar' ? 'default' : 'outline'"
            size="sm"
          >
            Bar Chart
          </Button>
          <Button
            @click="setType('area')"
            :variant="chartType === 'area' ? 'default' : 'outline'"
            size="sm"
          >
            Area Chart
          </Button>
          <Button
            @click="setType('pie')"
            :variant="chartType === 'pie' ? 'default' : 'outline'"
            size="sm"
          >
            Pie Chart
          </Button>
        </div>

        <MeldChart
          :type="chartType"
          :config="config"
          title="Dynamic Chart Type"
          :height="400"
        />

        <p class="text-sm text-muted-foreground">
          Current type: <code class="bg-muted px-2 py-1 rounded">{{ chartType }}</code>
        </p>
      </div>
    `,
  }),
}

export const UserSelectionDashboard: Story = {
  render: () => ({
    components: { MeldChart, Button, Card, CardHeader, CardTitle, CardDescription, CardContent },
    setup() {
      const primaryChartType = ref<ChartType>('line')
      const secondaryChartType = ref<ChartType>('bar')

      const revenueConfig: MeldChartConfig = {
        series: [{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        colors: 'ocean',
        legend: { show: false },
      }

      const salesConfig: MeldChartConfig = {
        series: [
          { name: 'Online', data: [30, 40, 45, 50, 49, 60, 70] },
          { name: 'In-Store', data: [20, 25, 30, 35, 32, 40, 45] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'bottom',
        },
      }

      const chartTypes: ChartType[] = ['line', 'bar', 'area', 'pie']

      return {
        primaryChartType,
        secondaryChartType,
        revenueConfig,
        salesConfig,
        chartTypes,
      }
    },
    template: `
      <div class="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs">View as:</span>
                <select
                  v-model="primaryChartType"
                  class="text-xs border rounded px-2 py-1"
                >
                  <option v-for="type in chartTypes" :key="type" :value="type">
                    {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                  </option>
                </select>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeldChart
              :type="primaryChartType"
              :config="revenueConfig"
              :height="300"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Comparison</CardTitle>
            <CardDescription>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs">View as:</span>
                <select
                  v-model="secondaryChartType"
                  class="text-xs border rounded px-2 py-1"
                >
                  <option v-for="type in chartTypes" :key="type" :value="type">
                    {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                  </option>
                </select>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeldChart
              :type="secondaryChartType"
              :config="salesConfig"
              :height="300"
            />
          </CardContent>
        </Card>
      </div>
    `,
  }),
}

export const LazyLoadingDemo: Story = {
  render: () => ({
    components: { MeldChart, Button },
    setup() {
      const showChart = ref(false)
      const chartType = ref<ChartType>('line')
      const config: MeldChartConfig = {
        series: [{ name: 'Data', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }

      const loadChart = (type: ChartType) => {
        showChart.value = false
        chartType.value = type
        // Small delay to demonstrate lazy loading
        setTimeout(() => {
          showChart.value = true
        }, 100)
      }

      return { showChart, chartType, config, loadChart }
    },
    template: `
      <div class="space-y-4">
        <div class="flex gap-2">
          <Button @click="loadChart('line')" size="sm">Load Line Chart</Button>
          <Button @click="loadChart('bar')" size="sm">Load Bar Chart</Button>
          <Button @click="loadChart('area')" size="sm">Load Area Chart</Button>
          <Button @click="loadChart('pie')" size="sm">Load Pie Chart</Button>
        </div>

        <div v-if="showChart">
          <MeldChart
            :type="chartType"
            :config="config"
            :title="\`Lazy-loaded \${chartType} chart\`"
            :height="400"
          />
        </div>

        <div v-else class="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
          <p class="text-muted-foreground">Click a button to lazy-load a chart</p>
        </div>
      </div>
    `,
  }),
}

export const UnsupportedType: Story = {
  render: () => ({
    components: { MeldChart },
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
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          This demonstrates error handling for chart types that haven't been implemented yet:
        </p>

        <MeldChart
          type="radar"
          :config="config"
          title="Unsupported Chart Type"
          :height="400"
        />
      </div>
    `,
  }),
}

export const WithDifferentSizes: Story = {
  render: () => ({
    components: { MeldChart },
    setup() {
      const chartType = ref<ChartType>('line')
      const config: MeldChartConfig = {
        series: [{ name: 'Data', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }

      return { chartType, config }
    },
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-medium mb-4">Small (250px)</h3>
          <MeldChart
            type="line"
            :config="config"
            :height="250"
          />
        </div>

        <div>
          <h3 class="text-lg font-medium mb-4">Medium (350px - default)</h3>
          <MeldChart
            type="bar"
            :config="config"
          />
        </div>

        <div>
          <h3 class="text-lg font-medium mb-4">Large (500px)</h3>
          <MeldChart
            type="area"
            :config="config"
            :height="500"
          />
        </div>
      </div>
    `,
  }),
}
