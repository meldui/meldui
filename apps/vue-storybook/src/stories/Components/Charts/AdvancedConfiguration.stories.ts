import type {
  MeldBarChartConfig,
  MeldLineChartConfig,
  MeldScatterChartConfig,
} from '@meldui/charts-vue'
import { MeldBarChart, MeldLineChart, MeldScatterChart } from '@meldui/charts-vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

// ECharts tooltip param type for formatter
interface TooltipParam {
  axisValueLabel: string
  color: string
  value: number
  seriesName: string
}

const meta: Meta = {
  title: 'Components/Charts/AdvancedConfiguration',
  parameters: {
    docs: {
      description: {
        component:
          'Advanced configuration examples using the `advanced` escape hatch for complex ECharts features not covered by the simplified API.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: {
      MeldLineChart,
      MeldBarChart,
      MeldScatterChart,
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
    },
    setup() {
      // Example 1: Mark Points and Mark Lines
      const markPointConfig: MeldLineChartConfig = {
        series: [
          {
            name: 'Temperature',
            data: [15, 23, 24, 28, 32, 35, 38, 36, 30, 25, 20, 18],
          },
        ],
        xAxis: {
          categories: [
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
          ],
        },
        stroke: {
          curve: 'smooth',
        },
        // Advanced ECharts config
        advanced: {
          series: [
            {
              markPoint: {
                data: [
                  { type: 'max', name: 'Peak', itemStyle: { color: '#ef4444' } },
                  { type: 'min', name: 'Lowest', itemStyle: { color: '#3b82f6' } },
                ],
                label: {
                  formatter: '{c}°C',
                },
              },
              markLine: {
                data: [
                  {
                    type: 'average',
                    name: 'Average',
                    lineStyle: { color: '#f59e0b', type: 'dashed' },
                  },
                ],
                label: {
                  formatter: 'Avg: {c}°C',
                },
              },
            },
          ],
        },
      }

      // Example 2: Custom Item Styles
      const customStyleConfig: MeldBarChartConfig = {
        series: [
          {
            name: 'Sales',
            data: [320, 302, 301, 334, 390, 330, 320],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        advanced: {
          series: [
            {
              itemStyle: {
                borderRadius: [10, 10, 0, 0],
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 5,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 20,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        },
      }

      // Example 3: Background with Visual Map
      const visualMapConfig: MeldBarChartConfig = {
        series: [
          {
            name: 'Score',
            data: [65, 70, 55, 80, 85, 90, 75, 88, 92, 78],
          },
        ],
        xAxis: {
          categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
        },
        advanced: {
          visualMap: {
            top: 10,
            right: 10,
            pieces: [
              {
                gt: 0,
                lte: 60,
                color: '#ef4444',
                label: 'Poor (0-60)',
              },
              {
                gt: 60,
                lte: 75,
                color: '#f59e0b',
                label: 'Fair (60-75)',
              },
              {
                gt: 75,
                lte: 85,
                color: '#3b82f6',
                label: 'Good (75-85)',
              },
              {
                gt: 85,
                lte: 100,
                color: '#10b981',
                label: 'Excellent (85-100)',
              },
            ],
            outOfRange: {
              color: '#999',
            },
          },
          series: [
            {
              type: 'line',
              smooth: true,
              lineStyle: {
                width: 4,
              },
            },
          ],
        },
      }

      // Example 4: Regression Line
      const regressionConfig: MeldScatterChartConfig = {
        series: [
          {
            name: 'Data Points',
            data: [
              [10, 15],
              [20, 25],
              [30, 28],
              [40, 35],
              [50, 42],
              [60, 48],
              [70, 55],
              [80, 62],
            ],
          },
        ],
        advanced: {
          xAxis: {
            type: 'value',
            name: 'X Axis',
            nameLocation: 'middle',
            nameGap: 30,
          },
          yAxis: {
            type: 'value',
            name: 'Y Axis',
            nameLocation: 'middle',
            nameGap: 40,
          },
          series: [
            {
              type: 'scatter',
              symbolSize: 12,
              itemStyle: {
                color: '#3b82f6',
              },
            },
            {
              name: 'Trend Line',
              type: 'line',
              data: [
                [10, 12],
                [80, 65],
              ],
              lineStyle: {
                color: '#ef4444',
                type: 'dashed',
                width: 2,
              },
              symbol: 'none',
              markLine: {
                data: [{ type: 'average', name: 'Average' }],
              },
            },
          ],
        },
      }

      // Example 5: Custom Tooltip with HTML
      const customTooltipConfig: MeldLineChartConfig = {
        series: [
          {
            name: 'Revenue',
            data: [1200, 1400, 1350, 1600, 1550, 1800, 2000],
          },
          {
            name: 'Profit',
            data: [300, 350, 320, 400, 380, 450, 500],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        advanced: {
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderColor: '#3b82f6',
            borderWidth: 1,
            textStyle: {
              color: '#fff',
              fontSize: 14,
            },
            formatter: (params: TooltipParam[]) => {
              let tooltip = `<div style="padding: 8px;">`
              tooltip += `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValueLabel}</div>`

              params.forEach((param: TooltipParam) => {
                const color = param.color
                const value = param.value
                const name = param.seriesName
                const percentage =
                  name === 'Profit' && params[0]
                    ? ((value / params[0].value) * 100).toFixed(1)
                    : null

                tooltip += `
                  <div style="display: flex; align-items: center; margin-bottom: 4px;">
                    <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                    <span style="flex: 1;">${name}:</span>
                    <span style="font-weight: bold; margin-left: 8px;">$${value}</span>
                    ${percentage ? `<span style="margin-left: 8px; color: #10b981;">(${percentage}%)</span>` : ''}
                  </div>
                `
              })

              tooltip += `</div>`
              return tooltip
            },
          },
        },
      }

      // Example 6: Data Zoom
      const dataZoomConfig: MeldLineChartConfig = {
        series: [
          {
            name: 'Visits',
            data: Array.from(
              { length: 100 },
              (_, i) => Math.sin(i * 0.1) * 50 + 150 + Math.random() * 30,
            ),
          },
        ],
        xAxis: {
          categories: Array.from({ length: 100 }, (_, i) => `Day ${i + 1}`),
        },
        advanced: {
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 30,
            },
            {
              start: 0,
              end: 30,
              handleIcon:
                'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#3b82f6',
              },
            },
          ],
        },
      }

      return {
        markPointConfig,
        customStyleConfig,
        visualMapConfig,
        regressionConfig,
        customTooltipConfig,
        dataZoomConfig,
      }
    },
    template: `
      <div class="space-y-8">
        <!-- Introduction -->
        <Card>
          <CardHeader>
            <CardTitle>Advanced Configuration</CardTitle>
            <CardDescription>
              These examples demonstrate the <code>advanced</code> escape hatch for accessing powerful ECharts features
              not covered by the simplified API. The advanced config is merged with the base configuration.
            </CardDescription>
          </CardHeader>
        </Card>

        <!-- Mark Points & Lines -->
        <Card>
          <CardHeader>
            <CardTitle>Mark Points & Mark Lines</CardTitle>
            <CardDescription>
              Highlight maximum, minimum, and average values with annotations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeldLineChart :config="markPointConfig" :height="350" />
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                View Code
              </summary>
              <pre class="mt-2 rounded-md bg-muted p-4 text-xs overflow-x-auto"><code>advanced: {
  series: [{
    markPoint: {
      data: [
        { type: 'max', name: 'Peak' },
        { type: 'min', name: 'Lowest' }
      ]
    },
    markLine: {
      data: [{ type: 'average', name: 'Average' }]
    }
  }]
}</code></pre>
            </details>
          </CardContent>
        </Card>

        <!-- Custom Item Styles -->
        <Card>
          <CardHeader>
            <CardTitle>Custom Item Styles & Shadows</CardTitle>
            <CardDescription>
              Rounded corners, shadows, and hover effects using itemStyle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeldBarChart :config="customStyleConfig" :height="350" />
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                View Code
              </summary>
              <pre class="mt-2 rounded-md bg-muted p-4 text-xs overflow-x-auto"><code>advanced: {
  series: [{
    itemStyle: {
      borderRadius: [10, 10, 0, 0],
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 20
      }
    }
  }]
}</code></pre>
            </details>
          </CardContent>
        </Card>

        <!-- Visual Map -->
        <Card>
          <CardHeader>
            <CardTitle>Visual Map (Color by Value)</CardTitle>
            <CardDescription>
              Automatically color data points based on value ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeldLineChart :config="visualMapConfig" :height="350" />
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                View Code
              </summary>
              <pre class="mt-2 rounded-md bg-muted p-4 text-xs overflow-x-auto"><code>advanced: {
  visualMap: {
    pieces: [
      { gt: 0, lte: 60, color: '#ef4444', label: 'Poor' },
      { gt: 60, lte: 75, color: '#f59e0b', label: 'Fair' },
      { gt: 75, lte: 85, color: '#3b82f6', label: 'Good' },
      { gt: 85, lte: 100, color: '#10b981', label: 'Excellent' }
    ]
  }
}</code></pre>
            </details>
          </CardContent>
        </Card>

        <!-- Regression Line -->
        <Card>
          <CardHeader>
            <CardTitle>Regression/Trend Line</CardTitle>
            <CardDescription>
              Add trend lines to scatter plots for correlation analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeldScatterChart :config="regressionConfig" :height="400" />
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                View Code
              </summary>
              <pre class="mt-2 rounded-md bg-muted p-4 text-xs overflow-x-auto"><code>advanced: {
  series: [
    { type: 'scatter', /* scatter data */ },
    {
      name: 'Trend Line',
      type: 'line',
      data: [[10, 12], [80, 65]],
      lineStyle: { type: 'dashed' },
      symbol: 'none'
    }
  ]
}</code></pre>
            </details>
          </CardContent>
        </Card>

        <!-- Custom Tooltip -->
        <Card>
          <CardHeader>
            <CardTitle>Custom HTML Tooltip</CardTitle>
            <CardDescription>
              Rich tooltip formatting with HTML, calculations, and custom styling (hover to see)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeldLineChart :config="customTooltipConfig" :height="350" />
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                View Code
              </summary>
              <pre class="mt-2 rounded-md bg-muted p-4 text-xs overflow-x-auto"><code>advanced: {
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    formatter: (params) => {
      // Custom HTML with calculations
      return \`<div>\${params[0].axisValueLabel}</div>\`
    }
  }
}</code></pre>
            </details>
          </CardContent>
        </Card>

        <!-- Data Zoom -->
        <Card>
          <CardHeader>
            <CardTitle>Data Zoom & Pan</CardTitle>
            <CardDescription>
              Interactive zoom and pan for large datasets (use mouse wheel or drag the slider)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeldLineChart :config="dataZoomConfig" :height="400" />
            <details class="mt-4">
              <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                View Code
              </summary>
              <pre class="mt-2 rounded-md bg-muted p-4 text-xs overflow-x-auto"><code>advanced: {
  dataZoom: [
    {
      type: 'inside',  // Mouse wheel zoom
      start: 0,
      end: 30
    },
    {
      type: 'slider',  // Slider control
      start: 0,
      end: 30
    }
  ]
}</code></pre>
            </details>
          </CardContent>
        </Card>

        <!-- Footer Note -->
        <Card>
          <CardContent class="pt-6">
            <p class="text-sm text-muted-foreground">
              <strong>Note:</strong> The <code>advanced</code> configuration accepts any valid
              <a
                href="https://echarts.apache.org/en/option.html"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                ECharts option
              </a>.
              It's merged with the base configuration, allowing you to override or extend any aspect of the chart.
              Use this for edge cases not covered by the simplified API.
            </p>
          </CardContent>
        </Card>
      </div>
    `,
  }),
}

export const GradientFills: Story = {
  render: () => ({
    components: { MeldBarChart, Card, CardHeader, CardTitle, CardDescription, CardContent },
    setup() {
      const config: MeldBarChartConfig = {
        series: [
          {
            name: 'Sales',
            data: [120, 200, 150, 80, 70, 110, 130],
          },
        ],
        xAxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        advanced: {
          series: [
            {
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#3b82f6' },
                    { offset: 1, color: '#8b5cf6' },
                  ],
                },
                borderRadius: [8, 8, 0, 0],
              },
            },
          ],
        },
      }

      return { config }
    },
    template: `
      <Card>
        <CardHeader>
          <CardTitle>Gradient Fills</CardTitle>
          <CardDescription>
            Apply linear or radial gradients to chart elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MeldBarChart :config="config" :height="350" />
          <details class="mt-4">
            <summary class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              View Code
            </summary>
            <pre class="mt-2 rounded-md bg-muted p-4 text-xs overflow-x-auto"><code>advanced: {
  series: [{
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#3b82f6' },
          { offset: 1, color: '#8b5cf6' }
        ]
      }
    }
  }]
}</code></pre>
          </details>
        </CardContent>
      </Card>
    `,
  }),
}
