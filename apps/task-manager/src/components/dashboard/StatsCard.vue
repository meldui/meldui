<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, Progress } from '@meldui/vue'
import type { Component } from 'vue'

interface Props {
  title: string
  value: string | number
  description?: string
  icon: Component
  progress?: number
  trend?: {
    value: number
    isPositive: boolean
  }
}

defineProps<Props>()
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">{{ title }}</CardTitle>
      <component :is="icon" class="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">{{ value }}</div>
      <p v-if="description" class="text-xs text-muted-foreground">
        {{ description }}
      </p>
      <div v-if="trend" class="flex items-center text-xs mt-1">
        <span :class="trend.isPositive ? 'text-green-600' : 'text-red-600'">
          {{ trend.isPositive ? '+' : '' }}{{ trend.value }}%
        </span>
        <span class="text-muted-foreground ml-1">from last week</span>
      </div>
      <Progress v-if="progress !== undefined" :model-value="progress" class="mt-2 h-1" />
    </CardContent>
  </Card>
</template>
