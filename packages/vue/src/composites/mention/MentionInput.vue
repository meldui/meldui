<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import MentionHighlighter from './MentionHighlighter.vue'
import type { MentionInputProps } from './types'
import { MENTION_INJECTION_KEY } from './types'
import { measureCursorPosition } from './utils'

const props = defineProps<MentionInputProps & { class?: HTMLAttributes['class'] }>()

const context = inject(MENTION_INJECTION_KEY)

if (!context) {
  throw new Error('MentionInput must be used within a Mention component')
}

const {
  inputValue,
  disabled,
  readonly,
  multiline,
  placeholder,
  inputRef,
  inputId,
  labelId,
  virtualAnchor,
  open,
  handleInputChange,
  handleBackspace,
  handleKeyDown,
} = context

// Local ref for the wrapper
const wrapperRef = ref<HTMLElement | null>()

// Local ref for the actual input element
const localInputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

// Sync local ref to context
watch(
  localInputRef,
  (el) => {
    inputRef.value = el
  },
  { immediate: true },
)

// Track focus state
const isFocused = ref(false)

// Computed component type
const InputComponent = computed(() => (multiline.value ? 'textarea' : 'input'))

// Handle input event
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const newValue = target.value
  const selectionStart = target.selectionStart ?? 0

  // Update virtual anchor BEFORE handling input change (which may open popover)
  if (inputRef.value) {
    virtualAnchor.value = measureCursorPosition(inputRef.value, selectionStart)
  }

  handleInputChange(newValue, selectionStart)
}

// Handle keydown event
const onKeyDown = (event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement

  // Handle backspace for mention deletion
  if (event.key === 'Backspace') {
    const selectionStart = target.selectionStart ?? 0
    const selectionEnd = target.selectionEnd ?? 0

    if (handleBackspace(selectionStart, selectionEnd)) {
      event.preventDefault()
      return
    }
  }

  // Handle keyboard navigation when popover is open
  handleKeyDown(event)
}

// Handle focus
const onFocus = () => {
  isFocused.value = true
}

// Handle blur
const onBlur = () => {
  isFocused.value = false
  // Delay close to allow click on popover items
  setTimeout(() => {
    if (!isFocused.value) {
      context.closePopover()
    }
  }, 150)
}

// Handle click to update virtual anchor
const onClick = () => {
  if (inputRef.value) {
    const selectionStart = inputRef.value.selectionStart ?? 0
    virtualAnchor.value = measureCursorPosition(inputRef.value, selectionStart)
  }
}

// Handle selection change (cursor movement)
const onSelect = () => {
  if (inputRef.value && open.value) {
    const selectionStart = inputRef.value.selectionStart ?? 0
    virtualAnchor.value = measureCursorPosition(inputRef.value, selectionStart)

    // Re-check for trigger at new cursor position
    handleInputChange(inputValue.value, selectionStart)
  }
}

// Styles for the input - text is visible, highlighter only adds mention styling
const inputStyles = computed(() => ({
  // Text is visible in the input, highlighter overlay adds mention tag backgrounds
  background: 'transparent',
}))
</script>

<template>
  <div
    ref="wrapperRef"
    class="relative"
    data-slot="mention-input-wrapper"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :data-focused="isFocused ? '' : undefined"
  >
    <!-- Highlighter overlay -->
    <MentionHighlighter :tag-class="props.tagClass" />

    <!-- Actual input/textarea - styling classes go HERE, not on wrapper -->
    <component
      :is="InputComponent"
      :id="inputId"
      ref="localInputRef"
      :value="inputValue"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :aria-labelledby="labelId"
      :aria-expanded="open"
      :aria-autocomplete="'list'"
      :aria-haspopup="'listbox'"
      role="combobox"
      autocomplete="off"
      :style="inputStyles"
      :class="cn('mention-input-element relative z-10 w-full bg-transparent resize-none', props.class)"
      @input="onInput"
      @keydown="onKeyDown"
      @focus="onFocus"
      @blur="onBlur"
      @click="onClick"
      @select="onSelect"
    />
  </div>
</template>

<style>
/* Input text is visible - highlighter adds mention tag backgrounds behind it */
.mention-input-element {
  background: transparent;
}
</style>
