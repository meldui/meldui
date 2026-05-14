<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DemoBlock from '../../../components/DemoBlock.vue'
import { DataTable, useDataTableController } from '@meldui/vue'
import {
  MOCK_USERS,
  type ServerResponse,
  filterFields,
  simulateServerSide,
  userColumns,
} from './_shared'

// Simulated initial URL query — in a real app, source from `useRoute()`.
const initialQuery = { page: 2, size: 10, sort: 'name:asc', role: 'user' }

const { sorting, filters, pagination, state } = useDataTableController({
  pageSize: initialQuery.size,
  initialSorting: initialQuery.sort
    ? [{ id: initialQuery.sort.split(':')[0]!, desc: initialQuery.sort.endsWith(':desc') }]
    : [],
  initialFilters: initialQuery.role ? { role: initialQuery.role } : {},
  initialPagination: { pageIndex: initialQuery.page, pageSize: initialQuery.size },
})

const persistedUrl = ref('')
const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))

watch(
  state,
  (s) => {
    persistedUrl.value =
      `?page=${s.pagination.pageIndex}` +
      `&size=${s.pagination.pageSize}` +
      (s.sorting[0] ? `&sort=${s.sorting[0].id}:${s.sorting[0].desc ? 'desc' : 'asc'}` : '') +
      (typeof s.filters.role === 'string' && s.filters.role ? `&role=${s.filters.role}` : '')
    localData.value = simulateServerSide(MOCK_USERS, s)
  },
  { deep: true, immediate: true },
)

const code = `<script setup lang="ts">
// Pull useRoute / useRouter from your router (e.g. vue-router).
const route = useRoute()
const router = useRouter()

const { sorting, filters, pagination, state } = useDataTableController({
  pageSize: Number(route.query.size) || 10,
  initialSorting: parseSorting(route.query.sort as string),
  initialFilters: parseFilters(route.query),
  initialPagination: {
    pageIndex: Number(route.query.page) || 0,
    pageSize: Number(route.query.size) || 10,
  },
})

watch(state, (s) => {
  router.replace({ query: serializeState(s) })
  fetchPage()
}, { deep: true })
<\/script>`

void computed
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-3">
      <p class="rounded-md bg-muted px-3 py-2 font-mono text-xs">
        <span class="text-muted-foreground">simulated URL → </span>{{ persistedUrl }}
      </p>
      <DataTable
        :columns="userColumns"
        :data="localData.data"
        :page-count="localData.meta.total_pages"
        :total-rows="localData.meta.total"
        :filter-fields="filterFields"
        enable-sorting
        enable-filter
        enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    </div>
  </DemoBlock>
</template>
