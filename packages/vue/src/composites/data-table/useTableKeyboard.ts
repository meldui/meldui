import type { Row, Table } from '@tanstack/vue-table'
import { computed, onMounted, onUnmounted, type Ref, ref, watch } from 'vue'

export interface UseTableKeyboardOptions<TData> {
  table: Table<TData>
  tableContainerRef: Ref<HTMLElement | null>
  enableSelection?: boolean
  enablePagination?: boolean
  onRowActivate?: (row: Row<TData>) => void
  onSelectionChange?: () => void
  onEscape?: () => void
}

export interface UseTableKeyboardReturn {
  focusedRowIndex: Ref<number>
  isFocused: Ref<boolean>
  focusTable: () => void
  blurTable: () => void
}

export function useTableKeyboard<TData>(
  options: UseTableKeyboardOptions<TData>,
): UseTableKeyboardReturn {
  const {
    table,
    tableContainerRef,
    enableSelection = false,
    enablePagination = true,
    onRowActivate,
    onSelectionChange,
    onEscape,
  } = options

  // Focus state
  const isFocused = ref(false)
  const focusedRowIndex = ref(-1)

  // Computed values
  const rowCount = computed(() => table.getRowModel().rows.length)

  // Get row elements
  const getRowElements = (): HTMLTableRowElement[] => {
    const tableEl = tableContainerRef.value?.querySelector('table')
    if (!tableEl) return []
    return Array.from(tableEl.querySelectorAll('tbody tr'))
  }

  // Update visual focus indicators
  const updateFocusIndicators = () => {
    const rows = getRowElements()

    // Clear all focus states
    rows.forEach((row) => {
      row.removeAttribute('data-keyboard-focused')
    })

    // Set focus on current row
    if (focusedRowIndex.value >= 0 && focusedRowIndex.value < rows.length) {
      rows[focusedRowIndex.value].setAttribute('data-keyboard-focused', 'true')
    }
  }

  // Focus table container
  const focusTable = () => {
    tableContainerRef.value?.focus()
  }

  // Blur table container
  const blurTable = () => {
    tableContainerRef.value?.blur()
  }

  // Navigate to a specific row
  const navigateToRow = (index: number) => {
    if (rowCount.value === 0) return

    // Clamp to valid range
    const newIndex = Math.max(0, Math.min(index, rowCount.value - 1))
    focusedRowIndex.value = newIndex
    updateFocusIndicators()

    // Scroll row into view
    const rows = getRowElements()
    if (rows[newIndex]) {
      rows[newIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }

  // Toggle selection for current row
  const toggleCurrentRowSelection = () => {
    if (!enableSelection) return
    if (focusedRowIndex.value < 0) return

    const rows = table.getRowModel().rows
    if (focusedRowIndex.value < rows.length) {
      const row = rows[focusedRowIndex.value]
      row.toggleSelected()
      onSelectionChange?.()
    }
  }

  // Activate current row (enter key)
  const activateCurrentRow = () => {
    if (focusedRowIndex.value < 0) return

    const rows = table.getRowModel().rows
    if (focusedRowIndex.value < rows.length) {
      const row = rows[focusedRowIndex.value]
      onRowActivate?.(row)
    }
  }

  // Handle keyboard events
  const handleKeyDown = (event: KeyboardEvent) => {
    // Skip if focus is on an input element inside the table
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    ) {
      return
    }

    const { key, ctrlKey, metaKey } = event
    const modKey = ctrlKey || metaKey

    switch (key) {
      // Row navigation
      case 'ArrowDown':
        event.preventDefault()
        if (focusedRowIndex.value < 0) {
          navigateToRow(0)
        } else {
          navigateToRow(focusedRowIndex.value + 1)
        }
        break

      case 'ArrowUp':
        event.preventDefault()
        if (focusedRowIndex.value < 0) {
          navigateToRow(0)
        } else {
          navigateToRow(focusedRowIndex.value - 1)
        }
        break

      // First/last row
      case 'Home':
        event.preventDefault()
        navigateToRow(0)
        break

      case 'End':
        event.preventDefault()
        navigateToRow(rowCount.value - 1)
        break

      // Pagination
      case 'PageDown':
        if (enablePagination && table.getCanNextPage()) {
          event.preventDefault()
          if (modKey) {
            // Ctrl+PageDown: Last page
            table.setPageIndex(table.getPageCount() - 1)
          } else {
            // PageDown: Next page
            table.nextPage()
          }
          // Reset row focus to first row on new page
          focusedRowIndex.value = 0
        }
        break

      case 'PageUp':
        if (enablePagination && table.getCanPreviousPage()) {
          event.preventDefault()
          if (modKey) {
            // Ctrl+PageUp: First page
            table.setPageIndex(0)
          } else {
            // PageUp: Previous page
            table.previousPage()
          }
          // Reset row focus to first row on new page
          focusedRowIndex.value = 0
        }
        break

      // Selection
      case ' ':
        // Space: Toggle row selection
        if (enableSelection && focusedRowIndex.value >= 0) {
          event.preventDefault()
          toggleCurrentRowSelection()
        }
        break

      // Activate row
      case 'Enter':
        if (focusedRowIndex.value >= 0) {
          event.preventDefault()
          activateCurrentRow()
        }
        break

      // Escape
      case 'Escape':
        event.preventDefault()
        if (enableSelection) {
          // Clear selection
          table.resetRowSelection()
          onSelectionChange?.()
        }
        // Reset focus
        focusedRowIndex.value = -1
        updateFocusIndicators()
        onEscape?.()
        break
    }
  }

  // Handle focus events
  const handleFocus = () => {
    isFocused.value = true
    // Initialize focus to first row if not already focused
    if (focusedRowIndex.value < 0 && rowCount.value > 0) {
      focusedRowIndex.value = 0
    }
    updateFocusIndicators()
  }

  const handleBlur = (event: FocusEvent) => {
    // Check if focus moved to an element inside the table container
    const relatedTarget = event.relatedTarget as HTMLElement | null
    if (relatedTarget && tableContainerRef.value?.contains(relatedTarget)) {
      return
    }
    isFocused.value = false
    updateFocusIndicators()
  }

  // Setup event listeners
  onMounted(() => {
    const container = tableContainerRef.value
    if (container) {
      container.addEventListener('keydown', handleKeyDown)
      container.addEventListener('focus', handleFocus)
      container.addEventListener('blur', handleBlur)
    }
  })

  onUnmounted(() => {
    const container = tableContainerRef.value
    if (container) {
      container.removeEventListener('keydown', handleKeyDown)
      container.removeEventListener('focus', handleFocus)
      container.removeEventListener('blur', handleBlur)
    }
  })

  // Reset focus when data changes
  watch(rowCount, () => {
    if (focusedRowIndex.value >= rowCount.value) {
      focusedRowIndex.value = Math.max(0, rowCount.value - 1)
    }
    updateFocusIndicators()
  })

  return {
    focusedRowIndex,
    isFocused,
    focusTable,
    blurTable,
  }
}
