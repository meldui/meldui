<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Badge, Card, CardContent, CardHeader, CardTitle, Filters } from '@meldui/vue'
import type { DataTableFilterField, FilterInstanceValue } from '@meldui/vue'

interface Project {
  id: string
  name: string
  owner: string
  status: 'active' | 'archived' | 'draft'
  team: string
}

const allProjects: Project[] = [
  { id: '1', name: 'Acme onboarding', owner: 'Ada', status: 'active', team: 'platform' },
  { id: '2', name: 'Q3 revamp', owner: 'Alan', status: 'draft', team: 'design' },
  { id: '3', name: 'Billing migration', owner: 'Grace', status: 'active', team: 'platform' },
  { id: '4', name: 'Internal CRM', owner: 'Edsger', status: 'archived', team: 'product' },
  { id: '5', name: 'Mobile app v2', owner: 'Linus', status: 'active', team: 'mobile' },
  { id: '6', name: 'API gateway', owner: 'Ada', status: 'draft', team: 'platform' },
  { id: '7', name: 'Marketing site', owner: 'Grace', status: 'active', team: 'design' },
]

const fields: DataTableFilterField<Project>[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Draft', value: 'draft' },
      { label: 'Archived', value: 'archived' },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    type: 'multiselect',
    options: [
      { label: 'Platform', value: 'platform' },
      { label: 'Design', value: 'design' },
      { label: 'Product', value: 'product' },
      { label: 'Mobile', value: 'mobile' },
    ],
  },
]

const filters = ref<Record<string, FilterInstanceValue>>({})

const filtered = computed(() => {
  let rows = [...allProjects]
  const search = filters.value.q
  if (typeof search === 'string' && search.length > 0) {
    const term = search.toLowerCase()
    rows = rows.filter(
      (p) => p.name.toLowerCase().includes(term) || p.owner.toLowerCase().includes(term),
    )
  }
  const status = filters.value.status
  if (typeof status === 'string' && status) rows = rows.filter((p) => p.status === status)
  const team = filters.value.team
  if (Array.isArray(team) && team.length > 0) rows = rows.filter((p) => team.includes(p.team))
  return rows
})

const statusVariant = (s: Project['status']) =>
  s === 'active' ? 'success' : s === 'draft' ? 'secondary' : 'neutral'

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { Filters, type DataTableFilterField, type FilterInstanceValue } from '@meldui/vue'

const fields: DataTableFilterField<Project>[] = [
  { id: 'status', label: 'Status', type: 'select', options: [...] },
  { id: 'team', label: 'Team', type: 'multiselect', options: [...] },
]

const filters = ref<Record<string, FilterInstanceValue>>({})
<\/script>

<template>
  <Filters
    :fields="fields"
    :search-field="{ id: 'q', placeholder: 'Search projects' }"
    v-model:filterValues="filters"
  />
  <!-- Render any view you like with \`filters\` -->
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-4">
      <Filters
        :fields="fields"
        :search-field="{ id: 'q', placeholder: 'Search projects or owners' }"
        v-model:filterValues="filters"
      />
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="project in filtered" :key="project.id">
          <CardHeader>
            <CardTitle class="text-sm">{{ project.name }}</CardTitle>
            <p class="text-xs text-muted-foreground">Owned by {{ project.owner }}</p>
          </CardHeader>
          <CardContent class="flex items-center justify-between">
            <Badge :variant="statusVariant(project.status)">{{ project.status }}</Badge>
            <span class="text-xs text-muted-foreground">{{ project.team }}</span>
          </CardContent>
        </Card>
        <p v-if="filtered.length === 0" class="col-span-full text-sm text-muted-foreground">
          No projects match the current filters.
        </p>
      </div>
    </div>
  </DemoBlock>
</template>
