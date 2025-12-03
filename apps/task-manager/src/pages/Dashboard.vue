<script setup lang="ts">
import {
  IconAlertTriangle,
  IconChecklist,
  IconCircleCheck,
  IconPlus,
  IconProgress,
} from '@meldui/tabler-vue'
import { Button, Card, CardContent } from '@meldui/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import RecentActivity from '@/components/dashboard/RecentActivity.vue'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import TaskChart from '@/components/dashboard/TaskChart.vue'
import { projectsWithStats } from '@/stores/projects'
import { taskStats } from '@/stores/tasks'

const router = useRouter()

const completionRate = computed(() => {
  if (taskStats.value.total === 0) return 0
  return Math.round((taskStats.value.done / taskStats.value.total) * 100)
})

const stats = computed(() => [
  {
    title: 'Total Tasks',
    value: taskStats.value.total,
    description: `${taskStats.value.inProgress} in progress`,
    icon: IconChecklist,
    progress: completionRate.value,
  },
  {
    title: 'In Progress',
    value: taskStats.value.inProgress,
    description: 'Active tasks',
    icon: IconProgress,
  },
  {
    title: 'Completed',
    value: taskStats.value.done,
    description: `${completionRate.value}% completion rate`,
    icon: IconCircleCheck,
    trend: { value: 12, isPositive: true },
  },
  {
    title: 'Overdue',
    value: taskStats.value.overdue,
    description: 'Need attention',
    icon: IconAlertTriangle,
  },
])
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-muted-foreground">Overview of your tasks and projects</p>
      </div>
      <Button @click="router.push('/tasks')">
        <IconPlus class="mr-2 h-4 w-4" />
        New Task
      </Button>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :description="stat.description"
        :icon="stat.icon"
        :progress="stat.progress"
        :trend="stat.trend"
      />
    </div>

    <!-- Charts and Activity -->
    <div class="grid gap-4 md:grid-cols-2">
      <TaskChart />
      <RecentActivity />
    </div>

    <!-- Projects Overview -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Projects</h2>
        <Button variant="ghost" size="sm" @click="router.push('/projects')">
          View all
        </Button>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <Card
          v-for="project in projectsWithStats.slice(0, 3)"
          :key="project.id"
          class="cursor-pointer hover:bg-accent transition-colors"
          @click="router.push('/projects')"
        >
          <CardContent class="p-4">
            <div class="flex items-center gap-3 mb-2">
              <div :class="`h-3 w-3 rounded-full bg-${project.color}-500`" />
              <h3 class="font-medium">{{ project.name }}</h3>
            </div>
            <p class="text-sm text-muted-foreground mb-2">{{ project.taskCount }} tasks</p>
            <div class="h-1.5 w-full rounded-full bg-muted">
              <div
                :class="`h-full rounded-full bg-${project.color}-500`"
                :style="{ width: `${project.progress}%` }"
              />
            </div>
            <p class="text-xs text-muted-foreground mt-1">{{ project.progress }}% complete</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
