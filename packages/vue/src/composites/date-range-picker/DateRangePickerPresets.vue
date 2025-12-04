<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DatePreset, DateRangePreset } from './types'

const props = defineProps<{
  presets: DatePreset[] | DateRangePreset[]
  class?: string
}>()

const emit = defineEmits<{
  select: [preset: DatePreset | DateRangePreset]
}>()

const presetsList = computed(() => props.presets)

const handlePresetClick = (preset: DatePreset | DateRangePreset) => {
  emit('select', preset)
}
</script>

<template>
  <div
    data-slot="date-range-picker-presets"
    :class="cn('flex flex-col gap-1 py-2', props.class)"
  >
    <Button
      v-for="preset in presetsList"
      :key="preset.label"
      variant="ghost"
      size="sm"
      class="w-full justify-start font-normal"
      @click="handlePresetClick(preset)"
    >
      {{ preset.label }}
    </Button>
  </div>
</template>
