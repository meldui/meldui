/**
 * Shared utilities, mock data, and column definitions for DataTable stories
 */

import { IconDotsVertical, IconPencil, IconTrash } from '@meldui/tabler-vue'
import {
  Badge,
  Button,
  Checkbox,
  DataTableColumnHeader,
  DataTableSelectHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@meldui/vue'
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table,
} from '@tanstack/vue-table'
import { type Component, h } from 'vue'

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  department: string
  location: string
  age: number
  salary: number
  is_verified: boolean
  last_login_at: string
  created_at: string
}

export interface TableState {
  sorting: SortingState
  filters: ColumnFiltersState
  pagination: PaginationState
}

export interface ServerResponse {
  data: User[]
  meta: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
  }
}

// ============================================================================
// Mock Data Generator
// ============================================================================

const FIRST_NAMES = [
  'John',
  'Jane',
  'Michael',
  'Sarah',
  'David',
  'Emily',
  'Robert',
  'Emma',
  'William',
  'Olivia',
  'James',
  'Ava',
  'Daniel',
  'Sophia',
  'Joseph',
  'Isabella',
  'Thomas',
  'Mia',
  'Charles',
  'Charlotte',
  'Christopher',
  'Amelia',
  'Matthew',
  'Harper',
]

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
]

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Product',
  'Design',
]
const LOCATIONS = ['New York', 'San Francisco', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Remote']
const ROLES: ('admin' | 'user' | 'guest')[] = ['admin', 'user', 'guest']
const STATUSES: ('active' | 'inactive')[] = ['active', 'inactive']

export function generateMockUsers(count: number = 100): User[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length]

    return {
      id: `user-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      role: ROLES[i % 10 === 0 ? 0 : i % 10 < 8 ? 1 : 2],
      status: STATUSES[i % 5 === 0 ? 1 : 0],
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      location: LOCATIONS[i % LOCATIONS.length],
      age: 22 + (i % 44),
      salary: 30000 + ((i * 2500) % 120000),
      is_verified: i % 10 < 7,
      last_login_at: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      created_at: new Date(
        Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
      ).toISOString(),
    }
  })
}

// Pre-generated mock data
export const MOCK_USERS = generateMockUsers(100)

// ============================================================================
// Server-Side Simulation
// ============================================================================

export function simulateServerSide(data: User[], tableState: TableState): ServerResponse {
  let filteredData = [...data]

  // Apply filters
  tableState.filters.forEach((filter) => {
    const { id, value } = filter
    if (value === undefined || value === null || value === '') return

    switch (id) {
      case 'name':
        if (typeof value === 'string') {
          filteredData = filteredData.filter((user) =>
            user.name.toLowerCase().includes(value.toLowerCase()),
          )
        }
        break

      case 'email':
        if (Array.isArray(value)) {
          filteredData = filteredData.filter((user) =>
            value.some((v) => user.email.toLowerCase().includes(String(v).toLowerCase())),
          )
        }
        break

      case 'role':
        if (typeof value === 'string') {
          filteredData = filteredData.filter((user) => user.role === value)
        }
        break

      case 'status':
      case 'department':
      case 'location': {
        const values = Array.isArray(value) ? value : [value]
        filteredData = filteredData.filter((user) => values.includes(user[id]))
        break
      }

      case 'age':
        if (Array.isArray(value)) {
          filteredData = filteredData.filter((user) => value.includes(user.age))
        }
        break

      case 'salary':
        if (Array.isArray(value)) {
          filteredData = filteredData.filter((user) =>
            value.some((range) => {
              const { start, end } = range as { start: number; end: number }
              return user.salary >= start && user.salary <= end
            }),
          )
        }
        break

      case 'is_verified':
        if (typeof value === 'boolean') {
          filteredData = filteredData.filter((user) => user.is_verified === value)
        }
        break
    }
  })

  // Apply sorting
  if (tableState.sorting.length > 0) {
    const { id, desc } = tableState.sorting[0]
    filteredData.sort((a, b) => {
      const aVal = a[id as keyof User]
      const bVal = b[id as keyof User]
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      let comparison = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else {
        comparison = aVal < bVal ? -1 : 1
      }
      return desc ? -comparison : comparison
    })
  }

  // Apply pagination
  const { pageIndex, pageSize } = tableState.pagination
  const start = pageIndex * pageSize
  const paginatedData = filteredData.slice(start, start + pageSize)

  return {
    data: paginatedData,
    meta: {
      current_page: pageIndex + 1,
      per_page: pageSize,
      total: filteredData.length,
      total_pages: Math.ceil(filteredData.length / pageSize),
    },
  }
}

// ============================================================================
// Column Helper
// ============================================================================

export function createColumnHeader<TData, TValue>(
  column: Column<TData, TValue>,
  title: string,
  table?: Table<TData>,
) {
  return h(DataTableColumnHeader as Component, { column, table, title })
}

// ============================================================================
// Column Definitions
// ============================================================================

/**
 * Minimal columns for basic examples
 */
export const minimalColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column, table }) => createColumnHeader(column, 'Name', table),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
    meta: { displayName: 'Name' },
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column, table }) => createColumnHeader(column, 'Email', table),
    cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.getValue('email')),
    meta: { displayName: 'Email' },
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: ({ column, table }) => createColumnHeader(column, 'Role', table),
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return h(Badge, { variant: 'outline', class: 'capitalize' }, () => role)
    },
    meta: { displayName: 'Role' },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column, table }) => createColumnHeader(column, 'Status', table),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h(
        Badge,
        { variant: status === 'active' ? 'default' : 'secondary', class: 'capitalize' },
        () => status,
      )
    },
    meta: { displayName: 'Status' },
  },
]

/**
 * Columns with selection checkbox
 */
export const columnsWithSelection: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => h(DataTableSelectHeader as Component, { table }),
    cell: ({ row }) =>
      h(Checkbox as Component, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  ...minimalColumns,
]

/**
 * Extended columns with more fields
 */
export const extendedColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => h(DataTableSelectHeader as Component, { table }),
    cell: ({ row }) =>
      h(Checkbox as Component, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column, table }) => createColumnHeader(column, 'Name', table),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
    meta: { displayName: 'Name' },
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column, table }) => createColumnHeader(column, 'Email', table),
    cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.getValue('email')),
    meta: { displayName: 'Email' },
    enableSorting: true,
  },
  {
    accessorKey: 'department',
    header: ({ column, table }) => createColumnHeader(column, 'Department', table),
    cell: ({ row }) => h('div', {}, row.getValue('department')),
    meta: { displayName: 'Department' },
    enableSorting: true,
  },
  {
    accessorKey: 'location',
    header: ({ column, table }) => createColumnHeader(column, 'Location', table),
    cell: ({ row }) => h('div', {}, row.getValue('location')),
    meta: { displayName: 'Location' },
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: ({ column, table }) => createColumnHeader(column, 'Role', table),
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return h(Badge, { variant: 'outline', class: 'capitalize' }, () => role)
    },
    meta: { displayName: 'Role' },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column, table }) => createColumnHeader(column, 'Status', table),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h(
        Badge,
        { variant: status === 'active' ? 'default' : 'secondary', class: 'capitalize' },
        () => status,
      )
    },
    meta: { displayName: 'Status' },
  },
  {
    accessorKey: 'age',
    header: ({ column, table }) => createColumnHeader(column, 'Age', table),
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('age')),
    meta: { displayName: 'Age' },
    enableSorting: true,
  },
  {
    accessorKey: 'salary',
    header: ({ column, table }) => createColumnHeader(column, 'Salary', table),
    cell: ({ row }) => {
      const salary = row.getValue('salary') as number
      return h('div', { class: 'font-medium' }, `$${salary.toLocaleString()}`)
    },
    meta: { displayName: 'Salary' },
    enableSorting: true,
  },
  {
    accessorKey: 'is_verified',
    header: ({ column, table }) => createColumnHeader(column, 'Verified', table),
    cell: ({ row }) => {
      const verified = row.getValue('is_verified') as boolean
      return verified
        ? h(Badge, { variant: 'default', class: 'bg-green-500' }, () => 'Verified')
        : h(Badge, { variant: 'secondary' }, () => 'Unverified')
    },
    meta: { displayName: 'Verified' },
  },
]

/**
 * Full columns with actions menu
 */
export const fullColumns: ColumnDef<User>[] = [
  ...extendedColumns,
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Actions'),
    cell: ({ row }) => {
      const user = row.original
      return h(
        'div',
        { class: 'flex justify-end' },
        h(
          DropdownMenu,
          {},
          {
            default: () => [
              h(
                DropdownMenuTrigger,
                { asChild: true },
                {
                  default: () =>
                    h(
                      Button,
                      { variant: 'ghost', class: 'h-8 w-8 p-0' },
                      {
                        default: () => [
                          h('span', { class: 'sr-only' }, 'Open menu'),
                          h(IconDotsVertical, { class: 'h-4 w-4' }),
                        ],
                      },
                    ),
                },
              ),
              h(
                DropdownMenuContent,
                { align: 'end' },
                {
                  default: () => [
                    h(DropdownMenuLabel, {}, () => 'Actions'),
                    h(DropdownMenuSeparator),
                    h(
                      DropdownMenuItem,
                      { onClick: () => console.log('Edit:', user.id) },
                      {
                        default: () => [h(IconPencil, { class: 'mr-2 h-4 w-4' }), 'Edit'],
                      },
                    ),
                    h(
                      DropdownMenuItem,
                      { class: 'text-destructive', onClick: () => console.log('Delete:', user.id) },
                      {
                        default: () => [h(IconTrash, { class: 'mr-2 h-4 w-4' }), 'Delete'],
                      },
                    ),
                  ],
                },
              ),
            ],
          },
        ),
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]

// ============================================================================
// Filter Options
// ============================================================================

export const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Guest', value: 'guest' },
]

export const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

export const departmentOptions = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Sales', value: 'Sales' },
  { label: 'HR', value: 'HR' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Product', value: 'Product' },
  { label: 'Design', value: 'Design' },
]

export const locationOptions = [
  { label: 'New York', value: 'New York' },
  { label: 'San Francisco', value: 'San Francisco' },
  { label: 'Austin', value: 'Austin' },
  { label: 'Seattle', value: 'Seattle' },
  { label: 'Boston', value: 'Boston' },
  { label: 'Chicago', value: 'Chicago' },
  { label: 'Remote', value: 'Remote' },
]
