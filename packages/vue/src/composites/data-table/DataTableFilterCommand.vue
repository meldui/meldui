<script setup lang="ts">
import { IconFilter } from '@meldui/tabler-vue'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getFilterIcon } from './filters/filter-icons'
import type { DataTableFilterField } from './useDataTable'

interface Props {
  filterFields: DataTableFilterField<TData>[]
  activeFilterCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  addFilter: [fieldId: string]
}>()

const isOpen = ref(false)

const handleSelectFilter = (fieldId: string) => {
  // Close the popover first
  isOpen.value = false

  // Wait for the popover to close and focus to clear before adding the filter
  setTimeout(() => {
    emit('addFilter', fieldId)
  }, 200)
}
</script>

<template>
    <Popover v-model:open="isOpen">
        <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="h-8">
                <IconFilter class="mr-2 h-4 w-4" />
                <span class="text-xs">Filter</span>
                <span
                    v-if="activeFilterCount > 0"
                    class="ml-2 rounded-sm bg-primary/20 px-1 text-xs font-medium"
                >
                    {{ activeFilterCount }}
                </span>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[200px] p-0" align="start">
            <Command>
                <CommandInput placeholder="Search filters..." />
                <CommandList>
                    <CommandEmpty>No filters found.</CommandEmpty>
                    <CommandGroup>
                        <CommandItem
                            v-for="field in filterFields"
                            :key="String(field.id)"
                            :value="String(field.id)"
                            @select="handleSelectFilter(String(field.id))"
                            class="cursor-pointer py-2"
                        >
                            <component
                                :is="getFilterIcon(field.icon, field.type)"
                                class="mr-2 h-4 w-4 text-muted-foreground"
                            />
                            <span>{{ field.label }}</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
