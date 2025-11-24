import { MeldBarChart } from '@meldui/charts-vue'
import type { MeldChartConfig } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Separator,
} from '@meldui/vue'
import { IconShoppingCart, IconUsers, IconPackage } from '@meldui/tabler-vue'

const meta: Meta<typeof MeldBarChart> = {
  title: 'Components/Charts/BarChart',
  component: MeldBarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Bar charts display data as rectangular bars with lengths proportional to the values they represent. Perfect for comparing values across categories.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldBarChart>

export const Default: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Sales', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Weekly Sales" />
    `,
  }),
}

export const MultipleSeries: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Product A', data: [30, 40, 45, 50, 49, 60, 70] },
          { name: 'Product B', data: [20, 30, 35, 40, 39, 50, 60] },
          { name: 'Product C', data: [15, 25, 30, 35, 34, 45, 55] },
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
      <MeldBarChart :config="config" title="Product Sales Comparison" />
    `,
  }),
}

export const StackedBar: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Desktop', data: [44, 55, 57, 56, 61, 58, 63] },
          { name: 'Mobile', data: [76, 85, 101, 98, 87, 105, 91] },
          { name: 'Tablet', data: [35, 41, 36, 26, 45, 48, 52] },
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
      <MeldBarChart :config="config" title="Device Traffic (Stacked)" />
    `,
  }),
}

export const HorizontalBar: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Score', data: [85, 72, 68, 91, 78, 88, 94] }],
        xAxis: {
          categories: ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'PE'],
        },
        horizontal: true,
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Subject Scores" />
    `,
  }),
}

export const WithCustomColors: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Q1', data: [30, 45, 60] },
          { name: 'Q2', data: [40, 50, 70] },
          { name: 'Q3', data: [50, 55, 80] },
          { name: 'Q4', data: [60, 65, 90] },
        ],
        xAxis: {
          categories: ['North', 'South', 'West'],
        },
        colors: 'vibrant',
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Quarterly Regional Sales" />
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { MeldBarChart },
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
      <MeldBarChart :config="config" :loading="true" title="Loading State" />
    `,
  }),
}

export const SmallDataset: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Yes', data: [45] },
          { name: 'No', data: [38] },
          { name: 'Abstain', data: [17] },
        ],
        xAxis: {
          categories: ['Votes'],
        },
        colors: 'accessible',
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Poll Results" />
    `,
  }),
}

export const LargeDataset: Story = {
  render: () => ({
    components: { MeldBarChart },
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
            name: '2023',
            data: months.map(() => Math.floor(Math.random() * 100 + 50)),
          },
          {
            name: '2024',
            data: months.map(() => Math.floor(Math.random() * 100 + 50)),
          },
        ],
        xAxis: {
          categories: months,
        },
        legend: {
          position: 'bottom',
        },
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Annual Comparison" :height="450" />
    `,
  }),
}

export const SalesCard: Story = {
  render: () => ({
    components: { MeldBarChart, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, IconShoppingCart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Sales', data: [30, 40, 45, 50, 49, 60, 70] }],
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
            <div class="flex items-center gap-3">
              <div class="p-2 bg-primary/10 rounded-lg">
                <IconShoppingCart :size="20" class="text-primary" />
              </div>
              <div>
                <CardTitle>Weekly Sales</CardTitle>
                <CardDescription>Sales performance over the last 7 days</CardDescription>
              </div>
            </div>
            <Badge variant="default" class="bg-green-500">+18%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-sm text-muted-foreground">Total Sales</p>
                <p class="text-2xl font-bold">344</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Avg per Day</p>
                <p class="text-2xl font-bold">49</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Best Day</p>
                <p class="text-2xl font-bold">Sun</p>
              </div>
            </div>
            <MeldBarChart :config="config" :height="250" />
          </div>
        </CardContent>
      </Card>
    `,
  }),
}

export const EcommerceDashboard: Story = {
  render: () => ({
    components: {
      MeldBarChart,
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      Badge,
      Separator,
      IconShoppingCart,
      IconUsers,
      IconPackage,
    },
    setup() {
      const salesConfig: MeldChartConfig = {
        series: [
          { name: 'Online', data: [30, 40, 45, 50, 49, 60, 70] },
          { name: 'In-Store', data: [20, 25, 30, 35, 32, 40, 45] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        stacked: true,
        legend: {
          position: 'bottom',
        },
      }

      const categoriesConfig: MeldChartConfig = {
        series: [{ name: 'Orders', data: [85, 72, 68, 91, 78, 88, 94] }],
        xAxis: {
          categories: ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Sports', 'Beauty'],
        },
        horizontal: true,
      }

      return { salesConfig, categoriesConfig }
    },
    template: `
      <div class="space-y-6">
        <div class="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">2,345</div>
              <p class="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Badge variant="default" class="bg-green-500 text-xs">+12%</Badge>
                from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-medium">Active Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">1,234</div>
              <p class="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Badge variant="default" class="bg-blue-500 text-xs">+8%</Badge>
                from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-medium">Products Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">4,567</div>
              <p class="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Badge variant="default" class="bg-amber-500 text-xs">+15%</Badge>
                from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Channel</CardTitle>
              <CardDescription>Compare online vs in-store sales</CardDescription>
            </CardHeader>
            <CardContent>
              <MeldBarChart :config="salesConfig" :height="300" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders by Category</CardTitle>
              <CardDescription>Top performing product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <MeldBarChart :config="categoriesConfig" :height="300" />
            </CardContent>
          </Card>
        </div>
      </div>
    `,
  }),
}
