<script setup lang="ts">
import {
    IconArrowDown,
    IconArrowUp,
    IconDotsVertical,
    IconEdit,
    IconEye,
    IconFilter,
    IconFlag,
    IconFolder,
    IconMinus,
    IconPlus,
    IconTrash,
} from "@meldui/tabler-vue";
import {
    Badge,
    BulkActionOption,
    Button,
    createColumnHelper,
    DataTable,
    DataTableColumnHeader,
    DataTableFilterField,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    RelativeTime,
} from "@meldui/vue";
import type {
    CellContext,
    ColumnDef,
    ColumnFiltersState,
    HeaderContext,
    PaginationState,
    SortingState,
} from "@tanstack/vue-table";
import { computed, h, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import TaskForm from "@/components/tasks/TaskForm.vue";
import { allProjects, getProject } from "@/stores/projects";
import {
    allTasks,
    deleteTask,
    deleteTasks,
    updateTasksStatus,
} from "@/stores/tasks";
import type { Task, TaskPriority, TaskStatus } from "@/types";

const router = useRouter();

// Dialog state
const isCreateDialogOpen = ref(false);

// Table state interface
interface TableState {
    sorting: SortingState;
    filters: ColumnFiltersState;
    pagination: PaginationState;
}

// Server response interface
interface ServerResponse {
    data: Task[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        total_pages: number;
    };
}

// Simulate server-side filtering, sorting, and pagination
function simulateServerSide(
    data: Task[],
    tableState: TableState,
): ServerResponse {
    let filteredData = [...data];

    // Apply filters
    tableState.filters.forEach((filter: { id: string; value: unknown }) => {
        const { id, value } = filter;
        if (value === undefined || value === null || value === "") return;

        switch (id) {
            case "title":
                if (typeof value === "string") {
                    filteredData = filteredData.filter(
                        (task) =>
                            task.title
                                .toLowerCase()
                                .includes(value.toLowerCase()) ||
                            task.description
                                .toLowerCase()
                                .includes(value.toLowerCase()),
                    );
                }
                break;

            case "status": {
                const values = Array.isArray(value) ? value : [value];
                filteredData = filteredData.filter((task) =>
                    values.includes(task.status),
                );
                break;
            }

            case "priority": {
                const values = Array.isArray(value) ? value : [value];
                filteredData = filteredData.filter((task) =>
                    values.includes(task.priority),
                );
                break;
            }

            case "projectId": {
                const values = Array.isArray(value) ? value : [value];
                filteredData = filteredData.filter((task) =>
                    task.projectId
                        ? values.includes(task.projectId)
                        : values.includes("none"),
                );
                break;
            }
        }
    });

    // Apply sorting
    if (tableState.sorting.length > 0) {
        const { id, desc } = tableState.sorting[0];
        filteredData.sort((a, b) => {
            const aVal = a[id as keyof Task];
            const bVal = b[id as keyof Task];
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
    const paginatedData = filteredData.slice(start, start + pageSize);

    return {
        data: paginatedData,
        meta: {
            current_page: pageIndex + 1,
            per_page: pageSize,
            total: filteredData.length,
            total_pages: Math.ceil(filteredData.length / pageSize),
        },
    };
}

// DataTable reference
const dataTableRef = ref<InstanceType<typeof DataTable> | null>(null);

// Reactive server data
const serverData = ref<ServerResponse>(
    simulateServerSide(allTasks.value, {
        sorting: [],
        filters: [],
        pagination: { pageIndex: 0, pageSize: 10 },
    }),
);

const pageCount = computed(() => serverData.value.meta.total_pages);

// Handle server-side changes
const handleServerSideChange = (state: TableState) => {
    serverData.value = simulateServerSide(allTasks.value, state);
};

// Helpers
const getStatusBadgeVariant = (status: TaskStatus) => {
    switch (status) {
        case "done":
            return "default" as const;
        case "in-progress":
            return "secondary" as const;
        default:
            return "neutral" as const;
    }
};

const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
        case "in-progress":
            return "In Progress";
        case "todo":
            return "To Do";
        case "done":
            return "Done";
    }
};

// Column helper for type-safe columns
const helper = createColumnHelper<Task>();

// Column definitions
const columns: ColumnDef<Task, unknown>[] = [
    helper.selection(),
    {
        accessorKey: "title",
        header: ({ column, table }: HeaderContext<Task, unknown>) =>
            h(DataTableColumnHeader, { column, table, title: "Title" }),
        cell: ({ row }: CellContext<Task, unknown>) =>
            h("div", { class: "font-medium" }, row.getValue("title") as string),
        meta: { displayName: "Title" },
        enableSorting: true,
    },
    {
        accessorKey: "status",
        header: ({ column, table }: HeaderContext<Task, unknown>) =>
            h(DataTableColumnHeader, { column, table, title: "Status" }),
        cell: ({ row }: CellContext<Task, unknown>) => {
            const status = row.getValue("status") as TaskStatus;
            return h(Badge, { variant: getStatusBadgeVariant(status) }, () =>
                getStatusLabel(status),
            );
        },
        meta: { displayName: "Status" },
        enableSorting: true,
    },
    {
        accessorKey: "priority",
        header: ({ column, table }: HeaderContext<Task, unknown>) =>
            h(DataTableColumnHeader, { column, table, title: "Priority" }),
        cell: ({ row }: CellContext<Task, unknown>) => {
            const priority = row.getValue("priority") as TaskPriority;
            const iconClass = {
                high: "text-red-500",
                medium: "text-yellow-500",
                low: "text-green-500",
            }[priority];
            const IconComponent = {
                high: IconArrowUp,
                medium: IconMinus,
                low: IconArrowDown,
            }[priority];
            return h("div", { class: "flex items-center gap-1" }, [
                h(IconComponent, { class: `h-4 w-4 ${iconClass}` }),
                h("span", { class: "capitalize" }, priority),
            ]);
        },
        meta: { displayName: "Priority" },
        enableSorting: true,
    },
    {
        accessorKey: "projectId",
        header: ({ column, table }: HeaderContext<Task, unknown>) =>
            h(DataTableColumnHeader, { column, table, title: "Project" }),
        cell: ({ row }: CellContext<Task, unknown>) => {
            const projectId = row.getValue("projectId") as string | null;
            if (!projectId) {
                return h("span", { class: "text-muted-foreground" }, "—");
            }
            const project = getProject(projectId);
            return h("span", {}, project?.name || "Unknown");
        },
        meta: { displayName: "Project" },
        enableSorting: true,
    },
    {
        accessorKey: "dueDate",
        header: ({ column, table }: HeaderContext<Task, unknown>) =>
            h(DataTableColumnHeader, { column, table, title: "Due Date" }),
        cell: ({ row }: CellContext<Task, unknown>) => {
            const dueDate = row.getValue("dueDate") as string | null;
            if (!dueDate) {
                return h("span", { class: "text-muted-foreground" }, "—");
            }
            return h(RelativeTime, { date: dueDate });
        },
        meta: { displayName: "Due Date" },
        enableSorting: true,
    },
    {
        id: "actions",
        header: () => h("div", { class: "text-right" }, "Actions"),
        cell: ({ row }: CellContext<Task, unknown>) => {
            const task = row.original;
            return h(
                "div",
                {
                    class: "flex justify-end",
                    onClick: (e: Event) => e.stopPropagation(),
                },
                [
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
                                                {
                                                    variant: "ghost",
                                                    size: "icon",
                                                },
                                                {
                                                    default: () =>
                                                        h(IconDotsVertical, {
                                                            class: "h-4 w-4",
                                                        }),
                                                },
                                            ),
                                    },
                                ),
                                h(
                                    DropdownMenuContent,
                                    { align: "end" },
                                    {
                                        default: () => [
                                            h(
                                                DropdownMenuItem,
                                                {
                                                    onClick: () =>
                                                        router.push(
                                                            `/tasks/${task.id}`,
                                                        ),
                                                },
                                                {
                                                    default: () => [
                                                        h(IconEye, {
                                                            class: "mr-2 h-4 w-4",
                                                        }),
                                                        "View",
                                                    ],
                                                },
                                            ),
                                            h(
                                                DropdownMenuItem,
                                                {
                                                    onClick: () =>
                                                        router.push(
                                                            `/tasks/${task.id}`,
                                                        ),
                                                },
                                                {
                                                    default: () => [
                                                        h(IconEdit, {
                                                            class: "mr-2 h-4 w-4",
                                                        }),
                                                        "Edit",
                                                    ],
                                                },
                                            ),
                                            h(DropdownMenuSeparator),
                                            h(
                                                DropdownMenuItem,
                                                {
                                                    class: "text-destructive",
                                                    onClick: () =>
                                                        handleDelete(task),
                                                },
                                                {
                                                    default: () => [
                                                        h(IconTrash, {
                                                            class: "mr-2 h-4 w-4",
                                                        }),
                                                        "Delete",
                                                    ],
                                                },
                                            ),
                                        ],
                                    },
                                ),
                            ],
                        },
                    ),
                ],
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];

// Filter fields configuration
const filterFields = computed<DataTableFilterField<Task>[]>(() => [
    {
        id: "title",
        label: "Search",
        type: "text",
        placeholder: "Search tasks...",
    },
    {
        id: "status",
        label: "Status",
        type: "multiselect",
        icon: IconFilter,
        options: [
            { label: "To Do", value: "todo" },
            { label: "In Progress", value: "in-progress" },
            { label: "Done", value: "done" },
        ],
    },
    {
        id: "priority",
        label: "Priority",
        type: "multiselect",
        icon: IconFlag,
        options: [
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
        ],
    },
    {
        id: "projectId",
        label: "Project",
        type: "multiselect",
        icon: IconFolder,
        options: [
            { label: "No Project", value: "none" },
            ...allProjects.value.map((p) => ({ label: p.name, value: p.id })),
        ],
    },
]);

// Bulk actions
const bulkActions: BulkActionOption<Task>[] = [
    {
        label: "Mark as To Do",
        action: (rows) => {
            const ids = rows.map((r) => r.id);
            const count = updateTasksStatus(ids, "todo");
            toast.success(`Updated ${count} tasks to To Do`);
            dataTableRef.value?.resetSelection();
            dataTableRef.value?.refresh();
        },
    },
    {
        label: "Mark as In Progress",
        action: (rows) => {
            const ids = rows.map((r) => r.id);
            const count = updateTasksStatus(ids, "in-progress");
            toast.success(`Updated ${count} tasks to In Progress`);
            dataTableRef.value?.resetSelection();
            dataTableRef.value?.refresh();
        },
    },
    {
        label: "Mark as Done",
        action: (rows) => {
            const ids = rows.map((r) => r.id);
            const count = updateTasksStatus(ids, "done");
            toast.success(`Updated ${count} tasks to Done`);
            dataTableRef.value?.resetSelection();
            dataTableRef.value?.refresh();
        },
    },
    {
        label: "Delete",
        icon: IconTrash,
        variant: "destructive",
        action: (rows) => {
            const ids = rows.map((r) => r.id);
            const count = deleteTasks(ids);
            toast.success(`Deleted ${count} tasks`);
            dataTableRef.value?.resetSelection();
            dataTableRef.value?.refresh();
        },
    },
];

// Actions
const handleDelete = (task: Task) => {
    deleteTask(task.id);
    toast.success("Task deleted", { description: task.title });
    dataTableRef.value?.refresh();
};

const handleTaskCreated = () => {
    isCreateDialogOpen.value = false;
    toast.success("Task created");
    dataTableRef.value?.refresh();
};
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold tracking-tight">Tasks</h1>
                <p class="text-muted-foreground">Manage and track your tasks</p>
            </div>
            <Dialog v-model:open="isCreateDialogOpen">
                <DialogTrigger as-child>
                    <Button>
                        <IconPlus class="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                        <DialogDescription
                            >Add a new task to your list</DialogDescription
                        >
                    </DialogHeader>
                    <TaskForm
                        @submit="handleTaskCreated"
                        @cancel="isCreateDialogOpen = false"
                    />
                </DialogContent>
            </Dialog>
        </div>

        <!-- DataTable -->
        <DataTable
            ref="dataTableRef"
            :columns="columns"
            :data="serverData.data"
            :page-count="pageCount"
            :filter-fields="filterFields"
            :bulk-select-options="bulkActions"
            :on-server-side-change="handleServerSideChange"
            enable-row-selection
            show-selected-count
            empty-message="No tasks found"
            search-placeholder="Search tasks..."
        />
    </div>
</template>
