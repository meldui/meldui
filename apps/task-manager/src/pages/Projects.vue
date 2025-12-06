<script setup lang="ts">
import { IconPlus } from '@meldui/tabler-vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Empty,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  toast,
} from '@meldui/vue'
import { ref } from 'vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import ProjectForm from '@/components/projects/ProjectForm.vue'
import { deleteProject, projectsWithStats } from '@/stores/projects'
import type { Project } from '@/types'

interface ProjectWithStats extends Project {
  taskCount: number
  completedCount: number
  progress: number
}

const isSheetOpen = ref(false)
const editingProject = ref<ProjectWithStats | null>(null)
const deletingProject = ref<ProjectWithStats | null>(null)
const isDeleteDialogOpen = ref(false)

const handleCreate = () => {
  editingProject.value = null
  isSheetOpen.value = true
}

const handleEdit = (project: ProjectWithStats) => {
  editingProject.value = project
  isSheetOpen.value = true
}

const handleDeleteClick = (project: ProjectWithStats) => {
  deletingProject.value = project
  isDeleteDialogOpen.value = true
}

const handleConfirmDelete = () => {
  if (deletingProject.value) {
    deleteProject(deletingProject.value.id)
    toast.success('Project deleted', { description: deletingProject.value.name })
    deletingProject.value = null
  }
  isDeleteDialogOpen.value = false
}

const handleFormSubmit = () => {
  isSheetOpen.value = false
  toast.success(editingProject.value ? 'Project updated' : 'Project created')
  editingProject.value = null
}

const handleFormCancel = () => {
  isSheetOpen.value = false
  editingProject.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Projects</h1>
        <p class="text-muted-foreground">Organize tasks into projects</p>
      </div>
      <Sheet v-model:open="isSheetOpen">
        <SheetTrigger as-child>
          <Button @click="handleCreate">
            <IconPlus class="mr-2 h-4 w-4" />
            New Project
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{{ editingProject ? 'Edit' : 'Create' }} Project</SheetTitle>
            <SheetDescription>
              {{ editingProject ? 'Update project details' : 'Add a new project to organize your tasks' }}
            </SheetDescription>
          </SheetHeader>
          <div class="flex-1 overflow-y-auto px-4 pb-4">
            <ProjectForm
              :project="editingProject || undefined"
              @submit="handleFormSubmit"
              @cancel="handleFormCancel"
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Projects Grid -->
    <div v-if="projectsWithStats.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        v-for="project in projectsWithStats"
        :key="project.id"
        :project="project"
        @edit="handleEdit"
        @delete="handleDeleteClick"
      />
    </div>

    <!-- Empty State -->
    <Empty
      v-else
      title="No projects yet"
      description="Create a project to organize your tasks"
      class="py-12"
    >
      <template #action>
        <Button @click="handleCreate">
          <IconPlus class="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </template>
    </Empty>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="isDeleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{{ deletingProject?.name }}"?
            Tasks in this project will not be deleted but will become unassigned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="deletingProject = null">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleConfirmDelete">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
