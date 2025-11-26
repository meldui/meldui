import type { MeldChartConfig } from '@meldui/charts-vue'
import { MeldBarChart } from '@meldui/charts-vue'
import { IconPackage, IconShoppingCart, IconUsers } from '@meldui/tabler-vue'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

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

export const WithDataLabels: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Revenue', data: [120, 200, 150, 180, 220, 190, 250] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        dataLabels: {
          show: true,
          position: 'top',
        },
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Revenue with Data Labels" />
    `,
  }),
}

export const WithFormattedDataLabels: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Sales', data: [1200, 2500, 1800, 3200, 2800, 3500, 4100] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        dataLabels: {
          show: true,
          position: 'top',
          formatter: (value: number) => `$${(value / 1000).toFixed(1)}k`,
        },
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Sales with Formatted Labels" />
    `,
  }),
}

export const HorizontalWithDataLabels: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [{ name: 'Score', data: [85, 72, 68, 91, 78] }],
        xAxis: {
          categories: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        },
        horizontal: true,
        dataLabels: {
          show: true,
          position: 'top', // Will be mapped to 'right' for horizontal bars
        },
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Horizontal Bars with Labels" />
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
    components: {
      MeldBarChart,
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      Badge,
      IconShoppingCart,
    },
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

export const DualAxisBarWithLine: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Sales (Left)', data: [120, 200, 150, 180, 220, 190, 250] },
          { name: 'Target (Right)', data: [180, 220, 200, 240, 260, 230, 280] },
        ],
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        legend: {
          position: 'top',
        },
        // Use advanced config for dual Y-axes
        advanced: {
          yAxis: [
            {
              type: 'value',
              name: 'Sales ($K)',
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
              name: 'Target ($K)',
              position: 'right',
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
                show: false, // Hide second axis grid lines
              },
            },
          ],
          series: [
            {
              name: 'Sales (Left)',
              data: [120, 200, 150, 180, 220, 190, 250],
              type: 'bar',
              yAxisIndex: 0,
            },
            {
              name: 'Target (Right)',
              data: [180, 220, 200, 240, 260, 230, 280],
              type: 'bar',
              yAxisIndex: 1,
            },
          ],
        },
      }
      return { config }
    },
    template: `
      <MeldBarChart :config="config" title="Sales vs Target (Dual Y-Axis)" />
    `,
  }),
}
