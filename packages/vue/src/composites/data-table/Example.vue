<script lang="ts">
/**
 * Server-Side DataTable Example
 *
 * This example demonstrates server-side pagination, sorting, and filtering
 * with multi-instance filter support for applicable filter types.
 *
 * Filter Value Formats (Multi-Instance Support):
 * - Search Column (name): string - Kept as single string value
 * - Text Filters (email): string[] - Array of text values (multiple instances with OR logic)
 * - Number Filters (age): number[] - Array of numbers (multiple instances with OR logic)
 * - Range Filters (salary): Array<{start: number, end: number}> - Array of range objects (multiple instances with OR logic)
 * - Date Filters (last_login_at): DateValue[] - Array of DateValue objects (multiple instances with OR logic, exact date matches)
 * - Date Range Filters (created_at): Array<{start: DateValue, end: DateValue}> - Array of complete date range objects (both dates required, multiple instances with OR logic)
 * - Select Filters (role): string - Single value only (single instance)
 * - Boolean Filters (is_verified): boolean - Single value only (single instance)
 * - Multi-Select Filters (status): string[] - Array with OR logic (single instance, multiple values)
 *
 * Multi-Instance Example:
 * User adds 2 email filters: "john" and "jane"
 * Server receives: { filters: { email: ["john", "jane"] } }
 * Matches users with email containing "john" OR "jane"
 */

// Example data type
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  department: string
  location: string
  phone: string
  job_title: string
  team: string
  age: number // For number filter
  salary: number // For range filter
  is_verified: boolean // For boolean filter
  last_login_at: string // For date filter (single date)
  created_at: string // For daterange filter
}

// Mock data generator (module-level)
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
    'Steven',
    'Ella',
    'Andrew',
    'Madison',
    'Kenneth',
    'Scarlett',
    'Joshua',
    'Victoria',
    'Kevin',
    'Aria',
    'Brian',
    'Grace',
    'George',
    'Chloe',
    'Timothy',
    'Camila',
    'Ronald',
    'Penelope',
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
    'White',
    'Harris',
    'Sanchez',
    'Clark',
    'Ramirez',
    'Lewis',
    'Robinson',
    'Walker',
    'Young',
    'Allen',
    'King',
    'Wright',
    'Scott',
    'Torres',
    'Nguyen',
    'Hill',
    'Flores',
    'Green',
    'Adams',
    'Nelson',
    'Baker',
    'Hall',
    'Rivera',
    'Campbell',
    'Mitchell',
    'Carter',
    'Roberts',
  ]

  const roles: ('admin' | 'user' | 'guest')[] = ['admin', 'user', 'guest']
  const statuses: ('active' | 'inactive')[] = ['active', 'inactive']

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Support',
    'Product',
    'Design',
    'Legal',
  ]

  const locations = [
    'New York, NY',
    'San Francisco, CA',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Chicago, IL',
    'Los Angeles, CA',
    'Denver, CO',
    'Atlanta, GA',
    'Remote',
  ]

  const jobTitles = [
    'Software Engineer',
    'Senior Developer',
    'Product Manager',
    'Marketing Specialist',
    'Sales Representative',
    'HR Manager',
    'Financial Analyst',
    'Operations Manager',
    'Support Specialist',
    'UX Designer',
    'Data Analyst',
    'Team Lead',
  ]

  const teams = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta']

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

    // Distribute roles: 10% admin, 70% user, 20% guest
    const roleIndex = i % 10 === 0 ? 0 : i % 10 < 8 ? 1 : 2
    const role = roles[roleIndex]

    // 80% active, 20% inactive
    const status = i % 5 === 0 ? statuses[1] : statuses[0]

    // Generate age between 22 and 65
    const age = 22 + (i % 44)

    // Generate salary between 30k and 150k
    const salary = 30000 + ((i * 2500) % 120000)

    // 70% verified, 30% unverified
    const is_verified = i % 10 < 7

    // Generate created_at dates over the past year
    const createdDaysAgo = Math.floor(Math.random() * 365)
    const created_at = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000).toISOString()

    // Generate last_login_at dates over the past 30 days
    const loginDaysAgo = Math.floor(Math.random() * 30)
    const last_login_at = new Date(Date.now() - loginDaysAgo * 24 * 60 * 60 * 1000).toISOString()

    // Select department, location, job title, and team
    const department = departments[i % departments.length]
    const location = locations[i % locations.length]
    const job_title = jobTitles[i % jobTitles.length]
    const team = teams[i % teams.length]

    // Generate phone number
    const areaCode = 200 + (i % 800)
    const prefix = 200 + ((i * 7) % 800)
    const lineNumber = 1000 + ((i * 13) % 9000)
    const phone = `+1 (${areaCode}) ${prefix}-${lineNumber}`

    return {
      id: `user-${i + 1}`,
      name,
      email,
      role,
      status,
      department,
      location,
      phone,
      job_title,
      team,
      age,
      salary,
      is_verified,
      last_login_at,
      created_at,
    }
  })
}

// Generate mock data at module level
const MOCK_USERS = generateMockUsers(200)

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
// import { router } from "@inertiajs/vue3";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  Column,
  Table,
  ColumnPinningState,
} from "@tanstack/vue-table";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableSelectHeader,
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
} from "lucide-vue-next";
import type { DateValue } from "@internationalized/date";

// Type for date range filter value
interface DateRangeValue {
  start: DateValue;
  end?: DateValue;
}

// Props from Inertia (optional with defaults)
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

// Local state for demo (simulates server-side changes)
const localUsers = ref(props.users);

// Type for server-side change handler
interface TableStateChange {
  sorting: SortingState;
  filters: ColumnFiltersState;
  pagination: { pageIndex: number; pageSize: number };
}

// Helper function to properly type DataTableColumnHeader with h() render function
// This wraps the generic component in a way TypeScript can understand in render functions
function createColumnHeader<TData, TValue>(
  column: Column<TData, TValue>,
  title: string,
  table?: Table<TData>,
) {
  // Cast to Component (Vue's proper type) instead of 'any'
  // This is the recommended approach for generic components with h()
  return h(DataTableColumnHeader as Component, { column, table, title });
}

// Column definitions
const columns: ColumnDef<User>[] = [
  // Selection column
  {
    id: "select",
    header: ({ table }) => h(DataTableSelectHeader as Component, { table }),
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
  // Name column
  {
    accessorKey: "name",
    header: ({ column, table }) => createColumnHeader(column, "Name", table),
    cell: ({ row }) => h("div", { class: "font-medium" }, row.getValue("name")),
    meta: { displayName: "Name" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  // Email column
  {
    accessorKey: "email",
    header: ({ column, table }) => createColumnHeader(column, "Email", table),
    cell: ({ row }) => h("div", { class: "lowercase" }, row.getValue("email")),
    meta: { displayName: "Email" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  // Role column
  {
    accessorKey: "role",
    header: ({ column, table }) => createColumnHeader(column, "Role", table),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return h(Badge, { variant: "outline", class: "capitalize" }, () => role);
    },
    meta: { displayName: "Role" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
    filterFn: "arrIncludesSome",
  },
  // Status column
  {
    accessorKey: "status",
    header: ({ column, table }) => createColumnHeader(column, "Status", table),
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
    filterFn: "arrIncludesSome",
  },
  // Department column
  {
    accessorKey: "department",
    header: ({ column, table }) => createColumnHeader(column, "Department", table),
    cell: ({ row }) => h("div", { class: "whitespace-nowrap" }, row.getValue("department")),
    meta: { displayName: "Department" },
    enableSorting: false,
    enableColumnFilter: true,
    enableHiding: true,
  },
  // Location column
  {
    accessorKey: "location",
    header: ({ column, table }) => createColumnHeader(column, "Location", table),
    cell: ({ row }) => h("div", { class: "whitespace-nowrap" }, row.getValue("location")),
    meta: { displayName: "Location" },
    // enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  // Phone column
  {
    accessorKey: "phone",
    header: ({ column, table }) => createColumnHeader(column, "Phone", table),
    cell: ({ row }) => h("div", { class: "font-mono text-sm" }, row.getValue("phone")),
    meta: { displayName: "Phone" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: false,
  },
  // Job Title column
  {
    accessorKey: "job_title",
    header: ({ column, table }) => createColumnHeader(column, "Job Title", table),
    cell: ({ row }) => h("div", { class: "whitespace-nowrap" }, row.getValue("job_title")),
    meta: { displayName: "Job Title" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  // Team column
  {
    accessorKey: "team",
    header: ({ column, table }) => createColumnHeader(column, "Team", table),
    cell: ({ row }) => {
      const team = row.getValue("team") as string;
      return h(Badge, { variant: "outline", class: "font-medium" }, () => `Team ${team}`);
    },
    meta: { displayName: "Team" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
  },
  // Age column (for number filter)
  {
    accessorKey: "age",
    header: ({ column, table }) => createColumnHeader(column, "Age", table),
    cell: ({ row }) => h("div", { class: "text-center" }, row.getValue("age")),
    meta: { displayName: "Age" },
    // enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
    filterFn: (row, id, filterValue) => {
      const value = row.getValue(id) as number;
      return value === filterValue;
    },
  },
  // Salary column (for range filter)
  {
    accessorKey: "salary",
    header: ({ column, table }) => createColumnHeader(column, "Salary", table),
    cell: ({ row }) => {
      const salary = row.getValue("salary") as number;
      return h("div", { class: "font-medium" }, `$${salary.toLocaleString()}`);
    },
    meta: { displayName: "Salary" },
    enableSorting: true,
    enableColumnFilter: true,
    enableHiding: true,
    filterFn: (row, id, filterValue) => {
      const value = row.getValue(id) as number;
      const [min, max] = filterValue as [number, number];
      return value >= min && value <= max;
    },
  },
  // Verified column (for boolean filter)
  {
    accessorKey: "is_verified",
    header: ({ column, table }) => createColumnHeader(column, "Verified", table),
    cell: ({ row }) => {
      const is_verified = row.getValue("is_verified") as boolean;
      return is_verified
        ? h(Badge, { variant: "default", class: "bg-green-500" }, () => "Verified")
        : h(Badge, { variant: "secondary" }, () => "Unverified");
    },
    meta: { displayName: "Verified" },
    enableColumnFilter: true,
    enableHiding: true,
    filterFn: (row, id, filterValue) => {
      if (filterValue === undefined) return true;
      const value = row.getValue(id) as boolean;
      return value === filterValue;
    },
  },
  // Last login date column (for date filter - single date)
  {
    accessorKey: "last_login_at",
    header: ({ column, table }) => createColumnHeader(column, "Last Login", table),
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
    filterFn: (row, id, filterValue) => {
      const dateValue = filterValue as DateValue | undefined;

      // Return true if no filter
      if (!dateValue) return true;

      const rowDate = new Date(row.getValue(id) as string);
      const filterDate = new Date(dateValue.year, dateValue.month - 1, dateValue.day);

      // Exact date match
      return rowDate.toDateString() === filterDate.toDateString();
    },
  },
  // Created date column (for daterange filter)
  {
    accessorKey: "created_at",
    header: ({ column, table }) => createColumnHeader(column, "Created At", table),
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
    filterFn: (row, id, filterValue) => {
      const dateValue = filterValue as DateRangeValue | undefined;

      // Return true if no filter or incomplete date range
      if (!dateValue?.start || !dateValue?.end) return true;

      const rowDate = new Date(row.getValue(id) as string);
      const startDate = new Date(
        dateValue.start.year,
        dateValue.start.month - 1,
        dateValue.start.day,
      );
      const endDate = new Date(dateValue.end.year, dateValue.end.month - 1, dateValue.end.day);

      // Set time to start/end of day for accurate comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      rowDate.setHours(12, 0, 0, 0);

      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  // Actions column
  {
    id: "actions",
    header: ({ column, table }) =>
      h(DataTableColumnHeader as Component, {
        column,
        table,
        title: "Actions",
        class: "justify-end",
      }),
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
                        onClick: () => {
                          console.log("Edit user:", user.id);
                          // router.visit(`/users/${user.id}/edit`)
                        },
                      },
                      {
                        default: () => [h(Pencil, { class: "mr-2 h-4 w-4" }), "Edit"],
                      },
                    ),
                    h(
                      DropdownMenuItem,
                      {
                        class: "text-destructive",
                        onClick: () => {
                          console.log("Delete user:", user.id);
                          // router.delete(`/users/${user.id}`)
                        },
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

// Filter field definitions - Demonstrating ALL filter types
const filterFields: DataTableFilterField<User>[] = [
  // Text filter
  {
    id: "email",
    label: "Email",
    type: "text",
    icon: Mail,
    placeholder: "Filter by email...",
  },
  // Select filter (single choice)
  {
    id: "role",
    label: "Role",
    type: "select",
    placeholder: "Select role",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ],
  },
  // Multiselect filter (multiple choice with OR logic)
  {
    id: "status",
    label: "Status",
    type: "multiselect",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  // Number filter
  {
    id: "age",
    label: "Age",
    type: "number",
    icon: Hash,
    placeholder: "Enter age",
    unit: "yrs",
  },
  // Range filter (slider)
  {
    id: "salary",
    label: "Salary",
    type: "range",
    icon: DollarSign,
    range: [30000, 150000],
    step: 5000,
    unit: "$",
  },
  // Boolean filter
  {
    id: "is_verified",
    label: "Verified",
    type: "boolean",
    icon: CheckCircle,
  },
  // Date filter (single date selection)
  {
    id: "last_login_at",
    label: "Last Login",
    type: "date",
    icon: Calendar,
    placeholder: "Pick a date",
  },
  // Date range filter (requires both start and end dates)
  {
    id: "created_at",
    label: "Created Date",
    type: "daterange",
    icon: Calendar,
    placeholder: "Pick date range",
  },
];

// Reference to DataTable component
const dataTableRef = ref();

// Computed page count
const pageCount = computed(() => localUsers.value.meta.total_pages);

// Default column pinning configuration
const defaultPinning: ColumnPinningState = {
  left: ["select", "name"],
  right: ["actions"],
};

// Action handlers for selected rows
const deleteSelected = () => {
  const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined;
  const selectedIds = selectedRows?.map((row: User) => row.id);

  console.log("Delete selected IDs:", selectedIds);
  console.log("Delete selected rows:", selectedRows);

  alert(`Would delete ${selectedIds?.length} users:\n${selectedIds?.join(", ")}`);

  // In real app, make API call:
  // router.delete('/users/bulk', { ids: selectedIds })

  // Clear selection after action
  dataTableRef.value?.resetSelection();
};

const exportSelected = () => {
  const selectedRows = dataTableRef.value?.selectedRows;

  console.log("Export selected rows:", selectedRows);

  // Create CSV export
  const dataStr = JSON.stringify(selectedRows, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `users-export-${new Date().toISOString()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const changeRoleSelected = () => {
  const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined;
  const selectedIds = selectedRows?.map((row: User) => row.id);

  console.log("Change role for selected IDs:", selectedIds);
  alert(`Would change role for ${selectedIds?.length} users`);

  // In real app, make API call:
  // router.post('/users/change-role', { ids: selectedIds, role: 'admin' })
};

// Bulk select options - passed to DataTable component
const bulkSelectOptions: BulkActionOption<User>[] = [
  {
    label: "Delete",
    icon: Trash,
    variant: "destructive",
    action: deleteSelected,
  },
  {
    label: "Export",
    icon: Download,
    action: exportSelected,
  },
  {
    label: "Change Role",
    icon: UserCog,
    action: changeRoleSelected,
  },
];

// Handle server-side changes
// In a real application, this would make an API call to fetch data from the server
const handleServerSideChange = (tableState: TableStateChange) => {
  // Convert table state to server params with filter field types and search column
  const params = tableStateToServerParams(tableState, filterFields, "name");
  console.log("Server-side params:", params);

  // Simulate server-side filtering, sorting, and pagination
  let filteredData = [...MOCK_USERS];

  // Apply filters
  tableState.filters.forEach((filter) => {
    const { id, value } = filter;
    if (value !== undefined && value !== null && value !== "") {
      if (id === "name" && typeof value === "string") {
        // Search filter (text input in toolbar)
        filteredData = filteredData.filter((user) =>
          user.name.toLowerCase().includes(value.toLowerCase()),
        );
      } else if (id === "email" && Array.isArray(value)) {
        // Text filter (multi-instance support - OR logic)
        filteredData = filteredData.filter((user) =>
          value.some((v) => user.email.toLowerCase().includes(v.toLowerCase())),
        );
      } else if (id === "role" && typeof value === "string") {
        // Select filter (single choice)
        filteredData = filteredData.filter((user) => user.role === value);
      } else if (id === "status") {
        // Multiselect filter (OR logic)
        const values = Array.isArray(value) ? value : [value];
        filteredData = filteredData.filter((user) => values.includes(user.status));
      } else if (id === "age" && Array.isArray(value)) {
        // Number filter (multi-instance support - OR logic for exact matches)
        filteredData = filteredData.filter((user) => value.includes(user.age));
      } else if (id === "salary" && Array.isArray(value)) {
        // Range filter (multi-instance support - OR logic for ranges)
        filteredData = filteredData.filter((user) =>
          value.some((range) => {
            const { start, end } = range as { start: number; end: number };
            return user.salary >= start && user.salary <= end;
          }),
        );
      } else if (id === "is_verified" && typeof value === "boolean") {
        // Boolean filter
        filteredData = filteredData.filter((user) => user.is_verified === value);
      } else if (id === "last_login_at" && Array.isArray(value)) {
        // Date filter (multi-instance support - OR logic for dates)
        filteredData = filteredData.filter((user) =>
          value.some((dateValue) => {
            const date = dateValue as DateValue;
            if (!date) return false;

            const filterDate = new Date(date.year, date.month - 1, date.day);
            const userDate = new Date(user.last_login_at);

            // Exact date match
            return userDate.toDateString() === filterDate.toDateString();
          }),
        );
      } else if (id === "created_at" && Array.isArray(value)) {
        // Date range filter (multi-instance support - OR logic for date ranges)
        // Only processes complete date ranges (both start and end dates required)
        filteredData = filteredData.filter((user) =>
          value.some((dateValue) => {
            const range = dateValue as DateRangeValue;

            // Skip if either start or end date is missing
            if (!range.start || !range.end) return false;

            const startDate = new Date(range.start.year, range.start.month - 1, range.start.day);
            const endDate = new Date(range.end.year, range.end.month - 1, range.end.day);

            // Set time boundaries for accurate comparison
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            const userDate = new Date(user.created_at);
            userDate.setHours(12, 0, 0, 0);

            return userDate >= startDate && userDate <= endDate;
          }),
        );
      }
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

  // Update local state (simulates server response)
  localUsers.value = {
    data: paginatedData,
    meta: {
      current_page: pageIndex + 1,
      per_page: pageSize,
      total: filteredData.length,
      total_pages: Math.ceil(filteredData.length / pageSize),
    },
  };

  /**
   * In a real application, replace the above simulation with an actual API call:
   *
   * router.get(
   *   "/users",
   *   params,
   *   {
   *     preserveState: true,
   *     preserveScroll: true,
   *     only: ["users"],
   *   }
   * );
   */
};
</script>

<template>
  <div class="container mx-auto py-10 space-y-4">
    <!-- Server-Side DataTable -->
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
      :default-per-page="50"
      :page-size-options="[10, 20, 30, 50, 100]"
      :default-pinning="defaultPinning"
      :enable-column-pinning="true"
      max-height="300px"
    />
  </div>
</template>
