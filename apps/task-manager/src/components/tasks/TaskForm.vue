<script setup lang="ts">
import { type CalendarDate, parseDate } from '@internationalized/date'
import { IconCalendar } from '@meldui/tabler-vue'
import {
  Button,
  Calendar,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  Textarea,
} from '@meldui/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { z } from 'zod'
import { allProjects } from '@/stores/projects'
import { addTask, updateTask } from '@/stores/tasks'
import type { Task } from '@/types'

interface Props {
  task?: Task
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

// Form schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(['todo', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  projectId: z.string().nullable(),
  tags: z.array(z.string()),
  dueDate: z.string().nullable(),
})

type TaskFormValues = z.infer<typeof taskSchema>

const { handleSubmit, values, setFieldValue } = useForm<TaskFormValues>({
  validationSchema: toTypedSchema(taskSchema),
  initialValues: {
    title: props.task?.title || '',
    description: props.task?.description || '',
    status: props.task?.status || 'todo',
    priority: props.task?.priority || 'medium',
    projectId: props.task?.projectId || null,
    tags: props.task?.tags || [],
    dueDate: props.task?.dueDate || null,
  },
})

// Date picker
const calendarValue = computed({
  get: () => {
    if (values.dueDate) {
      try {
        return parseDate(values.dueDate.split('T')[0])
      } catch {
        return undefined
      }
    }
    return undefined
  },
  set: (value: CalendarDate | undefined) => {
    if (value) {
      setFieldValue('dueDate', value.toString())
    } else {
      setFieldValue('dueDate', null)
    }
  },
})

const formattedDate = computed(() => {
  if (values.dueDate) {
    return new Date(values.dueDate).toLocaleDateString()
  }
  return 'Pick a date'
})

// Tags
const currentTags = computed({
  get: () => values.tags,
  set: (newTags: string[]) => setFieldValue('tags', newTags),
})

// Submit handler
const onSubmit = handleSubmit((formValues) => {
  if (props.task) {
    updateTask(props.task.id, {
      title: formValues.title,
      description: formValues.description || '',
      status: formValues.status,
      priority: formValues.priority,
      projectId: formValues.projectId,
      tags: formValues.tags,
      dueDate: formValues.dueDate,
    })
  } else {
    addTask({
      title: formValues.title,
      description: formValues.description || '',
      status: formValues.status,
      priority: formValues.priority,
      projectId: formValues.projectId,
      tags: formValues.tags,
      dueDate: formValues.dueDate,
    })
  }
  emit('submit')
})
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <!-- Title -->
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>Title</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Enter task title" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Description -->
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" placeholder="Enter task description" :rows="3" />
        </FormControl>
        <FormDescription>Optional details about the task</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Status & Priority Row -->
    <div class="grid grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="status">
        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="priority">
        <FormItem>
          <FormLabel>Priority</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Project -->
    <FormField v-slot="{ componentField }" name="projectId">
      <FormItem>
        <FormLabel>Project</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select project (optional)" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem :value="null">No project</SelectItem>
            <SelectItem v-for="project in allProjects" :key="project.id" :value="project.id">
              {{ project.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Due Date -->
    <FormField name="dueDate">
      <FormItem class="flex flex-col">
        <FormLabel>Due Date</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                :class="[
                  'w-full justify-start text-left font-normal',
                  !values.dueDate && 'text-muted-foreground',
                ]"
              >
                <IconCalendar class="mr-2 h-4 w-4" />
                {{ formattedDate }}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0" align="start">
            <Calendar v-model="calendarValue" />
          </PopoverContent>
        </Popover>
        <FormDescription>Optional deadline for the task</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Tags -->
    <FormField name="tags">
      <FormItem>
        <FormLabel>Tags</FormLabel>
        <FormControl>
          <TagsInput v-model="currentTags">
            <TagsInputItem v-for="tag in currentTags" :key="tag" :value="tag">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput placeholder="Add tags..." />
          </TagsInput>
        </FormControl>
        <FormDescription>Press Enter to add a tag</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Actions -->
    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" @click="emit('cancel')">Cancel</Button>
      <Button type="submit">{{ task ? 'Update' : 'Create' }} Task</Button>
    </div>
  </form>
</template>
