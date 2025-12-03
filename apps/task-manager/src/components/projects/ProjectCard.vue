<script setup lang="ts">
import { IconDotsVertical, IconEdit, IconTrash } from '@meldui/tabler-vue'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Progress,
} from '@meldui/vue'
import type { Project } from '@/types'

interface ProjectWithStats extends Project {
  taskCount: number
  completedCount: number
  progress: number
}

interface Props {
  project: ProjectWithStats
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [project: ProjectWithStats]
  delete: [project: ProjectWithStats]
}>()

const getColorClass = (color: string) => `bg-${color}-500`
</script>

<template>
  <Card class="relative overflow-hidden">
    <div :class="['absolute top-0 left-0 w-1 h-full', getColorClass(project.color)]" />
    <CardHeader class="pb-2">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div :class="['h-3 w-3 rounded-full', getColorClass(project.color)]" />
          <CardTitle class="text-lg">{{ project.name }}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <IconDotsVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="emit('edit', project)">
              <IconEdit class="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem class="text-destructive" @click="emit('delete', project)">
              <IconTrash class="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardDescription class="line-clamp-2">{{ project.description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">{{ project.taskCount }} tasks</span>
          <span class="text-muted-foreground">{{ project.completedCount }} completed</span>
        </div>
        <Progress :model-value="project.progress" class="h-2" />
        <p class="text-xs text-muted-foreground text-right">{{ project.progress }}% complete</p>
      </div>
    </CardContent>
  </Card>
</template>
