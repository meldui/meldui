import { computed, ref, watch } from 'vue'
import type {
  Mention,
  MentionItemData,
  MentionRootEmits,
  MentionRootProps,
  MentionTrigger,
  VirtualAnchor,
} from './types'
import {
  deserializeToDisplay,
  findActiveTrigger,
  getMentionAtPosition,
  serializeFromDisplay,
  updateMentionPositions,
} from './utils'

let idCounter = 0

export function useMention(props: MentionRootProps, emit: MentionRootEmits) {
  // Generate unique IDs for accessibility
  const instanceId = ++idCounter
  const inputId = `mention-input-${instanceId}`
  const labelId = `mention-label-${instanceId}`

  // Core state
  const open = ref(false)
  const inputValue = ref('')
  const mentions = ref<Mention[]>([])
  const highlightedIndex = ref(0)
  const activeTrigger = ref<string | null>(null)
  const searchQuery = ref('')
  const triggerPosition = ref(0)

  // Items state (set by MentionContent)
  const items = ref<MentionItemData[]>([])
  const loading = ref(false)

  // Refs
  const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const contentRef = ref<HTMLElement | null>(null)

  // Virtual anchor for popover positioning
  const virtualAnchor = ref<VirtualAnchor | null>(null)

  // Computed configuration
  const triggers = computed<MentionTrigger[]>(() => props.triggers ?? [{ char: '@' }])
  const disabled = computed(() => props.disabled ?? false)
  const readonly = computed(() => props.readonly ?? false)
  const multiline = computed(() => props.multiline ?? false)
  const loop = computed(() => props.loop ?? true)
  const dir = computed<'ltr' | 'rtl'>(() => props.dir ?? 'ltr')
  const placeholder = computed(() => props.placeholder ?? '')

  // Initialize from modelValue
  const initializeFromModelValue = (serialized: string) => {
    const { displayText, mentions: parsedMentions } = deserializeToDisplay(serialized)
    inputValue.value = displayText
    mentions.value = parsedMentions
  }

  // Watch for external modelValue changes
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== undefined) {
        const currentSerialized = serializeFromDisplay(inputValue.value, mentions.value)
        if (newValue !== currentSerialized) {
          initializeFromModelValue(newValue)
        }
      }
    },
    { immediate: true },
  )

  // Emit serialized value when mentions or input changes
  const emitUpdate = () => {
    const serialized = serializeFromDisplay(inputValue.value, mentions.value)
    emit('update:modelValue', serialized)
  }

  // Actions
  const openPopover = (trigger: string, query: string, position: number) => {
    open.value = true
    activeTrigger.value = trigger
    searchQuery.value = query
    triggerPosition.value = position
    highlightedIndex.value = 0
    emit('open', trigger, query)
    emit('search', trigger, query)
  }

  const closePopover = () => {
    if (open.value) {
      open.value = false
      activeTrigger.value = null
      searchQuery.value = ''
      emit('close')
    }
  }

  const updateSearchQuery = (query: string) => {
    searchQuery.value = query
    highlightedIndex.value = 0
    if (activeTrigger.value) {
      emit('search', activeTrigger.value, query)
    }
  }

  const setItems = (newItems: MentionItemData[]) => {
    items.value = newItems
    highlightedIndex.value = 0
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const setHighlightedIndex = (index: number) => {
    const enabledItems = items.value.filter((item) => !item.disabled)
    if (enabledItems.length === 0) return

    if (loop.value) {
      highlightedIndex.value =
        ((index % enabledItems.length) + enabledItems.length) % enabledItems.length
    } else {
      highlightedIndex.value = Math.max(0, Math.min(index, enabledItems.length - 1))
    }
  }

  const selectItem = (item: MentionItemData) => {
    if (item.disabled || !activeTrigger.value || triggerPosition.value < 0) return

    const trigger = activeTrigger.value
    const displayMention = `${trigger}${item.label}`

    // Calculate the end of the query (trigger position + trigger char + query length)
    const queryEnd = triggerPosition.value + 1 + searchQuery.value.length

    // Build new input value
    const before = inputValue.value.slice(0, triggerPosition.value)
    const after = inputValue.value.slice(queryEnd)
    const newValue = `${before}${displayMention} ${after}`

    // Create the new mention
    const newMention: Mention = {
      value: item.value,
      label: item.label,
      trigger,
      start: triggerPosition.value,
      end: triggerPosition.value + displayMention.length,
    }

    // Update existing mentions positions
    const delta = newValue.length - inputValue.value.length
    const updatedMentions = mentions.value.map((m) => {
      if (m.start > triggerPosition.value) {
        return {
          ...m,
          start: m.start + delta,
          end: m.end + delta,
        }
      }
      return m
    })

    // Update state
    inputValue.value = newValue
    mentions.value = [...updatedMentions, newMention]

    // Close popover
    closePopover()

    // Emit events
    emit('select', item, trigger)
    emitUpdate()

    // Set cursor position after the mention
    requestAnimationFrame(() => {
      if (inputRef.value) {
        const newCursorPos = newMention.end + 1 // +1 for the space
        inputRef.value.setSelectionRange(newCursorPos, newCursorPos)
        inputRef.value.focus()
      }
    })
  }

  const removeMention = (mention: Mention) => {
    // Remove the mention text from input
    const before = inputValue.value.slice(0, mention.start)
    const after = inputValue.value.slice(mention.end)
    inputValue.value = before + after

    // Remove the mention and update positions
    const delta = -(mention.end - mention.start)
    mentions.value = mentions.value
      .filter((m) => m !== mention)
      .map((m) => {
        if (m.start > mention.start) {
          return {
            ...m,
            start: m.start + delta,
            end: m.end + delta,
          }
        }
        return m
      })

    emit('remove', mention)
    emitUpdate()
  }

  // Handle input changes
  const handleInputChange = (newValue: string, selectionStart: number) => {
    const oldValue = inputValue.value
    const oldLength = oldValue.length
    const newLength = newValue.length

    // Detect what changed
    let changeStart = 0
    while (
      changeStart < oldLength &&
      changeStart < newLength &&
      oldValue[changeStart] === newValue[changeStart]
    ) {
      changeStart++
    }

    let changeEndOld = oldLength
    let changeEndNew = newLength
    while (
      changeEndOld > changeStart &&
      changeEndNew > changeStart &&
      oldValue[changeEndOld - 1] === newValue[changeEndNew - 1]
    ) {
      changeEndOld--
      changeEndNew--
    }

    const insertedLength = changeEndNew - changeStart

    // Update mentions positions, removing any that overlap with the change
    mentions.value = updateMentionPositions(
      mentions.value,
      changeStart,
      changeEndOld,
      insertedLength,
    )

    // Update input value
    inputValue.value = newValue

    // Check for trigger
    const result = findActiveTrigger(newValue, selectionStart, triggers.value, mentions.value)

    if (result) {
      if (
        !open.value ||
        result.trigger.char !== activeTrigger.value ||
        result.query !== searchQuery.value
      ) {
        openPopover(result.trigger.char, result.query, result.triggerPosition)
      } else {
        updateSearchQuery(result.query)
      }
    } else {
      closePopover()
    }

    emitUpdate()
  }

  // Handle backspace at mention boundary
  const handleBackspace = (selectionStart: number, selectionEnd: number): boolean => {
    // If there's a selection, let default behavior handle it
    if (selectionStart !== selectionEnd) return false

    const mentionAtCursor = getMentionAtPosition(selectionStart, mentions.value)
    if (mentionAtCursor) {
      removeMention(mentionAtCursor)
      // Set cursor to where the mention started
      requestAnimationFrame(() => {
        inputRef.value?.setSelectionRange(mentionAtCursor.start, mentionAtCursor.start)
      })
      return true // Prevent default
    }

    return false
  }

  // Keyboard navigation
  const handleKeyDown = (event: KeyboardEvent): boolean => {
    if (!open.value) return false

    const enabledItems = items.value.filter((item) => !item.disabled)
    if (enabledItems.length === 0) return false

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setHighlightedIndex(highlightedIndex.value + 1)
        return true

      case 'ArrowUp':
        event.preventDefault()
        setHighlightedIndex(highlightedIndex.value - 1)
        return true

      case 'Enter':
      case 'Tab':
        if (enabledItems[highlightedIndex.value]) {
          event.preventDefault()
          selectItem(enabledItems[highlightedIndex.value])
          return true
        }
        break

      case 'Escape':
        event.preventDefault()
        closePopover()
        return true

      case 'Home':
        event.preventDefault()
        setHighlightedIndex(0)
        return true

      case 'End':
        event.preventDefault()
        setHighlightedIndex(enabledItems.length - 1)
        return true
    }

    return false
  }

  return {
    // State
    open,
    inputValue,
    mentions,
    highlightedIndex,
    activeTrigger,
    searchQuery,
    triggerPosition,

    // Items
    items,
    loading,
    setItems,
    setLoading,

    // Configuration
    triggers,
    disabled,
    readonly,
    multiline,
    loop,
    dir,
    placeholder,

    // Actions
    selectItem,
    removeMention,
    setHighlightedIndex,
    openPopover,
    closePopover,
    updateSearchQuery,

    // Refs
    inputRef,
    contentRef,
    inputId,
    labelId,

    // Position
    virtualAnchor,

    // Handlers
    handleInputChange,
    handleBackspace,
    handleKeyDown,
    emitUpdate,
  }
}

export type UseMentionReturn = ReturnType<typeof useMention>
