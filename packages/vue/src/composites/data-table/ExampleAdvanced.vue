<script lang="ts">
/**
 * Advanced Server-Side DataTable Example
 *
 * This example demonstrates a table configured in ADVANCED MODE (static).
 * Advanced mode enables operator selection for each filter type.
 *
 * Advanced Mode Features:
 * - Static mode (advancedMode: true) - never changes
 * - Operator selector for each filter type
 * - Display format: [Title | operator | value]
 * - Multi-instance support for ALL base filter types
 * - Type-safe operator validation
 * - Only base types allowed (text, number, date, select, boolean)
 *
 * Filter Value Formats in Advanced Mode:
 * All filters emit arrays of operator objects: Array<{ operator: string; value: unknown }>
 *
 * Examples:
 * - Text Filters (email): [{ operator: "contains", value: "john" }, { operator: "equals", value: "jane@example.com" }]
 * - Number Filters (age): [{ operator: "greaterThan", value: 25 }, { operator: "between", value: [30, 40] }]
 * - Date Filters (last_login_at): [{ operator: "is", value: date1 }, { operator: "isBetween", value: [date1, date2] }]
 * - Select Filters (role): [{ operator: "is", value: "admin" }, { operator: "isAnyOf", value: ["user", "guest"] }]
 * - Boolean Filters (is_verified): [{ operator: "is", value: true }]
 *
 * Available Operators by Type:
 * - Text: contains, equals, startsWith, endsWith, notContains, notEquals, isEmpty, isNotEmpty
 * - Number: equals, notEquals, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, between, isEmpty, isNotEmpty
 * - Date: is, isBefore, isAfter, isBetween, isEmpty, isNotEmpty
 * - Select: is, isAnyOf, isNot, isNoneOf, isEmpty, isNotEmpty
 * - Boolean: is, isEmpty, isNotEmpty
 *
 * Configuration:
 * - Use base filter types only (text, number, date, select, boolean)
 * - Complex types (multiselect, range, daterange) will throw validation error
 * - Set defaultOperator to customize initial operator per filter
 */

// Example data type
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  age: number
  salary: number
  is_verified: boolean
  last_login_at: string
  created_at: string
}

// Mock data generator (same as Example.vue)
function generateMockUsers(count: number = 50): User[] {
  const firstNames = [
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
    'Anthony',
    'Evelyn',
    'Donald',
    'Abigail',
    'Mark',
    'Elizabeth',
    'Paul',
    'Sofia',
  ]

  const lastNames = [
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
  ]

  const roles: ('admin' | 'user' | 'guest')[] = ['admin', 'user', 'guest']
  const statuses: ('active' | 'inactive')[] = ['active', 'inactive']

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

    const roleIndex = i % 10 === 0 ? 0 : i % 10 < 8 ? 1 : 2
    const role = roles[roleIndex]
    const status = i % 5 === 0 ? statuses[1] : statuses[0]
    const age = 22 + (i % 44)
    const salary = 30000 + ((i * 2500) % 120000)
    const is_verified = i % 10 < 7

    const createdDaysAgo = Math.floor(Math.random() * 365)
    const created_at = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000).toISOString()

    const loginDaysAgo = Math.floor(Math.random() * 30)
    const last_login_at = new Date(Date.now() - loginDaysAgo * 24 * 60 * 60 * 1000).toISOString()

    return {
      id: `user-${i + 1}`,
      name,
      email,
      role,
      status,
      age,
      salary,
      is_verified,
      last_login_at,
      created_at,
    }
  })
}

const MOCK_USERS = generateMockUsers(50)

const DEFAULT_USERS = {
  data: MOCK_USERS.slice(0, 10),
  meta: {
    current_page: 1,
    per_page: 10,
    total: MOCK_USERS.length,
    total_pages: Math.ceil(MOCK_USERS.length / 10),
  },
}
</script>

<script setup lang="ts">
import { h, computed, ref, type Component } from "vue";
import type { ColumnDef, SortingState, ColumnFiltersState, Column } from "@tanstack/vue-table";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableFilterField,
  type BulkActionOption,
} from ".";
import { tableStateToServerParams } from "./utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Download,
  UserCog,
  Mail,
  Hash,
  DollarSign,
  CheckCircle,
  Calendar,
  Shield,
} from "lucide-vue-next";
import type { DateValue } from "@internationalized/date";

// Type for advanced filter value
interface FilterWithOperator<T = unknown> {
  operator: string;
  value: T;
}

interface Props {
  users?: {
    data: User[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

const props = withDefaults(defineProps<Props>(), {
  users: () => DEFAULT_USERS,
});

const localUsers = ref(props.users);

interface TableStateChange {
  sorting: SortingState;
  filters: ColumnFiltersState;
  pagination: { pageIndex: number; pageSize: number };
}

function createColumnHeader<TData, TValue>(column: Column<TData, TValue>, title: string) {
  return h(DataTableColumnHeader as Component, { column, title });
}

// Column definitions (same as Example.vue)
const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox as Component, {
        modelValue: table.getIsAllPageRowsSelected()
          ? true
          : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false,
        "onUpdate:modelValue": (value: boolean | "indeterminate") => {
          table.toggleAllPageRowsSelected(!!value);
        },
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox as Component, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean) => {
          row.toggleSelected(!!value);
        },
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => createColumnHeader(column, "Name"),
    cell: ({ row }) => h("div", { class: "font-medium" }, row.getValue("name")),
    meta: { displayName: "Name" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => createColumnHeader(column, "Email"),
    cell: ({ row }) => h("div", { class: "lowercase" }, row.getValue("email")),
    meta: { displayName: "Email" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => createColumnHeader(column, "Role"),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return h(Badge, { variant: "outline", class: "capitalize" }, () => role);
    },
    meta: { displayName: "Role" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => createColumnHeader(column, "Status"),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return h(
        Badge,
        {
          variant: status === "active" ? "default" : "secondary",
          class: "capitalize",
        },
        () => status,
      );
    },
    meta: { displayName: "Status" },
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "age",
    header: ({ column }) => createColumnHeader(column, "Age"),
    cell: ({ row }) => h("div", { class: "text-center" }, row.getValue("age")),
    meta: { displayName: "Age" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "salary",
    header: ({ column }) => createColumnHeader(column, "Salary"),
    cell: ({ row }) => {
      const salary = row.getValue("salary") as number;
      return h("div", { class: "font-medium" }, `$${salary.toLocaleString()}`);
    },
    meta: { displayName: "Salary" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "is_verified",
    header: ({ column }) => createColumnHeader(column, "Verified"),
    cell: ({ row }) => {
      const is_verified = row.getValue("is_verified") as boolean;
      return is_verified
        ? h(Badge, { variant: "default", class: "bg-green-500" }, () => "Verified")
        : h(Badge, { variant: "secondary" }, () => "Unverified");
    },
    meta: { displayName: "Verified" },
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "last_login_at",
    header: ({ column }) => createColumnHeader(column, "Last Login"),
    cell: ({ row }) => {
      const date = new Date(row.getValue("last_login_at"));
      return h(
        "div",
        { class: "text-sm" },
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      );
    },
    meta: { displayName: "Last Login" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => createColumnHeader(column, "Created At"),
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return h(
        "div",
        { class: "text-sm" },
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      );
    },
    meta: { displayName: "Created At" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-right" }, "Actions"),
    cell: ({ row }) => {
      const user = row.original;

      return h(
        "div",
        { class: "flex justify-end" },
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
                      { variant: "ghost", class: "h-8 w-8 p-0" },
                      {
                        default: () => [
                          h("span", { class: "sr-only" }, "Open menu"),
                          h(MoreHorizontal, { class: "h-4 w-4" }),
                        ],
                      },
                    ),
                },
              ),
              h(
                DropdownMenuContent,
                { align: "end" },
                {
                  default: () => [
                    h(DropdownMenuLabel, {}, () => "Actions"),
                    h(DropdownMenuSeparator),
                    h(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("Edit user:", user.id),
                      },
                      {
                        default: () => [h(Pencil, { class: "mr-2 h-4 w-4" }), "Edit"],
                      },
                    ),
                    h(
                      DropdownMenuItem,
                      {
                        class: "text-destructive",
                        onClick: () => console.log("Delete user:", user.id),
                      },
                      {
                        default: () => [h(Trash, { class: "mr-2 h-4 w-4" }), "Delete"],
                      },
                    ),
                  ],
                },
              ),
            ],
          },
        ),
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

// Filter field definitions with advanced mode configurations
const filterFields: DataTableFilterField<User>[] = [
  // Text filter - custom operators (contains by default, but can select equals, startsWith, etc.)
  {
    id: "email",
    label: "Email",
    type: "text",
    icon: Mail,
    placeholder: "Filter by email...",
    defaultOperator: "contains", // Default operator in advanced mode
    // availableOperators: ["contains", "equals", "startsWith"], // Optional: restrict available operators
  },
  // Select filter - supports "is" and "isAnyOf" operators
  {
    id: "role",
    label: "Role",
    type: "select",
    icon: Shield,
    placeholder: "Select role",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ],
    defaultOperator: "is",
  },
  // Number filter - supports comparison operators and "between"
  {
    id: "age",
    label: "Age",
    type: "number",
    icon: Hash,
    placeholder: "Enter age",
    unit: "yrs",
    defaultOperator: "greaterThan", // Demonstrate different default
  },
  // Number filter with range - in advanced mode becomes number with "between" operator
  {
    id: "salary",
    label: "Salary",
    type: "number",
    placeholder: "Enter Salary",
    icon: DollarSign,
    unit: "$",
    // In advanced mode, this uses DataTableNumberFilter with "between" operator
  },
  // Boolean filter
  {
    id: "is_verified",
    label: "Verified",
    type: "boolean",
    icon: CheckCircle,
  },
  // Date filter - supports date operators including "isToday", "isBetween", etc.
  {
    id: "last_login_at",
    label: "Last Login",
    type: "date",
    icon: Calendar,
    placeholder: "Pick a date",
    defaultOperator: "is",
  },
  // Date filter with isBetween operator (for date ranges in advanced mode)
  {
    id: "created_at",
    label: "Created Date",
    type: "date",
    icon: Calendar,
    placeholder: "Pick date range",
    defaultOperator: "isBetween",
  },
];

const dataTableRef = ref();
const pageCount = computed(() => localUsers.value.meta.total_pages);

// Bulk select options
const bulkSelectOptions: BulkActionOption<User>[] = [
  {
    label: "Delete",
    icon: Trash,
    variant: "destructive",
    action: () => {
      const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined;
      const selectedIds = selectedRows?.map((row: User) => row.id);
      console.log("Delete selected IDs:", selectedIds);
      alert(`Would delete ${selectedIds?.length} users`);
      dataTableRef.value?.resetSelection();
    },
  },
  {
    label: "Export",
    icon: Download,
    action: () => {
      const selectedRows = dataTableRef.value?.selectedRows;
      const dataStr = JSON.stringify(selectedRows, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users-export-${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
  },
  {
    label: "Change Role",
    icon: UserCog,
    action: () => {
      const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined;
      const selectedIds = selectedRows?.map((row: User) => row.id);
      console.log("Change role for selected IDs:", selectedIds);
      alert(`Would change role for ${selectedIds?.length} users`);
    },
  },
];

// Advanced mode server-side handler with operator support
const handleServerSideChange = (tableState: TableStateChange) => {
  const params = tableStateToServerParams(tableState, filterFields, "name");
  console.log("Advanced mode server params:", params);

  let filteredData = [...MOCK_USERS];

  // Apply filters with operator support
  tableState.filters.forEach((filter) => {
    const { id, value } = filter;
    if (value === undefined || value === null || value === "") return;

    // Handle search column (simple string)
    if (id === "name" && typeof value === "string") {
      filteredData = filteredData.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase()),
      );
      return;
    }

    // Advanced mode: handle array of operator objects
    if (Array.isArray(value)) {
      filteredData = filteredData.filter((user) => {
        // OR logic between multiple filter instances
        return value.some((filterInstance) => {
          // Check if it's an operator object
          if (typeof filterInstance === "object" && "operator" in filterInstance) {
            const { operator, value: filterValue } = filterInstance as FilterWithOperator;

            // Text operators
            if (id === "email") {
              const email = user.email.toLowerCase();
              const val = String(filterValue).toLowerCase();

              switch (operator) {
                case "contains":
                  return email.includes(val);
                case "equals":
                  return email === val;
                case "startsWith":
                  return email.startsWith(val);
                case "endsWith":
                  return email.endsWith(val);
                case "notContains":
                  return !email.includes(val);
                case "notEquals":
                  return email !== val;
                case "isEmpty":
                  return email === "";
                case "isNotEmpty":
                  return email !== "";
                default:
                  return true;
              }
            }

            // Number operators
            if (id === "age") {
              const age = user.age;

              switch (operator) {
                case "equals":
                  return age === Number(filterValue);
                case "notEquals":
                  return age !== Number(filterValue);
                case "greaterThan":
                  return age > Number(filterValue);
                case "greaterThanOrEqual":
                  return age >= Number(filterValue);
                case "lessThan":
                  return age < Number(filterValue);
                case "lessThanOrEqual":
                  return age <= Number(filterValue);
                case "between": {
                  const [min, max] = filterValue as [number, number];
                  return age >= min && age <= max;
                }
                case "isEmpty":
                  return age === null || age === undefined;
                case "isNotEmpty":
                  return age !== null && age !== undefined;
                default:
                  return true;
              }
            }

            if (id === "salary") {
              const salary = user.salary;

              switch (operator) {
                case "between": {
                  const [min, max] = filterValue as [number, number];
                  return salary >= min && salary <= max;
                }
                case "greaterThan":
                  return salary > Number(filterValue);
                case "lessThan":
                  return salary < Number(filterValue);
                default:
                  return true;
              }
            }

            // Date operators
            if (id === "last_login_at") {
              const userDate = new Date(user.last_login_at);

              switch (operator) {
                case "is": {
                  const date = filterValue as DateValue;
                  const filterDate = new Date(date.year, date.month - 1, date.day);
                  return userDate.toDateString() === filterDate.toDateString();
                }
                case "before": {
                  const date = filterValue as DateValue;
                  const filterDate = new Date(date.year, date.month - 1, date.day);
                  return userDate < filterDate;
                }
                case "after": {
                  const date = filterValue as DateValue;
                  const filterDate = new Date(date.year, date.month - 1, date.day);
                  return userDate > filterDate;
                }
                case "isBetween": {
                  const [start, end] = filterValue as [DateValue, DateValue];
                  const startDate = new Date(start.year, start.month - 1, start.day);
                  const endDate = new Date(end.year, end.month - 1, end.day);
                  startDate.setHours(0, 0, 0, 0);
                  endDate.setHours(23, 59, 59, 999);
                  return userDate >= startDate && userDate <= endDate;
                }
                case "isEmpty":
                  return !user.last_login_at;
                case "isNotEmpty":
                  return !!user.last_login_at;
                default:
                  return true;
              }
            }

            if (id === "created_at") {
              const userDate = new Date(user.created_at);

              switch (operator) {
                case "isBetween": {
                  const [start, end] = filterValue as [DateValue, DateValue];
                  const startDate = new Date(start.year, start.month - 1, start.day);
                  const endDate = new Date(end.year, end.month - 1, end.day);
                  startDate.setHours(0, 0, 0, 0);
                  endDate.setHours(23, 59, 59, 999);
                  return userDate >= startDate && userDate <= endDate;
                }
                default:
                  return true;
              }
            }

            // Select operators
            if (id === "role") {
              switch (operator) {
                case "is":
                  return user.role === filterValue;
                case "isAnyOf": {
                  const values = filterValue as string[];
                  return values.includes(user.role);
                }
                case "isEmpty":
                  return !user.role;
                case "isNotEmpty":
                  return !!user.role;
                default:
                  return true;
              }
            }

            // Boolean operators
            if (id === "is_verified") {
              switch (operator) {
                case "is":
                  return user.is_verified === filterValue;
                case "isEmpty":
                  return user.is_verified === null || user.is_verified === undefined;
                case "isNotEmpty":
                  return user.is_verified !== null && user.is_verified !== undefined;
                default:
                  return true;
              }
            }
          }

          return true;
        });
      });
    }
  });

  // Apply sorting
  if (tableState.sorting.length > 0) {
    const { id, desc } = tableState.sorting[0];
    filteredData.sort((a, b) => {
      const aVal = a[id as keyof User];
      const bVal = b[id as keyof User];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = aVal < bVal ? -1 : 1;
      }

      return desc ? -comparison : comparison;
    });
  }

  // Apply pagination
  const { pageIndex, pageSize } = tableState.pagination;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = filteredData.slice(start, end);

  // Update local state
  localUsers.value = {
    data: paginatedData,
    meta: {
      current_page: pageIndex + 1,
      per_page: pageSize,
      total: filteredData.length,
      total_pages: Math.ceil(filteredData.length / pageSize),
    },
  };
};
</script>

<template>
  <div class="container mx-auto py-10 space-y-4">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold tracking-tight">Advanced Filters Demo</h2>
      <p class="text-muted-foreground">
        This table uses advanced filter mode with operator selection enabled for each filter type.
        Choose from operators like "contains", "equals", "greater than", "between", and more.
      </p>
    </div>

    <!-- Advanced Server-Side DataTable -->
    <DataTable
      ref="dataTableRef"
      :columns="columns"
      :data="localUsers.data"
      :page-count="pageCount"
      :on-server-side-change="handleServerSideChange"
      :filter-fields="filterFields"
      search-column="name"
      search-placeholder="Search by name..."
      :enable-row-selection="true"
      :show-selected-count="true"
      :bulk-select-options="bulkSelectOptions"
      :default-per-page="10"
      :page-size-options="[10, 20, 30, 50, 100]"
      :advanced-mode="true"
    />
  </div>
</template>
