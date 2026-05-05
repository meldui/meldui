<script setup lang="ts" generic="TData, TValue">
import { IconCheck, IconX } from '@meldui/tabler-vue'
import type { Column } from '@tanstack/vue-table'
import { type Component, computed, ref, watch } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { FilterOption } from '../types'
import { getFilterIcon } from './filter-icons'

interface Props {
  column?: Column<TData, TValue>
  title?: string
  options: FilterOption[]
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number
  initialValue?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
  openTrigger: 0,
})

const emit = defineEmits<{
  remove: []
  close: []
  valueChange: [value: string[] | undefined]
}>()

const isOpen = ref(props.defaultOpen)

const appliedValue = ref<string[] | undefined>(
  props.initialValue && props.initialValue.length > 0 ? [...props.initialValue] : undefined,
)

watch(
  () => props.openTrigger,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      isOpen.value = true
    }
  },
)

watch(isOpen, (newValue, oldValue) => {
  if (oldValue && !newValue) {
    emit('close')
  }
})

const selectedValues = computed(() => new Set(appliedValue.value ?? []))

const isFiltered = computed(() => selectedValues.value.size > 0)

const handleSelect = (value: string) => {
  const next = new Set(appliedValue.value ?? [])
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }
  const arr = Array.from(next)
  const newValue = arr.length ? arr : undefined
  appliedValue.value = newValue
  emit('valueChange', newValue)
}

const clearFilters = () => {
  appliedValue.value = undefined
  emit('valueChange', undefined)
  emit('remove')
}
</script>

<template>
  <div class="flex items-center">
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          :class="cn('h-8', isFiltered && 'rounded-r-none border-r-0')"
          :aria-label="`Filter by ${title || 'options'}`"
        >
          <!-- Icon on the left -->
          <component :is="getFilterIcon(icon, 'multiselect')" class="mr-2 h-4 w-4 shrink-0" />

          <!-- Title -->
          <span class="text-xs">{{ title || 'Filter' }}</span>

          <!-- Selected values as badges/pills -->
          <template v-if="isFiltered">
            <span class="mx-1.5 text-muted-foreground">|</span>
            <Badge
              v-if="selectedValues.size > 2"
              variant="secondary"
              class="rounded-sm px-1 font-normal text-xs"
            >
              {{ selectedValues.size }} selected
            </Badge>
            <template v-else>
              <Badge
                v-for="option in options.filter((option) => selectedValues.has(option.value))"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal text-xs mr-1 last:mr-0"
              >
                {{ option.label }}
              </Badge>
            </template>
          </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[200px] p-0 text-sm" align="start">
        <Command>
          <CommandInput :placeholder="title" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                @select="handleSelect(option.value)"
                class="py-2"
              >
                <div
                  :class="
                    cn(
                      'mr-2 flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-xs',
                      selectedValues.has(option.value)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input',
                    )
                  "
                >
                  <IconCheck v-if="selectedValues.has(option.value)" class="size-3.5" />
                </div>
                <component
                  v-if="option.icon"
                  :is="option.icon"
                  class="mr-2 h-4 w-4 text-muted-foreground"
                />
                <span>{{ option.label }}</span>
              </CommandItem>
            </CommandGroup>
            <!-- Clear button inside popover -->
            <template v-if="isFiltered">
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  :value="`clear-${title}`"
                  @select="clearFilters"
                  class="cursor-pointer py-2"
                >
                  <IconX class="h-4 w-4" />
                  Clear filters
                </CommandItem>
              </CommandGroup>
            </template>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <!-- Clear button - shows when filtered, appears as part of single button -->
    <Button
      v-if="isFiltered"
      variant="outline"
      size="sm"
      class="h-8 w-8 p-0 rounded-l-none border-l-0"
      @click="clearFilters"
    >
      <IconX class="h-4 w-4" />
      <span class="sr-only">Clear filters</span>
    </Button>
  </div>
</template>
