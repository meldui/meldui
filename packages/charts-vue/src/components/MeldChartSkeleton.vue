<script setup lang="ts">
import { cn, Skeleton } from '@meldui/vue'
import { computed } from 'vue'
import type { MeldChartSkeletonProps } from '../types'

const props = withDefaults(defineProps<MeldChartSkeletonProps>(), {
  height: 350,
  width: '100%',
  animated: true,
  type: 'bar',
})

const computedHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

const computedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

// Determine skeleton category based on chart type
const skeletonType = computed(() => {
  switch (props.type) {
    case 'pie':
      return 'pie'
    case 'donut':
      return 'donut'
    case 'radar':
      return 'radar'
    case 'scatter':
      return 'scatter'
    default:
      // bar, line, area, heatmap, mixed all use cartesian skeleton
      return 'cartesian'
  }
})

// Generate random bar heights for cartesian charts
const barHeights = Array.from({ length: 7 }, () => Math.floor(Math.random() * 60 + 20))

// Generate random dot positions for scatter chart (fewer dots, better spread)
const scatterDots = [
  { x: 15, y: 20, size: 100 },
  { x: 35, y: 60, size: 50 },
  { x: 25, y: 45, size: 120 },
  { x: 55, y: 30, size: 100 },
  { x: 70, y: 55, size: 80 },
  { x: 45, y: 75, size: 30 },
  { x: 80, y: 25, size: 60 },
  { x: 60, y: 70, size: 80 },
]
</script>

<template>
    <div
        :class="
            cn(
                'flex flex-col border border-border rounded-lg p-6 overflow-hidden bg-background',
            )
        "
        :style="{ height: computedHeight, width: computedWidth }"
        role="status"
        aria-label="Loading chart"
    >
        <!-- Header with title and legend -->
        <div class="flex justify-between items-center mb-6 shrink-0">
            <Skeleton
                :class="
                    cn('h-5 w-[120px] rounded-md', !animated && 'animate-none')
                "
            />
            <div class="flex gap-4">
                <Skeleton
                    v-for="i in 3"
                    :key="i"
                    :class="
                        cn(
                            'h-4 w-[60px] rounded-md',
                            !animated && 'animate-none',
                        )
                    "
                />
            </div>
        </div>

        <!-- Cartesian skeleton (bar, line, area, heatmap, mixed) -->
        <template v-if="skeletonType === 'cartesian'">
            <div
                class="flex-1 flex items-end justify-center py-8 min-h-[200px]"
            >
                <div class="flex items-end justify-evenly w-full h-full gap-4">
                    <div
                        v-for="(height, i) in barHeights"
                        :key="i"
                        class="flex-1 flex items-stretch min-w-0"
                        :style="{ height: `${height}%` }"
                    >
                        <Skeleton
                            :class="
                                cn(
                                    'w-full h-full rounded-t-md',
                                    !animated && 'animate-none',
                                )
                            "
                        />
                    </div>
                </div>
            </div>
            <!-- Axis labels -->
            <div class="mt-4 shrink-0">
                <div class="flex justify-between items-center gap-4">
                    <Skeleton
                        v-for="i in 7"
                        :key="i"
                        :class="
                            cn(
                                'h-3 w-full rounded-sm',
                                !animated && 'animate-none',
                            )
                        "
                    />
                </div>
            </div>
        </template>

        <!-- Pie skeleton -->
        <template v-else-if="skeletonType === 'pie'">
            <div class="flex-1 flex items-center justify-center min-h-[200px]">
                <div class="relative w-[180px] h-[180px]">
                    <Skeleton
                        :class="cn('rounded-full', !animated && 'animate-none')"
                        :style="{ width: '180px', height: '180px' }"
                    />
                    <!-- Segment lines overlay -->
                    <svg
                        class="absolute inset-0"
                        width="180"
                        height="180"
                        viewBox="0 0 180 180"
                    >
                        <line
                            x1="90"
                            y1="90"
                            x2="90"
                            y2="0"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-background"
                        />
                        <line
                            x1="90"
                            y1="90"
                            x2="180"
                            y2="90"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-background"
                        />
                        <line
                            x1="90"
                            y1="90"
                            x2="45"
                            y2="168"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-background"
                        />
                    </svg>
                </div>
            </div>
        </template>

        <!-- Donut skeleton -->
        <template v-else-if="skeletonType === 'donut'">
            <div class="flex-1 flex items-center justify-center min-h-[200px]">
                <div class="relative w-[180px] h-[180px]">
                    <!-- Outer ring -->
                    <Skeleton
                        :class="cn('rounded-full', !animated && 'animate-none')"
                        :style="{ width: '180px', height: '180px' }"
                    />
                    <!-- Inner hole (background color) -->
                    <div
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full bg-background"
                    />
                    <!-- Segment lines overlay -->
                    <svg
                        class="absolute inset-0"
                        width="180"
                        height="180"
                        viewBox="0 0 180 180"
                    >
                        <line
                            x1="90"
                            y1="35"
                            x2="90"
                            y2="0"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-background"
                        />
                        <line
                            x1="145"
                            y1="90"
                            x2="180"
                            y2="90"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-background"
                        />
                        <line
                            x1="62"
                            y1="138"
                            x2="45"
                            y2="168"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-background"
                        />
                    </svg>
                </div>
            </div>
        </template>

        <!-- Radar skeleton - circular shape -->
        <template v-else-if="skeletonType === 'radar'">
            <div class="flex-1 flex items-center justify-center min-h-[200px]">
                <Skeleton
                    :class="cn('rounded-full', !animated && 'animate-none')"
                    :style="{ width: '180px', height: '180px' }"
                />
            </div>
        </template>

        <!-- Scatter skeleton -->
        <template v-else-if="skeletonType === 'scatter'">
            <div class="flex-1 relative min-h-[200px]">
                <!-- Grid lines -->
                <div
                    class="absolute inset-4 border-l border-b border-muted-foreground/20"
                />
                <!-- Scatter dots -->
                <div class="absolute inset-4 h-full w-full">
                    <Skeleton
                        v-for="(dot, i) in scatterDots"
                        :key="i"
                        :class="
                            cn(
                                'absolute rounded-full',
                                !animated && 'animate-none',
                            )
                        "
                        :style="{
                            left: `${dot.x}%`,
                            top: `${dot.y}%`,
                            width: `${dot.size}px`,
                            height: `${dot.size}px`,
                        }"
                    />
                </div>
            </div>
            <!-- Axis labels -->
            <div class="mt-4 shrink-0">
                <div class="flex justify-between items-center gap-4">
                    <Skeleton
                        v-for="i in 5"
                        :key="i"
                        :class="
                            cn(
                                'h-3 w-full rounded-sm',
                                !animated && 'animate-none',
                            )
                        "
                    />
                </div>
            </div>
        </template>

        <!-- Screen reader announcement -->
        <span class="sr-only">Loading chart data...</span>
    </div>
</template>
