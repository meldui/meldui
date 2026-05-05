import { computed, onUnmounted, ref, type Ref } from 'vue'
import { createPluginMap, type RegisteredFilterPlugin } from './filterPlugins'
import type {
  AdvancedFilterValue,
  DataTableFilterField,
  FilterInstanceValue,
  FilterType,
  FilterValue,
  SimpleDateRangeFilterValue,
} from './types'

export interface FilterInstance<TData = unknown> {
  instanceId: string
  fieldId: string
  field: DataTableFilterField<TData>
  autoOpen: boolean
  openTrigger: number
}

export interface UseFiltersOptions<TData> {
  filterFields: DataTableFilterField<TData>[]
  filterPlugins?: RegisteredFilterPlugin[]
  advancedMode?: boolean
  /**
   * Seed initial filter values keyed by field id.
   * For multi-instance fields (text/number/date/range/daterange), the value is the
   * aggregated array; one UI instance is created per array entry.
   * For single-instance fields (select/boolean/multiselect), one UI instance is created.
   */
  initialValues?: Record<string, FilterInstanceValue>
  initialSearch?: string
  searchField?: { id: string; placeholder?: string; debounceMs?: number }
  /**
   * Forward-looking hook for facet count callbacks. Not consumed by built-in filters today.
   */
  getFacetCounts?: (fieldId: string) => Map<string, number> | undefined
}

export interface UseFiltersReturn<TData = unknown> {
  filterInstances: Ref<FilterInstance<TData>[]>
  /**
   * Aggregated values keyed by field id. Values follow the same shape rules as
   * the existing DataTable column filter values (simple mode: natural per-type
   * shape; advanced mode: array of operator objects).
   */
  filterValues: Readonly<Ref<Record<string, FilterInstanceValue>>>
  searchValue: Ref<string | undefined>
  isFiltered: Readonly<Ref<boolean>>

  addFilter: (fieldId: string) => void
  removeInstance: (instanceId: string) => void
  setInstanceValue: (instanceId: string, value: FilterValue | undefined) => void
  resetAll: () => void

  // Internal helpers (exposed for the <Filters> component to render instances)
  getInstanceValue: (instanceId: string) => FilterValue | undefined
  setSearchValue: (value: string | number) => void
  fields: Readonly<Ref<DataTableFilterField<TData>[]>>
  pluginMap: Readonly<Ref<Map<string, RegisteredFilterPlugin>>>
  advancedMode: boolean
  searchField: UseFiltersOptions<TData>['searchField']
}

/**
 * Manage filter instances, aggregated values, and debounced search input
 * independently of any view (table, grid, list, etc.).
 *
 * Design notes:
 * - Aggregation rules match the existing DataTableToolbar implementation so that
 *   server payload shapes are unchanged when this composable is wired into DataTable.
 * - Multi-instance support depends on filter type and mode: in advanced mode every
 *   type supports multiple instances; in simple mode only text/number/date/range/
 *   daterange and plugins that opt in via `supportsMultiInstance: true` do.
 * - Initial values seed UI instances on construction for URL state restoration.
 */
export function useFilters<TData = unknown>(
  options: UseFiltersOptions<TData>,
): UseFiltersReturn<TData> {
  const {
    filterFields,
    filterPlugins = [],
    advancedMode = false,
    initialValues,
    initialSearch,
    searchField,
    // Reserved for future facet feature
    getFacetCounts: _getFacetCounts,
  } = options

  void _getFacetCounts

  const fields = ref(filterFields) as Ref<DataTableFilterField<TData>[]>
  const pluginMap = ref(createPluginMap(filterPlugins)) as Ref<Map<string, RegisteredFilterPlugin>>

  const filterInstances = ref<FilterInstance<TData>[]>([]) as Ref<FilterInstance<TData>[]>
  const instanceValues = ref<Map<string, FilterValue>>(new Map())
  let instanceCounter = 0

  const searchValue = ref<string | undefined>(initialSearch || undefined)
  const debounceMs = searchField?.debounceMs ?? 300
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

  const getPlugin = (type: string) => pluginMap.value.get(type)

  function supportsMultiInstance(filterType: string): boolean {
    if (advancedMode) return true
    const plugin = getPlugin(filterType)
    if (plugin) {
      return plugin.supportsMultiInstance ?? false
    }
    return (
      filterType === 'text' ||
      filterType === 'number' ||
      filterType === 'date' ||
      filterType === 'range' ||
      filterType === 'daterange'
    )
  }

  function aggregate(fieldId: string, filterType: FilterType): FilterInstanceValue | undefined {
    const instances = filterInstances.value.filter((i) => i.fieldId === fieldId)
    if (instances.length === 0) return undefined

    const values = instances
      .map((i) => instanceValues.value.get(i.instanceId))
      .filter((v): v is FilterValue => v !== undefined)
    if (values.length === 0) return undefined

    if (advancedMode) {
      return values as AdvancedFilterValue
    }

    switch (filterType) {
      case 'select':
        return values[0] as string
      case 'boolean':
        return values[0] as boolean
      case 'multiselect':
        return values[0] as string[]
      case 'text':
      case 'number':
      case 'date':
        return values.flat() as FilterInstanceValue
      case 'range':
        return values as [number, number][]
      case 'daterange':
        return values as SimpleDateRangeFilterValue
      default:
        return values as FilterInstanceValue
    }
  }

  const filterValues = computed<Record<string, FilterInstanceValue>>(() => {
    const seenFields = new Set<string>()
    const result: Record<string, FilterInstanceValue> = {}
    for (const inst of filterInstances.value) {
      if (seenFields.has(inst.fieldId)) continue
      seenFields.add(inst.fieldId)
      const aggregated = aggregate(inst.fieldId, inst.field.type as FilterType)
      if (aggregated !== undefined) {
        result[inst.fieldId] = aggregated
      }
    }
    if (searchField && searchValue.value) {
      result[searchField.id] = searchValue.value
    }
    return result
  })

  const isFiltered = computed(
    () => filterInstances.value.length > 0 || (searchField !== undefined && !!searchValue.value),
  )

  function seedFromInitialValues() {
    if (!initialValues) return
    for (const [fieldId, filterValue] of Object.entries(initialValues)) {
      const field = fields.value.find((f) => String(f.id) === fieldId)
      if (!field) continue

      if (advancedMode) {
        const arr = Array.isArray(filterValue) ? filterValue : []
        for (const value of arr) {
          createInstance(fieldId, field, value as FilterValue)
        }
        continue
      }

      switch (field.type) {
        case 'text':
        case 'number':
        case 'date':
        case 'range':
        case 'daterange': {
          const arr = Array.isArray(filterValue) ? filterValue : []
          for (const value of arr) {
            createInstance(fieldId, field, value as FilterValue)
          }
          break
        }
        case 'select':
        case 'boolean':
        case 'multiselect':
        default: {
          createInstance(fieldId, field, filterValue as FilterValue)
          break
        }
      }
    }
  }

  function createInstance(
    fieldId: string,
    field: DataTableFilterField<TData>,
    value: FilterValue | undefined,
    autoOpen = false,
  ): string {
    const instanceId = `filter-${fieldId}-${instanceCounter++}`
    filterInstances.value.push({
      instanceId,
      fieldId,
      field,
      autoOpen,
      openTrigger: 0,
    })
    if (value !== undefined) {
      instanceValues.value.set(instanceId, value)
    }
    return instanceId
  }

  function addFilter(fieldId: string) {
    const field = fields.value.find((f) => String(f.id) === fieldId)
    if (!field) return

    if (!supportsMultiInstance(field.type)) {
      const existing = filterInstances.value.find((i) => i.fieldId === fieldId)
      if (existing) {
        existing.openTrigger++
        return
      }
    }

    createInstance(fieldId, field, undefined, true)
  }

  function setInstanceValue(instanceId: string, value: FilterValue | undefined) {
    if (value === undefined) {
      instanceValues.value.delete(instanceId)
    } else {
      instanceValues.value.set(instanceId, value)
    }
  }

  function removeInstance(instanceId: string) {
    const idx = filterInstances.value.findIndex((i) => i.instanceId === instanceId)
    if (idx === -1) return
    filterInstances.value.splice(idx, 1)
    instanceValues.value.delete(instanceId)
  }

  function resetAll() {
    filterInstances.value = []
    instanceValues.value.clear()
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
      searchDebounceTimer = null
    }
    searchValue.value = undefined
  }

  function getInstanceValue(instanceId: string): FilterValue | undefined {
    // Cast: TS expands the Map's stored DateValue union with extra structural
    // members from @internationalized/date variance, but values stored here are
    // FilterValue by construction (only setInstanceValue writes to this Map).
    return instanceValues.value.get(instanceId) as FilterValue | undefined
  }

  function setSearchValue(value: string | number) {
    const stringValue = String(value)
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
    searchDebounceTimer = setTimeout(() => {
      searchValue.value = stringValue || undefined
    }, debounceMs)
  }

  // Seed instances on construction (URL state restoration)
  seedFromInitialValues()

  onUnmounted(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer)
    }
  })

  return {
    filterInstances,
    filterValues,
    searchValue,
    isFiltered,

    addFilter,
    removeInstance,
    setInstanceValue,
    resetAll,

    getInstanceValue,
    setSearchValue,
    fields,
    pluginMap,
    advancedMode,
    searchField,
  }
}
