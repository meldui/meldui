import { MeldLineChart, MeldBarChart } from '@meldui/charts-vue'
import type { MeldChartConfig, PaletteName } from '@meldui/charts-vue'
import { PALETTES, generateColors } from '@meldui/charts-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@meldui/vue'

const meta: Meta = {
  title: 'Components/Charts/Color Palettes',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Color palettes provide consistent, visually distinct colors for chart series. Each palette automatically generates the exact number of colors needed based on your data.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const paletteNames: PaletteName[] = [
  'default',
  'vibrant',
  'pastel',
  'monochrome',
  'earth',
  'ocean',
  'sunset',
  'corporate',
  'neon',
  'accessible',
]

export const AllPalettes: Story = {
  render: () => ({
    components: { MeldLineChart, Card, CardHeader, CardTitle, CardDescription, CardContent },
    setup() {
      const configs: Record<PaletteName, MeldChartConfig> = {} as any

      // Generate config for each palette
      paletteNames.forEach((paletteName) => {
        configs[paletteName] = {
          series: [
            { name: 'Series A', data: [30, 40, 35, 50, 49, 60, 70] },
            { name: 'Series B', data: [20, 30, 45, 40, 39, 50, 55] },
            { name: 'Series C', data: [25, 35, 30, 45, 44, 55, 65] },
            { name: 'Series D', data: [15, 25, 40, 35, 34, 45, 50] },
            { name: 'Series E', data: [10, 20, 25, 30, 29, 40, 45] },
          ],
          xAxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          colors: paletteName,
          legend: { position: 'bottom' },
        }
      })

      return { configs, PALETTES, paletteNames }
    },
    template: `
      <div class="space-y-8">
        <div class="space-y-2">
          <h2 class="text-2xl font-bold">Chart Color Palettes</h2>
          <p class="text-muted-foreground">
            Each palette automatically generates colors based on the number of series in your chart.
            Simply pass the palette name to the <code>colors</code> prop.
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <Card v-for="paletteName in paletteNames" :key="paletteName">
            <CardHeader>
              <CardTitle class="capitalize">{{ PALETTES[paletteName].name }}</CardTitle>
              <CardDescription>{{ PALETTES[paletteName].description }}</CardDescription>
            </CardHeader>
            <CardContent>
              <MeldLineChart :config="configs[paletteName]" :height="250" />
            </CardContent>
          </Card>
        </div>
      </div>
    `,
  }),
}

export const PaletteComparison: Story = {
  render: () => ({
    components: { MeldBarChart, Card, CardHeader, CardTitle, CardContent },
    setup() {
      const config: MeldChartConfig = {
        series: [
          { name: 'Q1', data: [30, 45, 60, 55, 50] },
          { name: 'Q2', data: [40, 50, 70, 65, 60] },
          { name: 'Q3', data: [50, 55, 80, 75, 70] },
          { name: 'Q4', data: [60, 65, 90, 85, 80] },
        ],
        xAxis: {
          categories: ['North', 'South', 'East', 'West', 'Central'],
        },
        legend: { position: 'bottom' },
      }

      return { paletteNames, config }
    },
    template: `
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-bold mb-2">Same Data, Different Palettes</h2>
          <p class="text-muted-foreground">
            See how the same dataset looks with different color palettes
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="paletteName in paletteNames" :key="paletteName">
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-medium capitalize">{{ paletteName }}</CardTitle>
            </CardHeader>
            <CardContent>
              <MeldBarChart
                :config="{ ...config, colors: paletteName }"
                :height="200"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    `,
  }),
}

export const ColorSwatches: Story = {
  render: () => ({
    setup() {
      const swatches: Record<string, string[]> = {}

      paletteNames.forEach((paletteName) => {
        swatches[paletteName] = generateColors(paletteName, 8)
      })

      return { swatches, PALETTES, paletteNames }
    },
    template: `
      <div class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold mb-2">Color Swatches</h2>
          <p class="text-muted-foreground">
            Preview of 8 colors generated from each palette
          </p>
        </div>

        <div class="space-y-6">
          <div v-for="paletteName in paletteNames" :key="paletteName" class="space-y-3">
            <div>
              <h3 class="font-semibold capitalize">{{ PALETTES[paletteName].name }}</h3>
              <p class="text-sm text-muted-foreground">{{ PALETTES[paletteName].description }}</p>
            </div>
            <div class="flex gap-2">
              <div
                v-for="(color, index) in swatches[paletteName]"
                :key="index"
                class="flex-1 h-16 rounded-lg border border-border flex items-end justify-center pb-2"
                :style="{ backgroundColor: color }"
              >
                <span class="text-xs font-mono text-white mix-blend-difference">
                  {{ color }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const UsageExample: Story = {
  render: () => ({
    components: { MeldLineChart, Card, CardHeader, CardTitle, CardDescription, CardContent },
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
        colors: 'ocean', // Simply pass the palette name!
        legend: { position: 'bottom' },
      }

      return { config }
    },
    template: `
      <Card class="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Using the "ocean" color palette</CardDescription>
        </CardHeader>
        <CardContent>
          <MeldLineChart :config="config" :height="350" />

          <div class="mt-6 p-4 bg-muted rounded-lg">
            <p class="text-sm font-semibold mb-2">Usage:</p>
            <pre class="text-xs"><code>const config: MeldChartConfig = {
  series: [...],
  colors: 'ocean' // Simply pass the palette name!
}</code></pre>
          </div>
        </CardContent>
      </Card>
    `,
  }),
}

export const DarkModeComparison: Story = {
  render: () => ({
    setup() {
      const lightSwatches: Record<string, string[]> = {}
      const darkSwatches: Record<string, string[]> = {}

      paletteNames.forEach((paletteName) => {
        lightSwatches[paletteName] = generateColors(paletteName, 6, false)
        darkSwatches[paletteName] = generateColors(paletteName, 6, true)
      })

      return { lightSwatches, darkSwatches, PALETTES, paletteNames }
    },
    template: `
      <div class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold mb-2">Automatic Dark Mode Adjustment</h2>
          <p class="text-muted-foreground">
            Colors are automatically adjusted for optimal appearance in dark mode.
            Compare light mode (top) vs dark mode (bottom) for each palette.
          </p>
        </div>

        <div class="space-y-6">
          <div v-for="paletteName in paletteNames" :key="paletteName" class="space-y-3">
            <div>
              <h3 class="font-semibold capitalize">{{ PALETTES[paletteName].name }}</h3>
            </div>

            <!-- Light Mode -->
            <div>
              <p class="text-xs text-muted-foreground mb-2">Light Mode</p>
              <div class="flex gap-2 p-4 bg-white rounded-lg border">
                <div
                  v-for="(color, index) in lightSwatches[paletteName]"
                  :key="index"
                  class="flex-1 h-12 rounded"
                  :style="{ backgroundColor: color }"
                />
              </div>
            </div>

            <!-- Dark Mode -->
            <div>
              <p class="text-xs text-muted-foreground mb-2">Dark Mode</p>
              <div class="flex gap-2 p-4 bg-gray-950 rounded-lg border">
                <div
                  v-for="(color, index) in darkSwatches[paletteName]"
                  :key="index"
                  class="flex-1 h-12 rounded"
                  :style="{ backgroundColor: color }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
}

export const DynamicSeriesCount: Story = {
  render: () => ({
    components: { MeldBarChart, Card, CardHeader, CardTitle, CardContent },
    setup() {
      const generateConfig = (count: number): MeldChartConfig => ({
        series: Array.from({ length: count }, (_, i) => ({
          name: `Series ${i + 1}`,
          data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        })),
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        colors: 'vibrant',
        legend: { position: 'bottom' },
      })

      return { generateConfig }
    },
    template: `
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-bold mb-2">Automatic Color Generation</h2>
          <p class="text-muted-foreground">
            Palettes automatically generate the exact number of colors needed
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm">3 Series</CardTitle>
            </CardHeader>
            <CardContent>
              <MeldBarChart :config="generateConfig(3)" :height="200" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm">6 Series</CardTitle>
            </CardHeader>
            <CardContent>
              <MeldBarChart :config="generateConfig(6)" :height="200" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm">9 Series</CardTitle>
            </CardHeader>
            <CardContent>
              <MeldBarChart :config="generateConfig(9)" :height="200" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-3">
              <CardTitle class="text-sm">12 Series</CardTitle>
            </CardHeader>
            <CardContent>
              <MeldBarChart :config="generateConfig(12)" :height="200" />
            </CardContent>
          </Card>
        </div>
      </div>
    `,
  }),
}
