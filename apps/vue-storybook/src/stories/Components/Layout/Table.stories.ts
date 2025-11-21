import { IconChevronDown, IconChevronUp, IconEdit, IconTrash } from '@meldui/tabler-vue'
import {
  Badge,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Table> = {
  title: 'Components/Layout/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A responsive table component for displaying tabular data. Supports headers, footers, captions, and custom styling.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => ({
    components: { Table, TableHeader, TableBody, TableRow, TableHead, TableCell },
    template: `
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead class="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell class="font-medium">Alice Johnson</TableCell>
            <TableCell>alice@example.com</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell class="text-right">Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Bob Smith</TableCell>
            <TableCell>bob@example.com</TableCell>
            <TableCell>Editor</TableCell>
            <TableCell class="text-right">Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Carol Williams</TableCell>
            <TableCell>carol@example.com</TableCell>
            <TableCell>Viewer</TableCell>
            <TableCell class="text-right">Inactive</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">David Brown</TableCell>
            <TableCell>david@example.com</TableCell>
            <TableCell>Editor</TableCell>
            <TableCell class="text-right">Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    `,
  }),
}

export const WithFooter: Story = {
  render: () => ({
    components: { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell },
    template: `
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead class="text-right">Price</TableHead>
            <TableHead class="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell class="font-medium">Laptop</TableCell>
            <TableCell>2</TableCell>
            <TableCell class="text-right">$1,200.00</TableCell>
            <TableCell class="text-right">$2,400.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Mouse</TableCell>
            <TableCell>5</TableCell>
            <TableCell class="text-right">$25.00</TableCell>
            <TableCell class="text-right">$125.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Keyboard</TableCell>
            <TableCell>3</TableCell>
            <TableCell class="text-right">$80.00</TableCell>
            <TableCell class="text-right">$240.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colspan="3">Total</TableCell>
            <TableCell class="text-right">$2,765.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    `,
  }),
}

export const WithCaption: Story = {
  render: () => ({
    components: { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell },
    template: `
      <Table>
        <TableCaption>A list of recent transactions for your account.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead class="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell class="font-medium">TXN-001</TableCell>
            <TableCell>2024-01-15</TableCell>
            <TableCell>Monthly subscription</TableCell>
            <TableCell class="text-right">$29.99</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">TXN-002</TableCell>
            <TableCell>2024-01-18</TableCell>
            <TableCell>Additional storage</TableCell>
            <TableCell class="text-right">$9.99</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">TXN-003</TableCell>
            <TableCell>2024-01-22</TableCell>
            <TableCell>Premium features</TableCell>
            <TableCell class="text-right">$49.99</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    `,
  }),
}

export const WithStatus: Story = {
  render: () => ({
    components: { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge },
    template: `
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead class="text-right">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell class="font-medium">Website Redesign</TableCell>
            <TableCell>
              <Badge variant="default">In Progress</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="destructive">High</Badge>
            </TableCell>
            <TableCell class="text-right">75%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Mobile App</TableCell>
            <TableCell>
              <Badge variant="outline">Planning</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">Medium</Badge>
            </TableCell>
            <TableCell class="text-right">20%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">API Integration</TableCell>
            <TableCell>
              <Badge variant="default">In Progress</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="destructive">High</Badge>
            </TableCell>
            <TableCell class="text-right">90%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Documentation</TableCell>
            <TableCell>
              <Badge variant="secondary">Completed</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline">Low</Badge>
            </TableCell>
            <TableCell class="text-right">100%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    `,
  }),
}

export const WithActions: Story = {
  render: () => ({
    components: {
      Table,
      TableHeader,
      TableBody,
      TableRow,
      TableHead,
      TableCell,
      Button,
      IconEdit,
      IconTrash,
    },
    template: `
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell class="font-medium">Alice Johnson</TableCell>
            <TableCell>alice@example.com</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <IconEdit :size="16" />
                </Button>
                <Button variant="ghost" size="icon">
                  <IconTrash :size="16" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Bob Smith</TableCell>
            <TableCell>bob@example.com</TableCell>
            <TableCell>Editor</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <IconEdit :size="16" />
                </Button>
                <Button variant="ghost" size="icon">
                  <IconTrash :size="16" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Carol Williams</TableCell>
            <TableCell>carol@example.com</TableCell>
            <TableCell>Viewer</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <IconEdit :size="16" />
                </Button>
                <Button variant="ghost" size="icon">
                  <IconTrash :size="16" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    `,
  }),
}

export const WithSelection: Story = {
  render: () => ({
    components: { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Checkbox },
    setup() {
      const selectedRows = ref<number[]>([])
      const allSelected = ref(false)

      const toggleAll = () => {
        if (allSelected.value) {
          selectedRows.value = []
          allSelected.value = false
        } else {
          selectedRows.value = [1, 2, 3, 4]
          allSelected.value = true
        }
      }

      const toggleRow = (id: number) => {
        const index = selectedRows.value.indexOf(id)
        if (index > -1) {
          selectedRows.value.splice(index, 1)
        } else {
          selectedRows.value.push(id)
        }
        allSelected.value = selectedRows.value.length === 4
      }

      return { selectedRows, allSelected, toggleAll, toggleRow }
    },
    template: `
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox :checked="allSelected" @update:checked="toggleAll" />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead class="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox :checked="selectedRows.includes(1)" @update:checked="toggleRow(1)" />
            </TableCell>
            <TableCell class="font-medium">Alice Johnson</TableCell>
            <TableCell>alice@example.com</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell class="text-right">Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Checkbox :checked="selectedRows.includes(2)" @update:checked="toggleRow(2)" />
            </TableCell>
            <TableCell class="font-medium">Bob Smith</TableCell>
            <TableCell>bob@example.com</TableCell>
            <TableCell>Editor</TableCell>
            <TableCell class="text-right">Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Checkbox :checked="selectedRows.includes(3)" @update:checked="toggleRow(3)" />
            </TableCell>
            <TableCell class="font-medium">Carol Williams</TableCell>
            <TableCell>carol@example.com</TableCell>
            <TableCell>Viewer</TableCell>
            <TableCell class="text-right">Inactive</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Checkbox :checked="selectedRows.includes(4)" @update:checked="toggleRow(4)" />
            </TableCell>
            <TableCell class="font-medium">David Brown</TableCell>
            <TableCell>david@example.com</TableCell>
            <TableCell>Editor</TableCell>
            <TableCell class="text-right">Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    `,
  }),
}

export const Sortable: Story = {
  render: () => ({
    components: {
      Table,
      TableHeader,
      TableBody,
      TableRow,
      TableHead,
      TableCell,
      Button,
      IconChevronUp,
      IconChevronDown,
    },
    setup() {
      const sortColumn = ref<string>('name')
      const sortDirection = ref<'asc' | 'desc'>('asc')

      interface User {
        name: string
        email: string
        role: string
        status: string
      }

      const data = ref<User[]>([
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
        { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
        { name: 'Carol Williams', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
        { name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
      ])

      const sortData = (column: keyof User) => {
        if (sortColumn.value === column) {
          sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        } else {
          sortColumn.value = column
          sortDirection.value = 'asc'
        }

        data.value.sort((a, b) => {
          const aValue = a[column]
          const bValue = b[column]

          if (sortDirection.value === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
          }
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        })
      }

      return { data, sortColumn, sortDirection, sortData }
    },
    template: `
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" @click="sortData('name')" class="-ml-3">
                Name
                <IconChevronUp v-if="sortColumn === 'name' && sortDirection === 'asc'" :size="14" class="ml-1" />
                <IconChevronDown v-else-if="sortColumn === 'name' && sortDirection === 'desc'" :size="14" class="ml-1" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" @click="sortData('email')" class="-ml-3">
                Email
                <IconChevronUp v-if="sortColumn === 'email' && sortDirection === 'asc'" :size="14" class="ml-1" />
                <IconChevronDown v-else-if="sortColumn === 'email' && sortDirection === 'desc'" :size="14" class="ml-1" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" @click="sortData('role')" class="-ml-3">
                Role
                <IconChevronUp v-if="sortColumn === 'role' && sortDirection === 'asc'" :size="14" class="ml-1" />
                <IconChevronDown v-else-if="sortColumn === 'role' && sortDirection === 'desc'" :size="14" class="ml-1" />
              </Button>
            </TableHead>
            <TableHead class="text-right">
              <Button variant="ghost" size="sm" @click="sortData('status')" class="-mr-3">
                Status
                <IconChevronUp v-if="sortColumn === 'status' && sortDirection === 'asc'" :size="14" class="ml-1" />
                <IconChevronDown v-else-if="sortColumn === 'status' && sortDirection === 'desc'" :size="14" class="ml-1" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in data" :key="row.email">
            <TableCell class="font-medium">{{ row.name }}</TableCell>
            <TableCell>{{ row.email }}</TableCell>
            <TableCell>{{ row.role }}</TableCell>
            <TableCell class="text-right">{{ row.status }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    `,
  }),
}

export const Striped: Story = {
  render: () => ({
    components: { Table, TableHeader, TableBody, TableRow, TableHead, TableCell },
    template: `
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead class="text-right">Salary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow class="even:bg-muted/50">
            <TableCell class="font-medium">001</TableCell>
            <TableCell>Alice Johnson</TableCell>
            <TableCell>Engineering</TableCell>
            <TableCell class="text-right">$120,000</TableCell>
          </TableRow>
          <TableRow class="even:bg-muted/50">
            <TableCell class="font-medium">002</TableCell>
            <TableCell>Bob Smith</TableCell>
            <TableCell>Design</TableCell>
            <TableCell class="text-right">$95,000</TableCell>
          </TableRow>
          <TableRow class="even:bg-muted/50">
            <TableCell class="font-medium">003</TableCell>
            <TableCell>Carol Williams</TableCell>
            <TableCell>Marketing</TableCell>
            <TableCell class="text-right">$85,000</TableCell>
          </TableRow>
          <TableRow class="even:bg-muted/50">
            <TableCell class="font-medium">004</TableCell>
            <TableCell>David Brown</TableCell>
            <TableCell>Engineering</TableCell>
            <TableCell class="text-right">$115,000</TableCell>
          </TableRow>
          <TableRow class="even:bg-muted/50">
            <TableCell class="font-medium">005</TableCell>
            <TableCell>Emma Davis</TableCell>
            <TableCell>Sales</TableCell>
            <TableCell class="text-right">$90,000</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    `,
  }),
}

export const Compact: Story = {
  render: () => ({
    components: { Table, TableHeader, TableBody, TableRow, TableHead, TableCell },
    template: `
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="h-8 px-2">ID</TableHead>
            <TableHead class="h-8 px-2">Name</TableHead>
            <TableHead class="h-8 px-2">Email</TableHead>
            <TableHead class="h-8 px-2 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell class="p-1 px-2 text-xs">001</TableCell>
            <TableCell class="p-1 px-2 text-xs">Alice Johnson</TableCell>
            <TableCell class="p-1 px-2 text-xs">alice@example.com</TableCell>
            <TableCell class="p-1 px-2 text-right text-xs">Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="p-1 px-2 text-xs">002</TableCell>
            <TableCell class="p-1 px-2 text-xs">Bob Smith</TableCell>
            <TableCell class="p-1 px-2 text-xs">bob@example.com</TableCell>
            <TableCell class="p-1 px-2 text-right text-xs">Active</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="p-1 px-2 text-xs">003</TableCell>
            <TableCell class="p-1 px-2 text-xs">Carol Williams</TableCell>
            <TableCell class="p-1 px-2 text-xs">carol@example.com</TableCell>
            <TableCell class="p-1 px-2 text-right text-xs">Inactive</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="p-1 px-2 text-xs">004</TableCell>
            <TableCell class="p-1 px-2 text-xs">David Brown</TableCell>
            <TableCell class="p-1 px-2 text-xs">david@example.com</TableCell>
            <TableCell class="p-1 px-2 text-right text-xs">Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    `,
  }),
}

export const Responsive: Story = {
  render: () => ({
    components: { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge },
    template: `
      <div class="w-full max-w-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell class="font-medium">ORD-001</TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>Premium Subscription</TableCell>
              <TableCell>2024-01-15</TableCell>
              <TableCell>
                <Badge variant="default">Completed</Badge>
              </TableCell>
              <TableCell class="text-right">$99.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">ORD-002</TableCell>
              <TableCell>Jane Smith</TableCell>
              <TableCell>Basic Plan</TableCell>
              <TableCell>2024-01-16</TableCell>
              <TableCell>
                <Badge variant="secondary">Processing</Badge>
              </TableCell>
              <TableCell class="text-right">$29.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">ORD-003</TableCell>
              <TableCell>Mike Johnson</TableCell>
              <TableCell>Enterprise License</TableCell>
              <TableCell>2024-01-17</TableCell>
              <TableCell>
                <Badge variant="default">Completed</Badge>
              </TableCell>
              <TableCell class="text-right">$499.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="font-medium">ORD-004</TableCell>
              <TableCell>Sarah Williams</TableCell>
              <TableCell>Pro Subscription</TableCell>
              <TableCell>2024-01-18</TableCell>
              <TableCell>
                <Badge variant="outline">Pending</Badge>
              </TableCell>
              <TableCell class="text-right">$49.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    `,
  }),
}

export const LongTable: Story = {
  render: () => ({
    components: { Table, TableHeader, TableBody, TableRow, TableHead, TableCell },
    template: `
      <div class="h-[400px] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead class="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="i in 50" :key="i">
              <TableCell class="font-medium">{{ i.toString().padStart(3, '0') }}</TableCell>
              <TableCell>User {{ i }}</TableCell>
              <TableCell>user{{ i }}@example.com</TableCell>
              <TableCell>{{ i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Editor' : 'Viewer' }}</TableCell>
              <TableCell class="text-right">{{ i % 2 === 0 ? 'Active' : 'Inactive' }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    `,
  }),
}
