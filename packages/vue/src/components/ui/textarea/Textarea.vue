<script setup lang="ts">
import { useTextareaAutosize, useVModel } from '@vueuse/core'
import type { HTMLAttributes } from 'vue'
import { computed, nextTick, ref, toRef, useAttrs, watch } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    defaultValue?: string | number
    modelValue?: string | number
    autosize?: boolean
    maxHeight?: string
  }>(),
  {
    autosize: false,
  },
)

const emits = defineEmits<(e: 'update:modelValue', payload: string | number) => void>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const textareaRef = ref<HTMLTextAreaElement>()

// Only enable autosize composable when autosize prop is true
const autosizeElement = computed(() => (props.autosize ? textareaRef.value : undefined))

// Parse maxHeight to pixels for comparison
const maxHeightPx = computed(() => {
  if (!props.maxHeight) return undefined
  const match = props.maxHeight.match(/^(\d+(?:\.\d+)?)(px)?$/)
  return match ? Number.parseFloat(match[1]) : undefined
})

// styleProp must be a plain value (not reactive) - useTextareaAutosize sets this once
// Use 'minHeight' to allow the textarea to grow naturally
const { triggerResize } = useTextareaAutosize({
  element: autosizeElement,
  input: toRef(() => (props.autosize ? String(modelValue.value ?? '') : '')),
  styleProp: 'minHeight',
})

// Cap minHeight at maxHeight after each input change
// This prevents min-height from overriding max-height in CSS
watch(
  () => modelValue.value,
  () => {
    if (textareaRef.value && maxHeightPx.value !== undefined && props.autosize) {
      // Use nextTick to ensure useTextareaAutosize has updated the style first
      nextTick(() => {
        if (textareaRef.value) {
          const currentMinHeight = Number.parseFloat(textareaRef.value.style.minHeight)
          if (currentMinHeight > maxHeightPx.value!) {
            textareaRef.value.style.minHeight = `${maxHeightPx.value}px`
          }
        }
      })
    }
  },
)

watch(
  () => props.autosize,
  (enabled) => {
    if (enabled) {
      triggerResize()
    } else if (textareaRef.value) {
      // Clear any inline styles when autosize is disabled
      textareaRef.value.style.minHeight = ''
      textareaRef.value.style.height = ''
    }
  },
)

const textareaStyle = computed(() => {
  if (props.autosize && props.maxHeight) {
    return { maxHeight: props.maxHeight, overflowY: 'auto' as const }
  }
  if (props.autosize) {
    // No maxHeight - hide overflow since textarea will always expand to fit
    return { overflowY: 'hidden' as const }
  }
  return undefined
})
</script>

<template>
  <textarea
    ref="textareaRef"
    v-model="modelValue"
    v-bind="attrs"
    data-slot="textarea"
    :style="textareaStyle"
    :class="cn('custom-scrollbar border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', props.class)"
  />
</template>
