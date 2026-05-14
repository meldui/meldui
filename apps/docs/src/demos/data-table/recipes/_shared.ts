import {
  type DataTableFilterField,
  type DataTableFilterState,
  createColumnHelper,
} from '@meldui/vue'
import type { PaginationState, SortingState } from '@tanstack/vue-table'

export interface User {
  id: string
  name: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  department: 'platform' | 'design' | 'product' | 'mobile'
  created_at: string
}

const FIRST = ['Ada', 'Alan', 'Grace', 'Edsger', 'Linus', 'Donald', 'Margaret', 'Barbara']
const LAST = ['Lovelace', 'Turing', 'Hopper', 'Dijkstra', 'Torvalds', 'Knuth', 'Hamilton', 'Liskov']

export const MOCK_USERS: User[] = Array.from({ length: 56 }, (_, i) => ({
  id: `${i + 1}`,
  name: `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`,
  role: (['admin', 'user', 'user', 'guest', 'user'] as const)[i % 5],
  status: i % 4 === 0 ? 'inactive' : 'active',
  department: (['platform', 'design', 'product', 'mobile'] as const)[i % 4],
  created_at: new Date(2024, i % 12, ((i * 7) % 27) + 1).toISOString(),
}))

const helper = createColumnHelper<User>()

export const userColumns = [
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('role', { title: 'Role' }),
  helper.accessor('status', { title: 'Status' }),
  helper.accessor('department', { title: 'Department' }),
]

export const filterFields: DataTableFilterField<User>[] = [
  {
    id: 'role',
    type: 'select',
    label: 'Role',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' },
    ],
  },
  {
    id: 'status',
    type: 'multiselect',
    label: 'Status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    id: 'department',
    type: 'multiselect',
    label: 'Department',
    options: [
      { label: 'Platform', value: 'platform' },
      { label: 'Design', value: 'design' },
      { label: 'Product', value: 'product' },
      { label: 'Mobile', value: 'mobile' },
    ],
  },
]

interface SimState {
  sorting: SortingState
  filters: DataTableFilterState
  pagination: PaginationState
}

export interface ServerResponse {
  data: User[]
  meta: { current_page: number; per_page: number; total: number; total_pages: number }
}

export function simulateServerSide(allRows: User[], state: SimState): ServerResponse {
  let rows = [...allRows]

  for (const [key, value] of Object.entries(state.filters)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'string' && !value) continue
    if (Array.isArray(value) && value.length === 0) continue
    if (key === 'role' && typeof value === 'string') {
      rows = rows.filter((u) => u.role === value)
    } else if (key === 'status' && Array.isArray(value)) {
      rows = rows.filter((u) => (value as string[]).includes(u.status))
    } else if (key === 'department' && Array.isArray(value)) {
      rows = rows.filter((u) => (value as string[]).includes(u.department))
    }
  }

  const sort = state.sorting[0]
  if (sort) {
    const dir = sort.desc ? -1 : 1
    rows.sort((a, b) => {
      const av = a[sort.id as keyof User]
      const bv = b[sort.id as keyof User]
      if (av === bv) return 0
      return av > bv ? dir : -dir
    })
  }

  const total = rows.length
  const perPage = state.pagination.pageSize
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = state.pagination.pageIndex * perPage
  const data = rows.slice(start, start + perPage)

  return {
    data,
    meta: {
      current_page: state.pagination.pageIndex,
      per_page: perPage,
      total,
      total_pages: totalPages,
    },
  }
}
