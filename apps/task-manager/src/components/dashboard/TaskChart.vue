<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@meldui/vue'
import { computed } from 'vue'
import { allTasks, tasksByStatus } from '@/stores/tasks'

// Simple bar chart using CSS - avoiding charts-vue complexity for now
const chartData = computed(() => {
  const statuses = ['todo', 'in-progress', 'done'] as const
  const total = allTasks.value.length || 1

  return statuses.map((status) => ({
    status,
    label:
      status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1),
    count: tasksByStatus.value[status].length,
    percentage: Math.round((tasksByStatus.value[status].length / total) * 100),
    color:
      status === 'todo'
        ? 'bg-yellow-500'
        : status === 'in-progress'
          ? 'bg-blue-500'
          : 'bg-green-500',
  }))
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Task Distribution</CardTitle>
      <CardDescription>Tasks by status</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div v-for="item in chartData" :key="item.status" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">{{ item.label }}</span>
            <span class="text-muted-foreground">{{ item.count }} ({{ item.percentage }}%)</span>
          </div>
          <div class="h-2 w-full rounded-full bg-muted">
            <div
              :class="['h-full rounded-full transition-all', item.color]"
              :style="{ width: `${item.percentage}%` }"
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
