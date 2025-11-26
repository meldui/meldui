<script setup lang="ts">
import { provide, toRefs } from 'vue'
import type { MentionRootEmits, MentionRootProps } from './types'
import { MENTION_INJECTION_KEY } from './types'
import { useMention } from './useMention'

const props = withDefaults(defineProps<MentionRootProps>(), {
  modelValue: '',
  triggers: () => [{ char: '@' }],
  disabled: false,
  readonly: false,
  placeholder: '',
  multiline: false,
  loop: true,
  dir: 'ltr',
})

const emit = defineEmits<MentionRootEmits>()

const mention = useMention(props, emit)

// Provide context to children
provide(MENTION_INJECTION_KEY, {
  // State
  open: mention.open,
  inputValue: mention.inputValue,
  mentions: mention.mentions,
  highlightedIndex: mention.highlightedIndex,
  activeTrigger: mention.activeTrigger,
  searchQuery: mention.searchQuery,

  // Configuration
  triggers: mention.triggers,
  disabled: mention.disabled,
  readonly: mention.readonly,
  multiline: mention.multiline,
  loop: mention.loop,
  dir: mention.dir,
  placeholder: mention.placeholder,

  // Items
  items: mention.items,
  setItems: mention.setItems,
  loading: mention.loading,
  setLoading: mention.setLoading,

  // Actions
  selectItem: mention.selectItem,
  removeMention: mention.removeMention,
  setHighlightedIndex: mention.setHighlightedIndex,
  openPopover: mention.openPopover,
  closePopover: mention.closePopover,
  updateSearchQuery: mention.updateSearchQuery,

  // Input handlers
  handleInputChange: mention.handleInputChange,
  handleBackspace: mention.handleBackspace,
  handleKeyDown: mention.handleKeyDown,

  // Refs
  inputRef: mention.inputRef,
  contentRef: mention.contentRef,
  inputId: mention.inputId,
  labelId: mention.labelId,

  // Position
  virtualAnchor: mention.virtualAnchor,
  triggerPosition: mention.triggerPosition,
})

// Expose for advanced use cases
defineExpose({
  ...toRefs(mention),
})
</script>

<template>
  <div
    data-slot="mention"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :dir="dir"
  >
    <slot />
  </div>
</template>
