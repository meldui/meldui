<script setup lang="ts">
import { computed } from 'vue'
import { CommandEmpty, useCommand } from '@/components/ui/command'
import type { MultiSelectOption } from './index'

const props = defineProps<{
  normalizedOptions: MultiSelectOption[]
  selectedValues: string[]
  emptyText: string
  createLabel: (value: string) => string
}>()

const emit = defineEmits<(e: 'create', value: string) => void>()

const { filterState } = useCommand()

const showCreateOption = computed(() => {
  const searchValue = filterState.search
  if (!searchValue) return false

  const trimmedValue = searchValue.trim()
  if (!trimmedValue) return false

  // Don't show if already selected
  if (props.selectedValues.includes(trimmedValue)) {
    return false
  }

  // Don't show if already exists in options (case-insensitive check on both value and label)
  const lowerSearch = trimmedValue.toLowerCase()
  return !props.normalizedOptions.some(
    (opt) => opt.value.toLowerCase() === lowerSearch || opt.label.toLowerCase() === lowerSearch,
  )
})

const handleCreate = () => {
  emit('create', filterState.search)
  // Clear the search after creating
  filterState.search = ''
}
</script>

<template>
  <div
    v-if="showCreateOption"
    class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-accent hover:text-accent-foreground"
    @click="handleCreate"
  >
    {{ createLabel(filterState.search) }}
  </div>
  <CommandEmpty v-else>
    {{ emptyText }}
  </CommandEmpty>
</template>
