import { MeldLineChart } from '@meldui/charts-vue'
import type { MeldChartConfig } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@meldui/vue'
import { IconTrendingUp, IconTrendingDown, IconRefresh } from '@meldui/tabler-vue'

const meta: Meta<typeof MeldLineChart> = {
  title: 'Components/Charts/LineChart',
  component: MeldLineChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Line charts display data as a series of points connected by straight line segments. Ideal for showing trends over time.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldLineChart>

export const Default: Story = {
  render: () => ({
    components: { MeldLineChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }
      return { config }
    },
    template: `
      <MeldLineChart :config="config" title="Weekly Revenue" />
    `,
  }),
}

export const MultipleSeries: Story = {
  render: () => ({
    components: { MeldLineChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] },
          { name: 'Expenses', data: [20, 30, 35, 40, 39, 50, 60] },
          { name: 'Profit', data: [10, 10, 10, 10, 10, 10, 10] },
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
      <MeldLineChart :config="config" title="Financial Overview" />
    `,
  }),
}

export const SmoothCurve: Story = {
  render: () => ({
    components: { MeldLineChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Temperature', data: [18, 22, 25, 28, 30, 29, 26] },
          { name: 'Humidity', data: [65, 70, 68, 72, 75, 73, 70] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        stroke: {
          curve: 'smooth',
          width: 3,
        },
      }
      return { config }
    },
    template: `
      <MeldLineChart :config="config" title="Weather Data" />
    `,
  }),
}

export const WithCustomColors: Story = {
  render: () => ({
    components: { MeldLineChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Series A', data: [30, 40, 35, 50, 49, 60, 70] },
          { name: 'Series B', data: [20, 30, 45, 40, 39, 50, 55] },
        ],
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        colors: 'ocean',
      }
      return { config }
    },
    template: `
      <MeldLineChart :config="config" title="Ocean Palette" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldLineChart },
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
      <MeldLineChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { MeldLineChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }
      return { config }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3>Small (250px)</h3>
          <MeldLineChart :config="config" :height="250" />
        </div>
        <div>
          <h3>Medium (350px - default)</h3>
          <MeldLineChart :config="config" />
        </div>
        <div>
          <h3>Large (500px)</h3>
          <MeldLineChart :config="config" :height="500" />
        </div>
      </div>
    `,
  }),
}

export const Responsive: Story = {
  render: () => ({
    components: { MeldLineChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }
      return { config }
    },
    template: `
      <div style="width: 100%; height: 400px; border: 1px dashed #ccc; padding: 1rem; resize: both; overflow: auto;">
        <p style="margin-bottom: 1rem; color: #666; font-size: 0.875rem;">
          Resize this container to see automatic chart resizing
        </p>
        <MeldLineChart :config="config" :height="'100%'" />
      </div>
    `,
  }),
}

export const InteractiveDemo: Story = {
  render: () => ({
    components: { MeldLineChart },
    setup() {
      const isLoading = ref(false)
      const config = ref<MeldChartConfig>({
        series: [{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      })

      const refreshData = () => {
        isLoading.value = true
        setTimeout(() => {
          config.value = {
            ...config.value,
            series: [
              {
                name: 'Revenue',
                data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
              },
            ],
          }
          isLoading.value = false
        }, 1000)
      }

      return { config, isLoading, refreshData }
    },
    template: `
      <div>
        <button
          @click="refreshData"
          style="margin-bottom: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;"
        >
          Refresh Data
        </button>
        <MeldLineChart :config="config" :loading="isLoading" title="Interactive Chart" />
      </div>
    `,
  }),
}

export const WithCard: Story = {
  render: () => ({
    components: { MeldLineChart, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, IconTrendingUp },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }
      return { config }
    },
    template: `
      <Card class="w-full">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Revenue</CardTitle>
              <CardDescription>Track your revenue performance</CardDescription>
            </div>
            <Badge variant="default" class="flex items-center gap-1">
              <IconTrendingUp :size="16" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <MeldLineChart :config="config" :height="300" />
        </CardContent>
      </Card>
    `,
  }),
}

export const DashboardLayout: Story = {
  render: () => ({
    components: {
      MeldLineChart,
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      Badge,
      Button,
      IconTrendingUp,
      IconTrendingDown,
      IconRefresh,
    },
    setup() {
      const revenueConfig: MeldChartConfig = {
        series: [{ name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        stroke: { curve: 'smooth' },
        legend: { show: false },
      }

      const usersConfig: MeldChartConfig = {
        series: [
          { name: 'Active Users', data: [120, 140, 135, 150, 149, 160, 175] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        colors: 'ocean',
        stroke: { curve: 'smooth' },
        legend: { show: false },
      }

      const conversionConfig: MeldChartConfig = {
        series: [
          { name: 'Conversions', data: [5, 8, 6, 9, 7, 10, 12] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        colors: 'sunset',
        stroke: { curve: 'smooth' },
        legend: { show: false },
      }

      console.log('Revenue config legend:', revenueConfig.legend)
      console.log('Users config legend:', usersConfig.legend)
      console.log('Conversion config legend:', conversionConfig.legend)

      return { revenueConfig, usersConfig, conversionConfig }
    },
    template: `
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
              <Badge variant="default" class="flex items-center gap-1">
                <IconTrendingUp :size="14" />
                +12.5%
              </Badge>
            </div>
            <div class="mt-2">
              <div class="text-2xl font-bold">$45,231</div>
              <p class="text-xs text-muted-foreground">+20.1% from last week</p>
            </div>
          </CardHeader>
          <CardContent>
            <MeldLineChart :config="revenueConfig" :height="200" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="text-sm font-medium">Active Users</CardTitle>
              <Badge variant="default" class="flex items-center gap-1 bg-green-500">
                <IconTrendingUp :size="14" />
                +8.2%
              </Badge>
            </div>
            <div class="mt-2">
              <div class="text-2xl font-bold">1,234</div>
              <p class="text-xs text-muted-foreground">+15 from yesterday</p>
            </div>
          </CardHeader>
          <CardContent>
            <MeldLineChart :config="usersConfig" :height="200" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="text-sm font-medium">Conversions</CardTitle>
              <Badge variant="default" class="flex items-center gap-1 bg-amber-500">
                <IconTrendingUp :size="14" />
                +5.4%
              </Badge>
            </div>
            <div class="mt-2">
              <div class="text-2xl font-bold">57</div>
              <p class="text-xs text-muted-foreground">+3 from last week</p>
            </div>
          </CardHeader>
          <CardContent>
            <MeldLineChart :config="conversionConfig" :height="200" />
          </CardContent>
        </Card>
      </div>
    `,
  }),
}

export const AnalyticsDashboard: Story = {
  render: () => ({
    components: {
      MeldLineChart,
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      Button,
      IconRefresh,
    },
    setup() {
      const isLoading = ref(false)
      const config = ref<MeldChartConfig>({
        series: [
          { name: 'Page Views', data: [1200, 1400, 1350, 1600, 1550, 1800, 2000] },
          { name: 'Sessions', data: [800, 900, 850, 1000, 950, 1100, 1200] },
          { name: 'Bounce Rate', data: [400, 450, 420, 500, 480, 550, 600] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        legend: {
          position: 'bottom',
        },
        stroke: { curve: 'smooth' },
      })

      const refreshData = () => {
        isLoading.value = true
        setTimeout(() => {
          config.value = {
            ...config.value,
            series: config.value.series.map(s => ({
              ...s,
              data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 2000 + 400)),
            })),
          }
          isLoading.value = false
        }, 1000)
      }

      return { config, isLoading, refreshData }
    },
    template: `
      <Card class="w-full">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Website Analytics</CardTitle>
              <CardDescription>Weekly performance metrics for your website</CardDescription>
            </div>
            <Button variant="outline" size="sm" @click="refreshData" :disabled="isLoading">
              <IconRefresh :size="16" :class="{ 'animate-spin': isLoading }" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MeldLineChart :config="config" :loading="isLoading" :height="400" />
        </CardContent>
      </Card>
    `,
  }),
}
