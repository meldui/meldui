<script setup lang="ts">
import { IconCircleCheck, IconCircleDashed, IconProgress } from '@meldui/tabler-vue'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  RelativeTime,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@meldui/vue'
import { computed } from 'vue'
import { allTasks } from '@/stores/tasks'

const recentTasks = computed(() => {
  return [...allTasks.value]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
})

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'done':
      return IconCircleCheck
    case 'in-progress':
      return IconProgress
    default:
      return IconCircleDashed
  }
}

const getDotClass = (status: string) => {
  switch (status) {
    case 'done':
      return 'bg-green-100 text-green-600'
    case 'in-progress':
      return 'bg-blue-100 text-blue-600'
    default:
      return 'bg-yellow-100 text-yellow-600'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'in-progress':
      return 'In Progress'
    case 'todo':
      return 'todo'
    case 'done':
      return 'Done'
    default:
      return status
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
      <CardDescription>Latest task updates</CardDescription>
    </CardHeader>
    <CardContent>
      <Timeline>
        <TimelineItem v-for="(task, index) in recentTasks" :key="task.id">
          <TimelineSeparator>
            <TimelineDot size="lg" :class="`size-7 ${getDotClass(task.status)}`">
              <component :is="getStatusIcon(task.status)" class="size-4" />
            </TimelineDot>
            <TimelineConnector v-if="index < recentTasks.length - 1" />
          </TimelineSeparator>
          <TimelineContent>
            <TimelineHeader>
              <TimelineTitle>{{ task.title }}</TimelineTitle>
              <span class="text-xs text-muted-foreground">
                <RelativeTime :date="task.updatedAt" />
              </span>
            </TimelineHeader>
            <Badge variant="secondary" :outline="true" class="mt-1 text-xs capitalize">
              {{ getStatusLabel(task.status) }}
            </Badge>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </CardContent>
  </Card>
</template>
