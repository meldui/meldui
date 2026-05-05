<script setup lang="ts" generic="TData">
import { IconLoader2, IconSearch, IconX } from '@meldui/tabler-vue'
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DataTableFilterCommand from './DataTableFilterCommand.vue'
import type { RegisteredFilterPlugin } from './filterPlugins'
import { isBuiltInFilterType } from './filterPlugins'
import BooleanFilter from './filters/BooleanFilter.vue'
import DateFilter from './filters/DateFilter.vue'
import DateRangeFilter from './filters/DateRangeFilter.vue'
import MultiSelectFilter from './filters/MultiSelectFilter.vue'
import NumberFilter from './filters/NumberFilter.vue'
import RangeFilter from './filters/RangeFilter.vue'
import SelectFilter from './filters/SelectFilter.vue'
import TextFilter from './filters/TextFilter.vue'
import type {
  BooleanOperator,
  DataTableFilterField,
  DateOperator,
  FilterInstanceValue,
  FilterValue,
  NumberOperator,
  SelectOperator,
  TextOperator,
} from './types'
import { useFilters, type UseFiltersReturn } from './useFilters'

interface Props {
  fields: DataTableFilterField<TData>[]
  plugins?: RegisteredFilterPlugin[]
  advancedMode?: boolean
  searchField?: { id: string; placeholder?: string; debounceMs?: number }
  initialValues?: Record<string, FilterInstanceValue>
  initialSearch?: string
  loading?: boolean
  /**
   * Optional pre-instantiated useFilters() return value. When provided, the component
   * renders against this state and does NOT instantiate its own composable. This is
   * the advanced wiring path for parents that need imperative access (e.g., adding a
   * filter from a button outside the component).
   */
  state?: UseFiltersReturn<TData>
}

const props = withDefaults(defineProps<Props>(), {
  plugins: () => [],
  advancedMode: false,
  loading: false,
})

const emit = defineEmits<{
  'update:filterValues': [value: Record<string, FilterInstanceValue>]
  /**
   * `change` fires when any filter or the search input updates. The search value
   * (if a `searchField` was provided) is included inside `filterValues` under
   * `searchField.id` — there is no separate `searchValue` field.
   */
  change: [payload: { filterValues: Record<string, FilterInstanceValue> }]
  reset: []
}>()

const internalState = props.state
  ? null
  : useFilters<TData>({
      filterFields: props.fields,
      filterPlugins: props.plugins,
      advancedMode: props.advancedMode,
      initialValues: props.initialValues,
      initialSearch: props.initialSearch,
      searchField: props.searchField,
    })

const state = computed<UseFiltersReturn<TData>>(
  () => (props.state ?? internalState) as UseFiltersReturn<TData>,
)

const filterInstances = computed(() => state.value.filterInstances.value)
const filterValues = computed(() => state.value.filterValues.value)
const searchValue = computed(() => state.value.searchValue.value)
const isFiltered = computed(() => state.value.isFiltered.value)
const pluginMap = computed(() => state.value.pluginMap.value)

const getPlugin = (type: string) => pluginMap.value.get(type)
const isPluginFilter = (type: string) => !isBuiltInFilterType(type) && pluginMap.value.has(type)

// Local search input value (debounced upward via composable)
const searchInputValue = ref<string>(searchValue.value ?? '')

watch(searchValue, (next) => {
  if ((next ?? '') !== searchInputValue.value) {
    searchInputValue.value = next ?? ''
  }
})

const onSearchInput = (value: string | number) => {
  const stringValue = String(value)
  searchInputValue.value = stringValue
  state.value.setSearchValue(stringValue)
}

const emitChange = () => {
  emit('update:filterValues', filterValues.value)
  emit('change', { filterValues: filterValues.value })
}

const onInstanceValueChange = (instanceId: string, value: FilterValue | undefined) => {
  state.value.setInstanceValue(instanceId, value)
  emitChange()
}

const onInstanceClose = (instanceId: string) => {
  if (state.value.getInstanceValue(instanceId) === undefined) {
    state.value.removeInstance(instanceId)
    emitChange()
  }
}

const onInstanceRemove = (instanceId: string) => {
  state.value.removeInstance(instanceId)
  emitChange()
}

const onAddFilter = (fieldId: string) => {
  state.value.addFilter(fieldId)
}

const onReset = () => {
  state.value.resetAll()
  searchInputValue.value = ''
  emitChange()
  emit('reset')
}

// Emit when the debounced search value changes (search lives inside filterValues)
watch(searchValue, () => {
  emitChange()
})
</script>

<template>
  <div class="flex flex-wrap justify-between gap-2">
    <div class="flex flex-1 items-center flex-wrap gap-2">
      <!-- Start slot (renders before search input) -->
      <slot name="start" />

      <!-- Search Input -->
      <div v-if="searchField" class="relative">
        <IconLoader2
          v-if="loading"
          class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin"
        />
        <IconSearch
          v-else
          class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          :model-value="searchInputValue"
          @update:model-value="onSearchInput"
          :placeholder="searchField.placeholder ?? 'Search...'"
          :disabled="loading"
          class="h-8 w-[150px] pl-8 lg:w-[250px]"
        />
      </div>

      <!-- Filter Instances -->
      <template v-for="instance in filterInstances" :key="instance.instanceId">
        <TextFilter
          v-if="instance.field.type === 'text'"
          :title="instance.field.label"
          :placeholder="instance.field.placeholder"
          :icon="instance.field.icon"
          :default-open="instance.autoOpen"
          :open-trigger="instance.openTrigger"
          :advanced-mode="advancedMode"
          :default-operator="instance.field.defaultOperator as TextOperator"
          :available-operators="instance.field.availableOperators as TextOperator[]"
          :initial-value="state.getInstanceValue(instance.instanceId) as never"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />

        <NumberFilter
          v-else-if="instance.field.type === 'number'"
          :title="instance.field.label"
          :placeholder="instance.field.placeholder"
          :icon="instance.field.icon"
          :min="instance.field.min"
          :max="instance.field.max"
          :step="instance.field.step"
          :unit="instance.field.unit"
          :default-open="instance.autoOpen"
          :open-trigger="instance.openTrigger"
          :advanced-mode="advancedMode"
          :default-operator="instance.field.defaultOperator as NumberOperator"
          :available-operators="instance.field.availableOperators as NumberOperator[]"
          :initial-value="state.getInstanceValue(instance.instanceId) as never"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />

        <DateFilter
          v-else-if="instance.field.type === 'date'"
          :title="instance.field.label"
          :placeholder="instance.field.placeholder"
          :icon="instance.field.icon"
          :default-open="instance.autoOpen"
          :open-trigger="instance.openTrigger"
          :advanced-mode="advancedMode"
          :default-operator="instance.field.defaultOperator as DateOperator"
          :available-operators="instance.field.availableOperators as DateOperator[]"
          :initial-value="state.getInstanceValue(instance.instanceId) as never"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />

        <SelectFilter
          v-else-if="instance.field.type === 'select'"
          :title="instance.field.label"
          :placeholder="instance.field.placeholder"
          :icon="instance.field.icon"
          :options="instance.field.options ?? []"
          :default-open="instance.autoOpen"
          :open-trigger="instance.openTrigger"
          :advanced-mode="advancedMode"
          :default-operator="instance.field.defaultOperator as SelectOperator"
          :available-operators="instance.field.availableOperators as SelectOperator[]"
          :initial-value="state.getInstanceValue(instance.instanceId) as never"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />

        <BooleanFilter
          v-else-if="instance.field.type === 'boolean'"
          :title="instance.field.label"
          :icon="instance.field.icon"
          :default-open="instance.autoOpen"
          :open-trigger="instance.openTrigger"
          :advanced-mode="advancedMode"
          :default-operator="instance.field.defaultOperator as BooleanOperator"
          :available-operators="instance.field.availableOperators as BooleanOperator[]"
          :initial-value="state.getInstanceValue(instance.instanceId) as never"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />

        <MultiSelectFilter
          v-else-if="instance.field.type === 'multiselect'"
          :title="instance.field.label"
          :icon="instance.field.icon"
          :options="instance.field.options ?? []"
          :default-open="instance.autoOpen"
          :open-trigger="instance.openTrigger"
          :initial-value="state.getInstanceValue(instance.instanceId) as string[] | undefined"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />

        <RangeFilter
          v-else-if="instance.field.type === 'range'"
          :title="instance.field.label"
          :icon="instance.field.icon"
          :range="instance.field.range ?? [instance.field.min ?? 0, instance.field.max ?? 100]"
          :step="instance.field.step"
          :unit="instance.field.unit"
          :default-open="instance.autoOpen"
          :initial-value="state.getInstanceValue(instance.instanceId) as never"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />

        <DateRangeFilter
          v-else-if="instance.field.type === 'daterange'"
          :title="instance.field.label"
          :placeholder="instance.field.placeholder"
          :icon="instance.field.icon"
          :default-open="instance.autoOpen"
          :initial-value="state.getInstanceValue(instance.instanceId) as never"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />

        <component
          v-else-if="isPluginFilter(instance.field.type)"
          :is="getPlugin(instance.field.type)?.component"
          :title="instance.field.label"
          :placeholder="instance.field.placeholder"
          :icon="instance.field.icon"
          :default-open="instance.autoOpen"
          :open-trigger="instance.openTrigger"
          :advanced-mode="advancedMode"
          :default-operator="instance.field.defaultOperator"
          :available-operators="
            instance.field.availableOperators ?? getPlugin(instance.field.type)?.operators
          "
          :initial-value="state.getInstanceValue(instance.instanceId)"
          v-bind="instance.field"
          @value-change="
            (value: unknown) =>
              onInstanceValueChange(instance.instanceId, value as FilterValue | undefined)
          "
          @remove="onInstanceRemove(instance.instanceId)"
          @close="onInstanceClose(instance.instanceId)"
        />
      </template>

      <!-- Add Filter Button -->
      <DataTableFilterCommand
        v-if="fields.length > 0"
        :filter-fields="fields"
        :active-filter-count="filterInstances.length"
        :disabled="loading"
        @add-filter="onAddFilter"
      />

      <!-- Reset -->
      <Button
        v-if="isFiltered"
        variant="outline"
        size="sm"
        class="h-8"
        :disabled="loading"
        @click="onReset"
      >
        <IconX class="mr-1 h-4 w-4" />
        <span class="text-xs">Reset</span>
      </Button>
    </div>

    <div class="flex gap-2">
      <slot name="right" />
    </div>
  </div>
</template>
