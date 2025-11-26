import type { MeldChartConfig } from '@meldui/charts-vue'
import { MeldBarChart, MeldLineChart, MeldPieChart } from '@meldui/charts-vue'
import {
  IconCalendar,
  IconChevronDown,
  IconDownload,
  IconFilter,
  IconRefresh,
  IconShare,
} from '@meldui/tabler-vue'
import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof MeldBarChart> = {
  title: 'Components/Charts/Title & Slots',
  component: MeldBarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Charts support flexible customization through the \`title\` prop and \`header\`/\`footer\` slots.

## Features
- **\`title\` prop**: Simple string title rendered above the chart
- **\`header\` slot**: Full customization of the header area (overrides title prop)
- **\`footer\` slot**: Add content below the chart (legends, captions, timestamps)

## Slot Priority
If you use the \`header\` slot, it completely replaces the default title. Use this for adding actions, filters, or custom layouts.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldBarChart>

// Shared config for examples
const salesConfig: MeldChartConfig = {
  series: [{ name: 'Sales', data: [30, 40, 45, 50, 49, 60, 70] }],
  xAxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
}

const multiSeriesConfig: MeldChartConfig = {
  series: [
    { name: 'Revenue', data: [120, 200, 150, 180, 220, 190, 250] },
    { name: 'Expenses', data: [80, 120, 90, 110, 140, 100, 160] },
  ],
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  },
  legend: { position: 'bottom' },
}

/**
 * The simplest way to add a title - just use the `title` prop.
 */
export const SimpleTitleProp: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      return { config: salesConfig }
    },
    template: `
      <MeldBarChart :config="config" title="Weekly Sales Report" />
    `,
  }),
}

/**
 * Use the `header` slot for custom layouts with actions, badges, or icons.
 */
export const CustomHeaderWithActions: Story = {
  render: () => ({
    components: { MeldBarChart, Button, Badge, IconDownload, IconShare, IconRefresh },
    setup() {
      return { config: salesConfig }
    },
    template: `
      <MeldBarChart :config="config">
        <template #header>
          <div class="flex items-center justify-between mb-3 px-1">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold text-foreground">Weekly Sales</h3>
              <Badge variant="secondary" class="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                +18%
              </Badge>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <IconRefresh :size="16" />
              </Button>
              <Button variant="ghost" size="sm">
                <IconDownload :size="16" />
              </Button>
              <Button variant="ghost" size="sm">
                <IconShare :size="16" />
              </Button>
            </div>
          </div>
        </template>
      </MeldBarChart>
    `,
  }),
}

/**
 * Add timestamps, data sources, or additional context in the footer.
 */
export const WithFooterCaption: Story = {
  render: () => ({
    components: { MeldBarChart, IconCalendar },
    setup() {
      const lastUpdated = new Date().toLocaleString()
      return { config: salesConfig, lastUpdated }
    },
    template: `
      <MeldBarChart :config="config" title="Weekly Sales Report">
        <template #footer>
          <div class="flex items-center justify-between mt-3 px-1 text-xs text-muted-foreground">
            <div class="flex items-center gap-1">
              <IconCalendar :size="14" />
              <span>Last updated: {{ lastUpdated }}</span>
            </div>
            <span>Source: Sales Database</span>
          </div>
        </template>
      </MeldBarChart>
    `,
  }),
}

/**
 * Combine custom header with footer for a complete chart presentation.
 */
export const HeaderAndFooterCombined: Story = {
  render: () => ({
    components: { MeldLineChart, Button, Badge, IconDownload, IconFilter },
    setup() {
      return { config: multiSeriesConfig }
    },
    template: `
      <MeldLineChart :config="config" :height="300">
        <template #header>
          <div class="flex items-center justify-between mb-3 px-1">
            <div>
              <h3 class="text-lg font-semibold text-foreground">Financial Overview</h3>
              <p class="text-sm text-muted-foreground">Revenue vs Expenses (2024)</p>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <IconFilter :size="16" class="mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <IconDownload :size="16" class="mr-1" />
                Export
              </Button>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex items-center justify-between mt-3 px-1">
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span>
                <span class="text-muted-foreground">Total Revenue: <strong class="text-foreground">$1,310K</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-orange-500"></span>
                <span class="text-muted-foreground">Total Expenses: <strong class="text-foreground">$800K</strong></span>
              </div>
            </div>
            <Badge variant="outline" class="text-green-600 border-green-600">
              Profit: $510K
            </Badge>
          </div>
        </template>
      </MeldLineChart>
    `,
  }),
}

/**
 * Add interactive filters in the header slot.
 */
export const HeaderWithFilters: Story = {
  render: () => ({
    components: {
      MeldBarChart,
      Button,
      Select,
      SelectTrigger,
      SelectValue,
      SelectContent,
      SelectItem,
      IconChevronDown,
    },
    setup() {
      const selectedPeriod = ref('week')
      return { config: salesConfig, selectedPeriod }
    },
    template: `
      <MeldBarChart :config="config">
        <template #header>
          <div class="flex items-center justify-between mb-3 px-1">
            <h3 class="text-lg font-semibold text-foreground">Sales Analytics</h3>
            <div class="flex items-center gap-2">
              <Select v-model="selectedPeriod">
                <SelectTrigger class="w-32 h-8">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </template>
      </MeldBarChart>
    `,
  }),
}

/**
 * Pie chart with centered title and value summary in footer.
 */
export const PieChartWithSummary: Story = {
  render: () => ({
    components: { MeldPieChart, Badge },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Desktop', data: [65] },
          { name: 'Mobile', data: [25] },
          { name: 'Tablet', data: [10] },
        ],
        legend: { position: 'right' },
      }
      return { config }
    },
    template: `
      <MeldPieChart :config="config" :height="300">
        <template #header>
          <div class="text-center mb-2">
            <h3 class="text-lg font-semibold text-foreground">Traffic by Device</h3>
            <p class="text-sm text-muted-foreground">Distribution across platforms</p>
          </div>
        </template>
        <template #footer>
          <div class="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <p class="text-2xl font-bold text-blue-600">65%</p>
              <p class="text-xs text-muted-foreground">Desktop</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-green-600">25%</p>
              <p class="text-xs text-muted-foreground">Mobile</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-orange-600">10%</p>
              <p class="text-xs text-muted-foreground">Tablet</p>
            </div>
          </div>
        </template>
      </MeldPieChart>
    `,
  }),
}

/**
 * Charts work fine without any title or slots - they render clean.
 */
export const NoTitleOrSlots: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      return { config: salesConfig }
    },
    template: `
      <MeldBarChart :config="config" />
    `,
  }),
}

/**
 * Empty header slot removes the title completely (useful for embedded charts).
 */
export const EmptyHeaderSlot: Story = {
  render: () => ({
    components: { MeldBarChart },
    setup() {
      return { config: salesConfig }
    },
    template: `
      <div>
        <p class="text-sm text-muted-foreground mb-2">Chart with empty header slot (no spacing above):</p>
        <MeldBarChart :config="config" title="This title will NOT show">
          <template #header></template>
        </MeldBarChart>
      </div>
    `,
  }),
}

/**
 * Multiple charts with consistent header styling.
 */
export const ConsistentHeaderStyling: Story = {
  render: () => ({
    components: { MeldBarChart, MeldLineChart, Badge },
    setup() {
      return { salesConfig, multiSeriesConfig }
    },
    template: `
      <div class="grid grid-cols-2 gap-6">
        <MeldBarChart :config="salesConfig" :height="250">
          <template #header>
            <div class="flex items-center justify-between mb-2 px-1">
              <h4 class="font-medium text-foreground">Weekly Sales</h4>
              <Badge variant="secondary">Bar</Badge>
            </div>
          </template>
        </MeldBarChart>

        <MeldLineChart :config="multiSeriesConfig" :height="250">
          <template #header>
            <div class="flex items-center justify-between mb-2 px-1">
              <h4 class="font-medium text-foreground">Revenue Trend</h4>
              <Badge variant="secondary">Line</Badge>
            </div>
          </template>
        </MeldLineChart>
      </div>
    `,
  }),
}
