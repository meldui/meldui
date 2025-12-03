<script setup lang="ts">
import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from '@meldui/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { addProject, projectColors, updateProject } from '@/stores/projects'
import type { Project } from '@/types'

interface Props {
  project?: Project
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  color: z.string().min(1, 'Color is required'),
})

type ProjectFormValues = z.infer<typeof projectSchema>

const { handleSubmit, values, setFieldValue } = useForm<ProjectFormValues>({
  validationSchema: toTypedSchema(projectSchema),
  initialValues: {
    name: props.project?.name || '',
    description: props.project?.description || '',
    color: props.project?.color || 'blue',
  },
})

const onSubmit = handleSubmit((formValues) => {
  if (props.project) {
    updateProject(props.project.id, {
      name: formValues.name,
      description: formValues.description || '',
      color: formValues.color,
    })
  } else {
    addProject({
      name: formValues.name,
      description: formValues.description || '',
      color: formValues.color,
    })
  }
  emit('submit')
})
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <!-- Name -->
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Enter project name" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Description -->
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            v-bind="componentField"
            placeholder="Enter project description"
            :rows="3"
          />
        </FormControl>
        <FormDescription>Optional description for the project</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Color -->
    <FormField name="color">
      <FormItem>
        <FormLabel>Color</FormLabel>
        <FormControl>
          <RadioGroup
            :model-value="values.color"
            class="flex flex-wrap gap-2"
            @update:model-value="(val) => setFieldValue('color', val)"
          >
            <div v-for="color in projectColors" :key="color.value">
              <RadioGroupItem
                :id="`color-${color.value}`"
                :value="color.value"
                class="peer sr-only"
              />
              <Label
                :for="`color-${color.value}`"
                :class="[
                  'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 transition-all',
                  color.class,
                  values.color === color.value
                    ? 'border-foreground ring-2 ring-offset-2 ring-offset-background'
                    : 'border-transparent hover:border-muted-foreground/50',
                ]"
              >
                <span class="sr-only">{{ color.label }}</span>
              </Label>
            </div>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Actions -->
    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" @click="emit('cancel')">Cancel</Button>
      <Button type="submit">{{ project ? 'Update' : 'Create' }} Project</Button>
    </div>
  </form>
</template>
