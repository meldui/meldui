import type {
  ChartClickEvent,
  ChartHoverEvent,
  ChartLegendSelectEvent,
  MeldBarChartConfig,
  MeldLineChartConfig,
  MeldPieChartConfig,
} from '@meldui/charts-vue'
import { MeldBarChart, MeldLineChart, MeldPieChart } from '@meldui/charts-vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof MeldBarChart> = {
  title: 'Components/Charts/Chart Events',
  component: MeldBarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Chart Events

All MeldUI chart components emit events that allow you to respond to user interactions. This enables features like drilling down into data, showing custom tooltips, or syncing with other parts of your application.

## Available Events

| Event | Description | Payload |
|-------|-------------|---------|
| \`@click\` | Fired when a data point is clicked | \`ChartClickEvent\` |
| \`@hover\` | Fired when hovering over a data point | \`ChartHoverEvent\` |
| \`@mouseout\` | Fired when mouse leaves a data point | \`ChartMouseOutEvent\` |
| \`@legend-select\` | Fired when legend selection changes | \`ChartLegendSelectEvent\` |
| \`@data-zoom\` | Fired when data zoom changes | \`ChartDataZoomEvent\` |
| \`@brush-select\` | Fired when brush selection is made | \`ChartBrushSelectEvent\` |

## Event Payload Types

All event payloads include a \`raw\` property containing the original ECharts event for advanced use cases.

\`\`\`typescript
interface ChartClickEvent {
  seriesName: string      // Name of the series clicked
  dataIndex: number       // Index of the data point
  value: number | [number, number]  // Value at the point
  name: string            // Category name (x-axis label)
  componentType: 'series' | 'markPoint' | 'markLine' | 'markArea'
  seriesIndex: number     // Index of the series
  raw: unknown            // Original ECharts event
}
\`\`\`
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof MeldBarChart>

function handleChartClick(event: ChartClickEvent) {
  console.log('Click event:', {
    seriesName: event.seriesName,
    dataIndex: event.dataIndex,
    value: event.value,
    name: event.name,
  })
}

function handleChartHover(event: ChartHoverEvent) {
  console.log('Hover event:', event.seriesName, event.value)
}

export const ClickEvent: Story = {
  name: 'Click Event',
  render: () => ({
    components: { MeldBarChart, Card, CardHeader, CardTitle, CardDescription, CardContent },
    setup() {
      const config: MeldBarChartConfig = {
        series: [{ name: 'Sales', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }

      const lastClick = ref<ChartClickEvent | null>(null)

      const handleClick = (event: ChartClickEvent) => {
        lastClick.value = event
        console.log('Chart clicked:', event)
      }

      return { config, lastClick, handleClick }
    },
    template: `
      <div class="space-y-4">
        <MeldBarChart
          :config="config"
          title="Click on a bar to see event data"
          @click="handleClick"
        />

        <Card v-if="lastClick">
          <CardHeader>
            <CardTitle class="text-sm">Last Click Event</CardTitle>
            <CardDescription>Click data captured from the chart</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="font-medium">Series:</div>
              <div>{{ lastClick.seriesName }}</div>
              <div class="font-medium">Category:</div>
              <div>{{ lastClick.name }}</div>
              <div class="font-medium">Value:</div>
              <div>{{ lastClick.value }}</div>
              <div class="font-medium">Data Index:</div>
              <div>{{ lastClick.dataIndex }}</div>
              <div class="font-medium">Series Index:</div>
              <div>{{ lastClick.seriesIndex }}</div>
            </div>
          </CardContent>
        </Card>

        <p v-else class="text-sm text-muted-foreground text-center">
          Click on a bar to see the event data
        </p>
      </div>
    `,
  }),
}

export const HoverEvent: Story = {
  name: 'Hover Event',
  render: () => ({
    components: { MeldLineChart, Card, CardHeader, CardTitle, CardDescription, CardContent },
    setup() {
      const config: MeldLineChartConfig = {
        series: [
          { name: 'Revenue', data: [120, 200, 150, 180, 220, 190, 250] },
          { name: 'Expenses', data: [80, 120, 90, 110, 140, 100, 160] },
        ],
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        showPoints: true,
        legend: { position: 'bottom' },
      }

      const hoverInfo = ref<ChartHoverEvent | null>(null)
      const isHovering = ref(false)

      const handleHover = (event: ChartHoverEvent) => {
        hoverInfo.value = event
        isHovering.value = true
      }

      const handleMouseOut = () => {
        isHovering.value = false
      }

      return { config, hoverInfo, isHovering, handleHover, handleMouseOut }
    },
    template: `
      <div class="space-y-4">
        <MeldLineChart
          :config="config"
          title="Hover over data points"
          @hover="handleHover"
          @mouseout="handleMouseOut"
        />

        <div
          class="p-4 rounded-lg border transition-all"
          :class="isHovering ? 'bg-primary/5 border-primary' : 'bg-muted/50 border-border'"
        >
          <div v-if="isHovering && hoverInfo" class="text-center">
            <p class="text-lg font-semibold">{{ hoverInfo.seriesName }}</p>
            <p class="text-sm text-muted-foreground">{{ hoverInfo.name }}</p>
            <p class="text-2xl font-bold mt-2">\${{ hoverInfo.value }}K</p>
          </div>
          <p v-else class="text-sm text-muted-foreground text-center">
            Hover over a data point to see details
          </p>
        </div>
      </div>
    `,
  }),
}

export const LegendSelectEvent: Story = {
  name: 'Legend Select Event',
  render: () => ({
    components: { MeldPieChart, Card, CardHeader, CardTitle, CardDescription, CardContent },
    setup() {
      const config: MeldPieChartConfig = {
        series: [
          { name: 'Desktop', data: [45] },
          { name: 'Mobile', data: [35] },
          { name: 'Tablet', data: [15] },
          { name: 'Other', data: [5] },
        ],
        legend: { position: 'bottom' },
      }

      const legendState = ref<Record<string, boolean>>({
        Desktop: true,
        Mobile: true,
        Tablet: true,
        Other: true,
      })

      const handleLegendSelect = (event: ChartLegendSelectEvent) => {
        legendState.value = event.selected
        console.log('Legend selection changed:', event)
      }

      return { config, legendState, handleLegendSelect }
    },
    template: `
      <div class="space-y-4">
        <MeldPieChart
          :config="config"
          title="Click legend items to toggle visibility"
          @legend-select="handleLegendSelect"
        />

        <Card>
          <CardHeader>
            <CardTitle class="text-sm">Legend State</CardTitle>
            <CardDescription>Current visibility of each series</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(visible, name) in legendState"
                :key="name"
                class="px-3 py-1 rounded-full text-sm"
                :class="visible ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground line-through'"
              >
                {{ name }}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    `,
  }),
}

export const DrillDownExample: Story = {
  name: 'Drill-Down Pattern',
  render: () => ({
    components: { MeldBarChart, Card, CardHeader, CardTitle, CardDescription, CardContent },
    setup() {
      const regionData = {
        North: { Q1: 120, Q2: 150, Q3: 180, Q4: 200 },
        South: { Q1: 80, Q2: 100, Q3: 120, Q4: 140 },
        East: { Q1: 90, Q2: 110, Q3: 130, Q4: 150 },
        West: { Q1: 100, Q2: 130, Q3: 160, Q4: 190 },
      }

      const overviewConfig: MeldBarChartConfig = {
        series: [
          {
            name: 'Revenue',
            data: Object.entries(regionData).map(([, quarters]) =>
              Object.values(quarters).reduce((a, b) => a + b, 0),
            ),
          },
        ],
        xAxis: {
          categories: Object.keys(regionData),
        },
        colors: 'vibrant',
      }

      const selectedRegion = ref<string | null>(null)
      const detailConfig = ref<MeldBarChartConfig | null>(null)

      const handleClick = (event: ChartClickEvent) => {
        const region = event.name as keyof typeof regionData
        if (regionData[region]) {
          selectedRegion.value = region
          detailConfig.value = {
            series: [
              {
                name: `${region} Quarterly Revenue`,
                data: Object.values(regionData[region]),
              },
            ],
            xAxis: {
              categories: ['Q1', 'Q2', 'Q3', 'Q4'],
            },
            colors: 'vibrant',
          }
        }
      }

      const goBack = () => {
        selectedRegion.value = null
        detailConfig.value = null
      }

      return { overviewConfig, detailConfig, selectedRegion, handleClick, goBack }
    },
    template: `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            {{ selectedRegion ? selectedRegion + ' Region Details' : 'Regional Sales Overview' }}
          </h3>
          <button
            v-if="selectedRegion"
            @click="goBack"
            class="text-sm text-primary hover:underline"
          >
            &larr; Back to Overview
          </button>
        </div>

        <MeldBarChart
          v-if="!selectedRegion"
          :config="overviewConfig"
          @click="handleClick"
        />

        <MeldBarChart
          v-else
          :config="detailConfig"
        />

        <p class="text-sm text-muted-foreground text-center">
          {{ selectedRegion ? 'Showing quarterly breakdown for ' + selectedRegion : 'Click a bar to drill down into regional details' }}
        </p>
      </div>
    `,
  }),
}

export const EventLogger: Story = {
  name: 'Event Logger',
  render: () => ({
    components: { MeldBarChart, Card, CardHeader, CardTitle, CardDescription, CardContent },
    setup() {
      const config: MeldBarChartConfig = {
        series: [
          { name: 'Product A', data: [30, 40, 45, 50, 49] },
          { name: 'Product B', data: [20, 30, 35, 40, 39] },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        },
        legend: { position: 'bottom' },
      }

      interface EventLog {
        time: string
        type: string
        data: string
      }

      const eventLogs = ref<EventLog[]>([])
      const maxLogs = 10

      const addLog = (type: string, data: unknown) => {
        const time = new Date().toLocaleTimeString()
        eventLogs.value.unshift({
          time,
          type,
          data: JSON.stringify(data, null, 2),
        })
        if (eventLogs.value.length > maxLogs) {
          eventLogs.value.pop()
        }
      }

      const handleClick = (event: ChartClickEvent) => {
        addLog('click', { series: event.seriesName, name: event.name, value: event.value })
      }

      const handleHover = (event: ChartHoverEvent) => {
        addLog('hover', { series: event.seriesName, name: event.name, value: event.value })
      }

      const handleLegendSelect = (event: ChartLegendSelectEvent) => {
        addLog('legendSelect', { name: event.name, selected: event.selected })
      }

      const clearLogs = () => {
        eventLogs.value = []
      }

      return { config, eventLogs, handleClick, handleHover, handleLegendSelect, clearLogs }
    },
    template: `
      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <MeldBarChart
            :config="config"
            title="Interact with the chart"
            @click="handleClick"
            @hover="handleHover"
            @legend-select="handleLegendSelect"
          />
        </div>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between">
            <div>
              <CardTitle class="text-sm">Event Log</CardTitle>
              <CardDescription>Recent events (max {{ eventLogs.length > 0 ? 10 : 0 }})</CardDescription>
            </div>
            <button
              v-if="eventLogs.length > 0"
              @click="clearLogs"
              class="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </CardHeader>
          <CardContent>
            <div v-if="eventLogs.length > 0" class="space-y-2 max-h-[300px] overflow-auto">
              <div
                v-for="(log, index) in eventLogs"
                :key="index"
                class="p-2 rounded bg-muted text-xs font-mono"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-muted-foreground">{{ log.time }}</span>
                  <span
                    class="px-1.5 py-0.5 rounded text-xs font-medium"
                    :class="{
                      'bg-blue-500/20 text-blue-600': log.type === 'click',
                      'bg-green-500/20 text-green-600': log.type === 'hover',
                      'bg-purple-500/20 text-purple-600': log.type === 'legendSelect',
                    }"
                  >
                    {{ log.type }}
                  </span>
                </div>
                <pre class="text-xs whitespace-pre-wrap">{{ log.data }}</pre>
              </div>
            </div>
            <p v-else class="text-sm text-muted-foreground text-center py-8">
              Interact with the chart to see events
            </p>
          </CardContent>
        </Card>
      </div>
    `,
  }),
}

export const TypeScriptUsage: Story = {
  name: 'TypeScript Usage',
  parameters: {
    docs: {
      description: {
        story: `
## TypeScript Support

All event types are exported from \`@meldui/charts-vue\` for full type safety:

\`\`\`typescript
import type {
  ChartClickEvent,
  ChartHoverEvent,
  ChartMouseOutEvent,
  ChartLegendSelectEvent,
  ChartDataZoomEvent,
  ChartBrushSelectEvent,
  ChartEmits
} from '@meldui/charts-vue'

// Using with defineEmits in your own components
const emit = defineEmits<ChartEmits>()

// Or handle events directly
const handleClick = (event: ChartClickEvent) => {
  console.log('Clicked:', event.seriesName, event.value)
}
\`\`\`

## Usage in Templates

\`\`\`vue
<MeldBarChart
  :config="config"
  @click="handleClick"
  @hover="handleHover"
  @mouseout="handleMouseOut"
  @legend-select="handleLegendSelect"
  @data-zoom="handleDataZoom"
  @brush-select="handleBrushSelect"
/>
\`\`\`
        `,
      },
    },
  },
  render: () => ({
    components: { MeldBarChart },
    setup() {
      const config: MeldBarChartConfig = {
        series: [{ name: 'Data', data: [30, 40, 45, 50, 49, 60, 70] }],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      }

      return { config, handleClick: handleChartClick, handleHover: handleChartHover }
    },
    template: `
      <div class="space-y-4">
        <MeldBarChart
          :config="config"
          title="Open console to see typed events"
          @click="handleClick"
          @hover="handleHover"
        />
        <p class="text-sm text-muted-foreground text-center">
          Open your browser console and interact with the chart to see typed event logs
        </p>
      </div>
    `,
  }),
}
