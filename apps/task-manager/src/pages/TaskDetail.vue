<script setup lang="ts">
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowUp,
  IconCalendar,
  IconCircleCheck,
  IconCircleDashed,
  IconEdit,
  IconFolder,
  IconMinus,
  IconProgress,
  IconTag,
  IconTrash,
} from '@meldui/tabler-vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  RelativeTime,
  Separator,
  Skeleton,
  Timeline,
  TimelineConnector,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
} from '@meldui/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { getProject } from '@/stores/projects'
import { deleteTask, getTask } from '@/stores/tasks'
import type { Task } from '@/types'

const route = useRoute()
const router = useRouter()

const task = ref<Task | undefined>()
const isLoading = ref(true)
const isEditDialogOpen = ref(false)

onMounted(() => {
  const id = route.params.id as string
  task.value = getTask(id)
  isLoading.value = false

  if (!task.value) {
    toast.error('Task not found')
    router.push('/tasks')
  }
})

const project = computed(() => {
  if (task.value?.projectId) {
    return getProject(task.value.projectId)
  }
  return null
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done':
      return 'text-green-500'
    case 'in-progress':
      return 'text-blue-500'
    default:
      return 'text-yellow-500'
  }
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'done':
      return 'default' as const
    case 'in-progress':
      return 'secondary' as const
    default:
      return 'neutral' as const
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'in-progress':
      return 'In Progress'
    case 'todo':
      return 'To Do'
    case 'done':
      return 'Done'
    default:
      return status
  }
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return IconArrowUp
    case 'medium':
      return IconMinus
    case 'low':
      return IconArrowDown
    default:
      return IconMinus
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-500'
    case 'medium':
      return 'text-yellow-500'
    case 'low':
      return 'text-green-500'
    default:
      return ''
  }
}

const handleDelete = () => {
  if (task.value) {
    deleteTask(task.value.id)
    toast.success('Task deleted')
    router.push('/tasks')
  }
}

const handleEditComplete = () => {
  isEditDialogOpen.value = false
  // Refresh task data
  const id = route.params.id as string
  task.value = getTask(id)
  toast.success('Task updated')
}

// Mock timeline data based on task
const timelineItems = computed(() => {
  if (!task.value) return []
  return [
    {
      id: '1',
      action: 'created',
      description: 'Task created',
      timestamp: task.value.createdAt,
      icon: IconCircleDashed,
      color: 'text-blue-500',
    },
    ...(task.value.updatedAt !== task.value.createdAt
      ? [
          {
            id: '2',
            action: 'updated',
            description: 'Task updated',
            timestamp: task.value.updatedAt,
            icon: getStatusIcon(task.value.status),
            color: getStatusColor(task.value.status),
          },
        ]
      : []),
  ]
})
</script>

<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <template v-if="isLoading">
      <Skeleton class="h-8 w-48" />
      <Skeleton class="h-64 w-full" />
    </template>

    <!-- Content -->
    <template v-else-if="task">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="router.push('/tasks')">
          <IconArrowLeft class="h-5 w-5" />
        </Button>
        <div class="flex-1">
          <h1 class="text-2xl font-bold">{{ task.title }}</h1>
          <p class="text-muted-foreground">
            Created <RelativeTime :date="task.createdAt" />
          </p>
        </div>
        <div class="flex gap-2">
          <Dialog v-model:open="isEditDialogOpen">
            <Button variant="outline" @click="isEditDialogOpen = true">
              <IconEdit class="mr-2 h-4 w-4" />
              Edit
            </Button>
            <DialogContent class="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>Update task details</DialogDescription>
              </DialogHeader>
              <TaskForm :task="task" @submit="handleEditComplete" @cancel="isEditDialogOpen = false" />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="destructive">
                <IconTrash class="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{{ task.title }}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction @click="handleDelete">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <!-- Main Content -->
        <div class="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p v-if="task.description" class="text-muted-foreground whitespace-pre-wrap">
                {{ task.description }}
              </p>
              <p v-else class="text-muted-foreground italic">No description provided</p>
            </CardContent>
          </Card>

          <!-- Timeline -->
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Task history</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline>
                <TimelineItem v-for="(item, index) in timelineItems" :key="item.id">
                  <TimelineConnector v-if="index < timelineItems.length - 1" />
                  <TimelineHeader>
                    <TimelineDot :class="item.color">
                      <component :is="item.icon" class="h-3 w-3" />
                    </TimelineDot>
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium">{{ item.description }}</span>
                      <span class="text-xs text-muted-foreground">
                        <RelativeTime :date="item.timestamp" />
                      </span>
                    </div>
                  </TimelineHeader>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- Status -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Status</span>
                <Badge :variant="getStatusBadgeVariant(task.status)">
                  {{ getStatusLabel(task.status) }}
                </Badge>
              </div>

              <Separator />

              <!-- Priority -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Priority</span>
                <div class="flex items-center gap-1">
                  <component
                    :is="getPriorityIcon(task.priority)"
                    :class="['h-4 w-4', getPriorityColor(task.priority)]"
                  />
                  <span class="capitalize">{{ task.priority }}</span>
                </div>
              </div>

              <Separator />

              <!-- Project -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Project</span>
                <div v-if="project" class="flex items-center gap-2">
                  <IconFolder class="h-4 w-4 text-muted-foreground" />
                  <span>{{ project.name }}</span>
                </div>
                <span v-else class="text-muted-foreground">—</span>
              </div>

              <Separator />

              <!-- Due Date -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Due Date</span>
                <div v-if="task.dueDate" class="flex items-center gap-2">
                  <IconCalendar class="h-4 w-4 text-muted-foreground" />
                  <span>{{ new Date(task.dueDate).toLocaleDateString() }}</span>
                </div>
                <span v-else class="text-muted-foreground">—</span>
              </div>

              <Separator />

              <!-- Tags -->
              <div class="space-y-2">
                <span class="text-sm text-muted-foreground">Tags</span>
                <div v-if="task.tags.length > 0" class="flex flex-wrap gap-1">
                  <Badge v-for="tag in task.tags" :key="tag" variant="secondary">
                    <IconTag class="mr-1 h-3 w-3" />
                    {{ tag }}
                  </Badge>
                </div>
                <span v-else class="text-muted-foreground text-sm">No tags</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </template>
  </div>
</template>
