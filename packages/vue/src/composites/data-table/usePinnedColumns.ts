import type { Table } from '@tanstack/vue-table'
import { nextTick, onMounted, onUnmounted, type Ref, ref, watch } from 'vue'

/**
 * Composable for managing pinned column offsets and scroll state
 *
 * Features:
 * - Calculates dynamic left/right offsets for pinned columns
 * - Detects scroll state for shadow feedback
 * - Uses ResizeObserver for dynamic width changes
 * - Updates offsets when pinning state changes
 */
export function usePinnedColumns<TData>(tableInstance: Ref<Table<TData>>) {
  const tableRef = ref<HTMLElement | null>(null)
  const isScrolled = ref(false)
  const hasRightScroll = ref(false)

  let resizeObserver: ResizeObserver | null = null
  let scrollContainer: Element | null = null

  // Watch for when tableRef gets populated
  watch(
    tableRef,
    (newValue) => {
      if (newValue) {
        nextTick(() => {
          updatePinnedOffsets()
          setupResizeObserver()
          setupScrollListener()
        })
      }
    },
    { immediate: true },
  )

  /**
   * Calculate and apply CSS custom properties for pinned column offsets
   * Calculates offsets using actual DOM widths for accuracy
   */
  const updatePinnedOffsets = () => {
    if (!tableRef.value) return

    const table = tableInstance.value

    // Get pinned column groups
    const leftPinnedColumns = table.getLeftLeafColumns()
    const rightPinnedColumns = table.getRightLeafColumns()

    // Process left-pinned columns - accumulate widths from left to right
    let leftAccumulatedWidth = 0

    leftPinnedColumns.forEach((column) => {
      const columnId = column.id
      const headerCell = tableRef.value!.querySelector(
        `thead th[data-column-id="${columnId}"]`,
      ) as HTMLElement
      const bodyCells = tableRef.value!.querySelectorAll(`tbody td[data-column-id="${columnId}"]`)

      if (!headerCell) return

      // For the first column, offset is 0
      // For subsequent columns, offset is the accumulated width of previous columns
      const totalOffset = leftAccumulatedWidth

      // Set the offset for this column
      headerCell.style.setProperty('--col-left-offset', `${totalOffset}px`)
      bodyCells.forEach((cell) => {
        ;(cell as HTMLElement).style.setProperty('--col-left-offset', `${totalOffset}px`)
      })

      // Add this column's width to the accumulator for the next column
      // Use offsetWidth which includes padding and borders
      leftAccumulatedWidth += headerCell.offsetWidth
    })

    // Process right-pinned columns - accumulate widths from right to left
    let rightAccumulatedWidth = 0

    // Process from right to left (last in array is rightmost)
    // Since we now prepend to the array, the last element should be rightmost
    for (let i = rightPinnedColumns.length - 1; i >= 0; i--) {
      const column = rightPinnedColumns[i]
      const columnId = column.id
      const headerCell = tableRef.value!.querySelector(
        `thead th[data-column-id="${columnId}"]`,
      ) as HTMLElement
      const bodyCells = tableRef.value!.querySelectorAll(`tbody td[data-column-id="${columnId}"]`)

      if (!headerCell) continue

      // For the rightmost column (last in array), offset is 0
      // For subsequent columns (moving left), offset is the accumulated width
      const totalOffset = rightAccumulatedWidth

      // Set the offset for this column
      headerCell.style.setProperty('--col-right-offset', `${totalOffset}px`)
      bodyCells.forEach((cell) => {
        ;(cell as HTMLElement).style.setProperty('--col-right-offset', `${totalOffset}px`)
      })

      // Add this column's width to the accumulator for the next column
      rightAccumulatedWidth += headerCell.offsetWidth
    }
  }

  /**
   * Handle scroll events to update shadow feedback state
   */
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement

    // Check if scrolled from left edge
    isScrolled.value = target.scrollLeft > 0

    // Check if there's room to scroll right
    const maxScrollLeft = target.scrollWidth - target.clientWidth
    hasRightScroll.value = target.scrollLeft < maxScrollLeft - 1 // -1 for rounding errors
  }

  /**
   * Setup ResizeObserver to watch for column width changes
   */
  const setupResizeObserver = () => {
    if (!tableRef.value) return

    resizeObserver = new ResizeObserver(() => {
      // Use nextTick to ensure DOM has updated
      nextTick(() => {
        updatePinnedOffsets()
      })
    })

    // Observe all table cells for size changes
    const cells = tableRef.value.querySelectorAll('th, td')
    cells.forEach((cell) => resizeObserver!.observe(cell))
  }

  /**
   * Setup scroll listener on the table container
   */
  const setupScrollListener = () => {
    if (!tableRef.value) return

    // tableRef.value IS the table-container now
    scrollContainer = tableRef.value

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)

      // Initial check - use actual scroll values
      const container = scrollContainer as HTMLElement
      isScrolled.value = container.scrollLeft > 0
      const maxScrollLeft = container.scrollWidth - container.clientWidth
      hasRightScroll.value = container.scrollLeft < maxScrollLeft - 1
    }
  }

  /**
   * Cleanup observers and listeners
   */
  const cleanup = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', handleScroll)
      scrollContainer = null
    }
  }

  /**
   * Initialize on mount
   */
  onMounted(() => {
    // Wait for next tick to ensure table is rendered
    nextTick(() => {
      if (tableRef.value) {
        updatePinnedOffsets()
        setupResizeObserver()
        setupScrollListener()
      }
    })
  })

  /**
   * Cleanup on unmount
   */
  onUnmounted(() => {
    cleanup()
  })

  /**
   * Watch for pinning state changes
   */
  watch(
    () => tableInstance.value.getState().columnPinning,
    () => {
      nextTick(() => {
        updatePinnedOffsets()
      })
    },
    { deep: true },
  )

  /**
   * Watch for visibility changes (show/hide columns)
   */
  watch(
    () => tableInstance.value.getState().columnVisibility,
    () => {
      nextTick(() => {
        updatePinnedOffsets()
      })
    },
    { deep: true },
  )

  /**
   * Watch for data changes (pagination, filtering, etc.)
   */
  watch(
    () => tableInstance.value.getRowModel().rows.length,
    () => {
      nextTick(() => {
        // Re-setup resize observer for new cells
        cleanup()
        updatePinnedOffsets()
        setupResizeObserver()
        setupScrollListener()
      })
    },
  )

  return {
    tableRef,
    isScrolled,
    hasRightScroll,
    updatePinnedOffsets,
  }
}
