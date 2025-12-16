<script setup lang="ts" generic="TData, TValue">
import { IconX } from '@meldui/tabler-vue'
import type { Column } from '@tanstack/vue-table'
import { type Component, computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { getFilterIcon } from './filter-icons'

interface Props {
  column?: Column<TData, TValue>
  title?: string
  range?: [number, number] // [min, max]
  step?: number
  unit?: string
  icon?: Component
  defaultOpen?: boolean

  // Initial value for URL state restoration
  initialValue?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  range: () => [0, 100],
  step: 1,
  defaultOpen: false,
})

const emit = defineEmits<{
  remove: []
  valueChange: [value: [number, number] | undefined]
  close: []
}>()

const isOpen = ref(props.defaultOpen)
const localValue = ref<[number, number]>(props.initialValue ?? props.range!)
const appliedValue = ref<[number, number] | undefined>(props.initialValue)

// Watch popover open/close to reset local value and emit close event
watch(isOpen, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    // Popover opened - reset local value to applied value or default range
    if (appliedValue.value !== undefined) {
      localValue.value = [...appliedValue.value] as [number, number]
    } else {
      localValue.value = [...props.range!] as [number, number]
    }
  } else if (oldValue && !newValue) {
    // Popover closed - reset local value to applied value or default range (discard unsaved changes)
    if (appliedValue.value !== undefined) {
      localValue.value = [...appliedValue.value] as [number, number]
    } else {
      localValue.value = [...props.range!] as [number, number]
    }
    // Emit close event
    emit('close')
  }
})

// Clamp value within bounds
const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value))
}

// Computed values for inputs (ensures proper number display)
const minValue = computed({
  get: () => localValue.value[0],
  set: (value: number) => {
    // Clamp within range bounds
    value = clamp(value, props.range![0], props.range![1])
    // Ensure min doesn't exceed max
    const newMin = Math.min(value, localValue.value[1])
    localValue.value = [newMin, localValue.value[1]]
  },
})

const maxValue = computed({
  get: () => localValue.value[1],
  set: (value: number) => {
    // Clamp within range bounds
    value = clamp(value, props.range![0], props.range![1])
    // Ensure max doesn't go below min
    const newMax = Math.max(value, localValue.value[0])
    localValue.value = [localValue.value[0], newMax]
  },
})

const isFiltered = computed(() => {
  // Filter is active if a non-default range has been applied
  return appliedValue.value !== undefined
})

const hasChanges = computed(() => {
  // Has unsaved changes if current local value differs from applied value
  if (!appliedValue.value) {
    // No applied value - check if differs from default
    return localValue.value[0] !== props.range![0] || localValue.value[1] !== props.range![1]
  }
  // Check if differs from applied value
  return (
    localValue.value[0] !== appliedValue.value[0] || localValue.value[1] !== appliedValue.value[1]
  )
})

const formatValue = (val: number) => {
  return props.unit ? `${val}${props.unit}` : val.toString()
}

const clearFilter = () => {
  localValue.value = [...props.range!] as [number, number]
  appliedValue.value = undefined
  emit('valueChange', undefined)
  emit('remove')
}

const applyFilter = () => {
  // Only set filter if it's different from the default range
  if (localValue.value[0] === props.range![0] && localValue.value[1] === props.range![1]) {
    appliedValue.value = undefined
    emit('valueChange', undefined)
  } else {
    const newValue = [...localValue.value] as [number, number]
    appliedValue.value = newValue
    emit('valueChange', newValue)
  }
  isOpen.value = false
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    applyFilter()
  } else if (event.key === 'Escape') {
    isOpen.value = false
  }
}
</script>

<template>
    <div class="flex items-center">
        <Popover v-model:open="isOpen">
            <PopoverTrigger as-child>
                <Button
                    variant="outline"
                    size="sm"
                    :class="
                        cn(
                            'h-8',
                            isFiltered && 'rounded-r-none border-r-0',
                        )
                    "
                    :aria-label="`Filter by ${title || 'range'}`"
                >
                    <!-- Icon on the left -->
                    <component
                        :is="getFilterIcon(icon, 'range')"
                        class="mr-2 h-4 w-4 shrink-0"
                    />

                    <!-- Title | Selected Range -->
                    <span class="text-xs">
                        {{ title || "Range" }}
                        <template v-if="isFiltered && appliedValue">
                            <span class="mx-1.5 text-muted-foreground">|</span>
                            <span class="font-normal">
                                {{ formatValue(appliedValue[0]) }} -
                                {{ formatValue(appliedValue[1]) }}
                            </span>
                        </template>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                class="w-[280px]"
                align="start"
                @keydown="handleKeyDown"
            >
                <div class="space-y-4">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between text-sm">
                            <span class="font-medium">{{
                                title || "Range"
                            }}</span>
                            <span class="text-muted-foreground">
                                {{ formatValue(localValue[0]) }} -
                                {{ formatValue(localValue[1]) }}
                            </span>
                        </div>
                        <!-- Number inputs for direct entry -->
                        <div class="flex items-center gap-2">
                            <div class="flex-1 space-y-1">
                                <div class="relative">
                                    <Input
                                        v-model.number="minValue"
                                        type="number"
                                        :min="range[0]"
                                        :max="range[1]"
                                        :step="step"
                                        class="h-8 text-sm pr-8"
                                    />
                                    <span
                                        v-if="unit"
                                        class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none"
                                    >
                                        {{ unit }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex-1 space-y-1">
                                <div class="relative">
                                    <Input
                                        v-model.number="maxValue"
                                        type="number"
                                        :min="range[0]"
                                        :max="range[1]"
                                        :step="step"
                                        class="h-8 text-sm pr-8"
                                    />
                                    <span
                                        v-if="unit"
                                        class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none"
                                    >
                                        {{ unit }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Slider -->
                        <div class="space-y-2">
                            <Slider
                                v-model="localValue"
                                :min="range[0]"
                                :max="range[1]"
                                :step="step"
                                class="w-full"
                            />
                        </div>
                    </div>
                    <div
                        class="flex items-center justify-between text-xs text-muted-foreground"
                    >
                        <span>{{ formatValue(range[0]) }}</span>
                        <span>{{ formatValue(range[1]) }}</span>
                    </div>
                    <Button
                        v-if="hasChanges"
                        size="sm"
                        class="w-full h-7 text-xs"
                        @click="applyFilter"
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>

        <!-- Clear button - shows when filtered, appears as part of single button -->
        <Button
            v-if="isFiltered"
            variant="outline"
            size="sm"
            class="h-8 w-8 p-0 rounded-l-none border-l-0"
            @click="clearFilter"
        >
            <IconX class="h-4 w-4" />
            <span class="sr-only">Clear filter</span>
        </Button>
    </div>
</template>
