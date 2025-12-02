import { IconChevronDown, IconChevronRight } from '@meldui/tabler-vue'
import type { CellContext, ColumnDef, HeaderContext, Row } from '@tanstack/vue-table'
import { type Component, h, type VNode } from 'vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import ActionsCellDropdown from './ActionsCellDropdown.vue'
import ActionsCellInline from './ActionsCellInline.vue'
import DataTableColumnHeader from './DataTableColumnHeader.vue'

// ============================================================================
// Types
// ============================================================================

/**
 * Options for accessor columns
 */
export interface AccessorColumnOptions<TData, TValue = unknown> {
  /** Column title displayed in header */
  title: string
  /** Enable sorting (default: true) */
  enableSorting?: boolean
  /** Enable hiding (default: true) */
  enableHiding?: boolean
  /** Enable pinning (default: true) */
  enablePinning?: boolean
  /** Custom cell renderer */
  cell?: (props: CellContext<TData, TValue>) => VNode | string | number | null
  /** Custom footer renderer */
  footer?: (props: HeaderContext<TData, TValue>) => VNode | string | number | null
  /** Column size */
  size?: number
  /** Minimum column size */
  minSize?: number
  /** Maximum column size */
  maxSize?: number
  /** Additional column meta */
  meta?: Record<string, unknown>
}

/**
 * Options for display columns (no accessor)
 */
export interface DisplayColumnOptions<TData> {
  /** Unique column ID */
  id: string
  /** Column title displayed in header */
  title?: string
  /** Cell renderer (required for display columns) */
  cell: (props: CellContext<TData, unknown>) => VNode | string | number | null
  /** Enable hiding (default: true) */
  enableHiding?: boolean
  /** Enable pinning (default: true) */
  enablePinning?: boolean
  /** Column size */
  size?: number
  /** Minimum column size */
  minSize?: number
  /** Maximum column size */
  maxSize?: number
  /** Additional column meta */
  meta?: Record<string, unknown>
}

/**
 * Action definition for actions column
 */
export interface ActionDefinition<TData> {
  /** Action label */
  label: string
  /** Optional icon component */
  icon?: Component
  /** Button variant (for inline mode) */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Click handler */
  onClick: (row: Row<TData>) => void
  /** Condition to show/hide action */
  show?: (row: Row<TData>) => boolean
  /** Condition to disable action */
  disabled?: (row: Row<TData>) => boolean
}

/**
 * Options for actions column
 */
export interface ActionsColumnOptions<TData> {
  /** Display mode: inline buttons or dropdown menu */
  display?: 'inline' | 'dropdown'
  /** Action definitions */
  actions: ActionDefinition<TData>[]
  /** Column ID (default: 'actions') */
  id?: string
  /** Column title (default: 'Actions' for inline, empty for dropdown) */
  title?: string
  /** Dropdown trigger label (for dropdown mode, default: 'Actions') */
  dropdownLabel?: string
  /** Enable hiding (default: false for actions) */
  enableHiding?: boolean
  /** Enable pinning (default: true) */
  enablePinning?: boolean
  /** Column size */
  size?: number
  /** Minimum column size */
  minSize?: number
}

/**
 * Options for selection column
 */
export interface SelectionColumnOptions {
  /** Column ID (default: 'select') */
  id?: string
  /** Enable pinning (default: true) */
  enablePinning?: boolean
  /** Column size (default: 32) */
  size?: number
}

/**
 * Options for expander column
 */
export interface ExpanderColumnOptions<TData> {
  /** Column ID (default: 'expander') */
  id?: string
  /** Enable pinning (default: true) */
  enablePinning?: boolean
  /** Column size (default: 40) */
  size?: number
  /** Function to determine if row can be expanded */
  getCanExpand?: (row: Row<TData>) => boolean
}

// ============================================================================
// Column Helper Factory
// ============================================================================

/**
 * Creates a typed column helper for defining DataTable columns.
 *
 * @example
 * ```ts
 * interface User {
 *   id: string
 *   name: string
 *   email: string
 *   status: 'active' | 'inactive'
 * }
 *
 * const helper = createColumnHelper<User>()
 *
 * const columns = [
 *   helper.selection(),
 *   helper.accessor('name', { title: 'Name', enableSorting: true }),
 *   helper.accessor('email', { title: 'Email' }),
 *   helper.accessor('status', {
 *     title: 'Status',
 *     cell: cellRenderers.badge({ colorMap: { active: 'green', inactive: 'gray' } })
 *   }),
 *   helper.actions({
 *     display: 'dropdown',
 *     actions: [
 *       { label: 'Edit', onClick: (row) => editUser(row.original) },
 *       { label: 'Delete', variant: 'destructive', onClick: (row) => deleteUser(row.original) }
 *     ]
 *   })
 * ]
 * ```
 */
export function createColumnHelper<TData>() {
  return {
    /**
     * Creates an accessor column with auto-generated header
     *
     * @param accessorKey - The key to access the data
     * @param options - Column options
     */
    accessor<TKey extends keyof TData & string>(
      accessorKey: TKey,
      options: AccessorColumnOptions<TData, TData[TKey]>,
    ): ColumnDef<TData, TData[TKey]> {
      return {
        accessorKey,
        header: ({ column }: HeaderContext<TData, TData[TKey]>) =>
          h(DataTableColumnHeader, {
            column,
            title: options.title,
          }),
        // Only include cell if a custom renderer is provided
        // Otherwise let TanStack Table use its default cell renderer (getValue())
        ...(options.cell && {
          cell: (props: CellContext<TData, TData[TKey]>) => options.cell!(props),
        }),
        // Only include footer if a custom renderer is provided
        ...(options.footer && {
          footer: (props: HeaderContext<TData, TData[TKey]>) => options.footer!(props),
        }),
        enableSorting: options.enableSorting ?? true,
        enableHiding: options.enableHiding ?? true,
        enablePinning: options.enablePinning ?? true,
        size: options.size,
        minSize: options.minSize,
        maxSize: options.maxSize,
        meta: options.meta,
      } as ColumnDef<TData, TData[TKey]>
    },

    /**
     * Creates a display column (no data accessor)
     *
     * @param options - Column options including id and cell renderer
     */
    display(options: DisplayColumnOptions<TData>): ColumnDef<TData, unknown> {
      return {
        id: options.id,
        header: options.title
          ? ({ column }: HeaderContext<TData, unknown>) =>
              h(DataTableColumnHeader, {
                column,
                title: options.title,
              })
          : undefined,
        cell: (props: CellContext<TData, unknown>) => options.cell(props),
        enableSorting: false,
        enableHiding: options.enableHiding ?? true,
        enablePinning: options.enablePinning ?? true,
        size: options.size,
        minSize: options.minSize,
        maxSize: options.maxSize,
        meta: options.meta,
      }
    },

    /**
     * Creates a selection checkbox column
     *
     * @param options - Optional column options
     */
    selection(options?: SelectionColumnOptions): ColumnDef<TData, unknown> {
      const id = options?.id ?? 'select'
      const size = options?.size ?? 32

      return {
        id,
        header: ({ table }) =>
          h(Checkbox, {
            modelValue: table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false,
            'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
              table.toggleAllPageRowsSelected(!!value),
            ariaLabel: 'Select all',
          }),
        cell: ({ row }) =>
          h(Checkbox, {
            modelValue: row.getIsSelected(),
            'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
              row.toggleSelected(!!value),
            ariaLabel: 'Select row',
          }),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        enablePinning: options?.enablePinning ?? true,
        size,
        minSize: size,
        maxSize: size,
      }
    },

    /**
     * Creates an expander column for row expansion
     *
     * @param options - Optional column options
     */
    expander(options?: ExpanderColumnOptions<TData>): ColumnDef<TData, unknown> {
      const id = options?.id ?? 'expander'
      const size = options?.size ?? 40

      return {
        id,
        header: () => null,
        cell: ({ row }) => {
          const canExpand = options?.getCanExpand ? options.getCanExpand(row) : row.getCanExpand()

          if (!canExpand) {
            return null
          }

          return h(
            Button,
            {
              variant: 'ghost',
              size: 'icon',
              class: 'h-6 w-6',
              onClick: (e: Event) => {
                e.stopPropagation()
                row.toggleExpanded()
              },
            },
            () =>
              row.getIsExpanded()
                ? h(IconChevronDown, { class: 'h-4 w-4' })
                : h(IconChevronRight, { class: 'h-4 w-4' }),
          )
        },
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        enablePinning: options?.enablePinning ?? true,
        size,
        minSize: size,
        maxSize: size,
      }
    },

    /**
     * Creates an actions column with inline buttons or dropdown menu
     *
     * @param options - Actions column options
     */
    actions(options: ActionsColumnOptions<TData>): ColumnDef<TData, unknown> {
      const id = options.id ?? 'actions'
      const display = options.display ?? 'dropdown'
      const title = options.title ?? (display === 'inline' ? 'Actions' : undefined)

      return {
        id,
        header: title
          ? ({ column }: HeaderContext<TData, unknown>) =>
              h(DataTableColumnHeader, {
                column,
                title,
              })
          : () => h('span', { class: 'sr-only' }, 'Actions'),
        cell: ({ row }) => {
          if (display === 'dropdown') {
            return h(ActionsCellDropdown, {
              row,
              actions: options.actions as ActionDefinition<unknown>[],
              dropdownLabel: options.dropdownLabel ?? 'Actions',
            })
          }
          return h(ActionsCellInline, {
            row,
            actions: options.actions as ActionDefinition<unknown>[],
          })
        },
        enableSorting: false,
        enableHiding: options.enableHiding ?? false,
        enablePinning: options.enablePinning ?? true,
        size: options.size,
        minSize: options.minSize,
      }
    },
  }
}

// ============================================================================
// Convenience Types
// ============================================================================

/**
 * Type of the column helper returned by createColumnHelper
 */
export type ColumnHelper<TData> = ReturnType<typeof createColumnHelper<TData>>
