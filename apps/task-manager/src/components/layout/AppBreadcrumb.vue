<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@meldui/vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTask } from '@/stores/tasks'

const route = useRoute()
const router = useRouter()

interface BreadcrumbEntry {
  name: string
  path?: string
}

const breadcrumbs = computed<BreadcrumbEntry[]>(() => {
  const items: BreadcrumbEntry[] = [{ name: 'Home', path: '/dashboard' }]

  if (route.name === 'dashboard') {
    items.push({ name: 'Dashboard' })
  } else if (route.name === 'tasks') {
    items.push({ name: 'Tasks' })
  } else if (route.name === 'task-detail') {
    items.push({ name: 'Tasks', path: '/tasks' })
    const task = getTask(route.params.id as string)
    items.push({ name: task?.title || 'Task Details' })
  } else if (route.name === 'projects') {
    items.push({ name: 'Projects' })
  } else if (route.name === 'settings') {
    items.push({ name: 'Settings' })
  }

  return items
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in breadcrumbs" :key="index">
        <BreadcrumbItem>
          <BreadcrumbLink
            v-if="item.path && index < breadcrumbs.length - 1"
            class="cursor-pointer"
            @click="router.push(item.path)"
          >
            {{ item.name }}
          </BreadcrumbLink>
          <BreadcrumbPage v-else>{{ item.name }}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
