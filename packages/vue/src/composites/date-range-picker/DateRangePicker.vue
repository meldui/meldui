<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { DateValue } from 'reka-ui'
import { computed, ref } from 'vue'
import { Popover } from '@/components/ui/popover'
import DateRangePickerContent from './DateRangePickerContent.vue'
import DateRangePickerTrigger from './DateRangePickerTrigger.vue'
import { defaultRangePresets, defaultSinglePresets } from './presets'
import type { DatePreset, DateRange, DateRangePickerProps, DateRangePreset } from './types'

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  mode: 'range',
  showCalendar: true,
  closeOnPresetSelect: true,
  placeholder: 'Pick a date',
  locale: 'en',
})

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | DateRange | undefined]
  'preset-select': [preset: DatePreset | DateRangePreset]
}>()

const open = ref(false)

// Use vueuse's useVModel for controlled/uncontrolled pattern
const modelValue = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: props.defaultValue,
})

// Determine which presets to use
const activePresets = computed<DatePreset[] | DateRangePreset[]>(() => {
  if (props.presets) {
    return props.presets
  }
  return props.mode === 'single' ? defaultSinglePresets : defaultRangePresets
})

const handleValueUpdate = (value: DateValue | DateRange | undefined) => {
  modelValue.value = value
}

const handlePresetSelect = (preset: DatePreset | DateRangePreset) => {
  emit('preset-select', preset)
  if (props.closeOnPresetSelect) {
    open.value = false
  }
}
</script>

<template>
  <Popover v-model:open="open">
    <DateRangePickerTrigger
      :mode="mode"
      :model-value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :locale="locale"
      :class="props.class"
    />
    <DateRangePickerContent
      :mode="mode"
      :model-value="modelValue"
      :presets="activePresets"
      :show-calendar="showCalendar"
      :locale="locale"
      :min-value="minValue"
      :max-value="maxValue"
      :disabled="disabled"
      :readonly="readonly"
      :number-of-months="numberOfMonths"
      @update:model-value="handleValueUpdate"
      @preset-select="handlePresetSelect"
    />
  </Popover>
</template>
