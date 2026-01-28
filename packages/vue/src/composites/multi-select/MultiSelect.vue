<script setup lang="ts">
import { IconCheck, IconChevronDown, IconX } from '@meldui/tabler-vue'
import { computed, ref, watch } from 'vue'
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
import MultiSelectCreateOption from '@/composites/multi-select/MultiSelectCreateOption.vue'
import { cn } from '@/lib/utils'
import type { MultiSelectEmits, MultiSelectOption, MultiSelectProps } from './index'

const props = withDefaults(defineProps<MultiSelectProps>(), {
  modelValue: () => [],
  placeholder: 'Select items...',
  searchPlaceholder: 'Search...',
  emptyText: 'No results found',
  disabled: false,
  creatable: false,
  createLabel: (value: string) => `Create "${value}"`,
})

const emit = defineEmits<MultiSelectEmits>()

const open = ref(false)

// Watch for popover close to reset search
watch(open, (isOpen) => {
  if (!isOpen) {
    // Command will reset internally
  }
})

// Normalize options to consistent format
const normalizedOptions = computed(() => {
  const result: MultiSelectOption[] = []

  if (props.options) {
    props.options.forEach((opt) => {
      if (typeof opt === 'string') {
        result.push({ value: opt, label: opt })
      } else {
        result.push(opt)
      }
    })
  }

  if (props.groups) {
    props.groups.forEach((group) => {
      group.options.forEach((opt) => {
        if (typeof opt === 'string') {
          result.push({ value: opt, label: opt })
        } else {
          result.push(opt)
        }
      })
    })
  }

  return result
})

// Get label for a value
const getLabel = (value: string): string => {
  const option = normalizedOptions.value.find((opt) => opt.value === value)
  return option?.label ?? value
}

// Check if value is selected
const isSelected = (value: string): boolean => {
  return props.modelValue?.includes(value) ?? false
}

// Toggle selection
const toggleSelection = (value: string) => {
  const currentValues = props.modelValue ?? []

  if (isSelected(value)) {
    emit(
      'update:modelValue',
      currentValues.filter((v) => v !== value),
    )
  } else {
    // Check max limit
    if (props.max !== undefined && currentValues.length >= props.max) {
      return
    }
    emit('update:modelValue', [...currentValues, value])
  }
}

// Remove a value
const removeValue = (value: string) => {
  const currentValues = props.modelValue ?? []
  emit(
    'update:modelValue',
    currentValues.filter((v) => v !== value),
  )
}

// Clear all selections
const clearAll = () => {
  emit('update:modelValue', [])
}

// Create new option
const handleCreateOption = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed || !props.creatable) return

  // Check if already selected (prevent duplicates)
  if (props.modelValue?.includes(trimmed)) {
    return
  }

  // Check if exists in predefined options - if so, toggle it
  if (normalizedOptions.value.some((opt) => opt.value === trimmed)) {
    toggleSelection(trimmed)
  } else {
    // Add as new value
    if (props.max !== undefined && (props.modelValue?.length ?? 0) >= props.max) {
      return
    }
    emit('update:modelValue', [...(props.modelValue ?? []), trimmed])
  }
}

// Visible badges
const visibleBadges = computed(() => {
  const values = props.modelValue ?? []
  if (props.maxDisplay !== undefined && values.length > props.maxDisplay) {
    return values.slice(0, props.maxDisplay)
  }
  return values
})

// Remaining count
const remainingCount = computed(() => {
  const values = props.modelValue ?? []
  if (props.maxDisplay !== undefined && values.length > props.maxDisplay) {
    return values.length - props.maxDisplay
  }
  return 0
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled"
        :class="
          cn(
            'w-full justify-between font-normal h-auto min-h-9 py-1.5',
            !modelValue?.length && 'text-muted-foreground',
          )
        "
      >
        <div class="flex flex-wrap gap-1.5 flex-1 items-center">
          <template v-if="modelValue?.length">
            <Badge
              v-for="value in visibleBadges"
              :key="value"
              variant="secondary"
              class="gap-1 pr-1"
            >
              <span>{{ getLabel(value) }}</span>
              <button
                type="button"
                class="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                @click.stop="removeValue(value)"
              >
                <IconX class="size-3" />
              </button>
            </Badge>
            <Badge v-if="remainingCount > 0" variant="secondary">
              +{{ remainingCount }} more
            </Badge>
          </template>
          <span v-else>{{ placeholder }}</span>
        </div>
        <IconChevronDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0" align="start">
      <Command>
        <CommandInput :placeholder="searchPlaceholder" />
        <CommandList>
          <!-- Create option - uses child component to access Command context -->
          <MultiSelectCreateOption
            v-if="creatable"
            :normalized-options="normalizedOptions"
            :selected-values="modelValue ?? []"
            :empty-text="emptyText"
            :create-label="createLabel"
            @create="handleCreateOption"
          />

          <CommandEmpty v-else>
            {{ emptyText }}
          </CommandEmpty>

          <!-- Simple options -->
          <CommandGroup v-if="options && !groups">
            <CommandItem
              v-for="option in options"
              :key="typeof option === 'string' ? option : option.value"
              :value="typeof option === 'string' ? option : option.value"
              :disabled="typeof option === 'string' ? false : option.disabled"
              @select="() => toggleSelection(typeof option === 'string' ? option : option.value)"
            >
              <IconCheck
                :class="
                  cn(
                    'mr-2 size-4',
                    isSelected(typeof option === 'string' ? option : option.value)
                      ? 'opacity-100'
                      : 'opacity-0',
                  )
                "
              />
              {{ typeof option === 'string' ? option : option.label }}
            </CommandItem>
          </CommandGroup>

          <!-- Grouped options -->
          <template v-if="groups">
            <template v-for="(group, index) in groups" :key="group.label">
              <CommandSeparator v-if="index > 0" />
              <CommandGroup :heading="group.label">
                <CommandItem
                  v-for="option in group.options"
                  :key="typeof option === 'string' ? option : option.value"
                  :value="typeof option === 'string' ? option : option.value"
                  :disabled="typeof option === 'string' ? false : option.disabled"
                  @select="
                    () => toggleSelection(typeof option === 'string' ? option : option.value)
                  "
                >
                  <IconCheck
                    :class="
                      cn(
                        'mr-2 size-4',
                        isSelected(typeof option === 'string' ? option : option.value)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )
                    "
                  />
                  {{ typeof option === 'string' ? option : option.label }}
                </CommandItem>
              </CommandGroup>
            </template>
          </template>
        </CommandList>
      </Command>

      <!-- Footer with clear button -->
      <div v-if="modelValue?.length" class="flex items-center justify-between p-2 border-t">
        <span class="text-xs text-muted-foreground">
          {{ modelValue.length }}
          {{ modelValue.length === 1 ? 'item' : 'items' }} selected
          <template v-if="max"> (max {{ max }}) </template>
        </span>
        <Button size="sm" variant="ghost" @click="clearAll"> Clear all </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
