import type { Ref } from 'vue'

/**
 * Configuration for a mention trigger character
 */
export interface MentionTrigger {
  /** Character that activates this trigger (e.g., '@', '#', '/') */
  char: string

  /** Allow spaces in the search query */
  allowSpaces?: boolean

  /** Custom regex pattern for matching (advanced) */
  pattern?: RegExp
}

/**
 * Data for a selectable mention item
 */
export interface MentionItemData {
  /** Unique value for this item */
  value: string

  /** Display label */
  label: string

  /** Whether item is disabled */
  disabled?: boolean

  /** Any additional data for custom rendering */
  [key: string]: unknown
}

/**
 * A mention that has been inserted into the text
 */
export interface Mention {
  /** Unique identifier/value */
  value: string

  /** Display label */
  label: string

  /** Trigger character used */
  trigger: string

  /** Start position in display text */
  start: number

  /** End position in display text */
  end: number
}

/**
 * Props for the root Mention component
 */
export interface MentionRootProps {
  /** v-model binding - serialized value with mention markers */
  modelValue?: string

  /** Trigger configurations */
  triggers?: MentionTrigger[]

  /** Disable all interactions */
  disabled?: boolean

  /** Read-only mode (can view but not edit) */
  readonly?: boolean

  /** Placeholder text */
  placeholder?: string

  /** Use textarea instead of input */
  multiline?: boolean

  /** Enable keyboard navigation looping */
  loop?: boolean

  /** Direction for RTL support */
  dir?: 'ltr' | 'rtl'
}

/**
 * Emits for the root Mention component
 */
export interface MentionRootEmits {
  /** Serialized value changed */
  (e: 'update:modelValue', value: string): void

  /** Popover opened (trigger detected) */
  (e: 'open', trigger: string, query: string): void

  /** Popover closed */
  (e: 'close'): void

  /** Search query changed */
  (e: 'search', trigger: string, query: string): void

  /** Mention selected */
  (e: 'select', item: MentionItemData, trigger: string): void

  /** Mention removed */
  (e: 'remove', mention: Mention): void
}

/**
 * Context provided by the root Mention component
 */
export interface MentionContext {
  // State
  open: Ref<boolean>
  inputValue: Ref<string>
  mentions: Ref<Mention[]>
  highlightedIndex: Ref<number>
  activeTrigger: Ref<string | null>
  searchQuery: Ref<string>

  // Configuration
  triggers: Ref<MentionTrigger[]>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  multiline: Ref<boolean>
  loop: Ref<boolean>
  dir: Ref<'ltr' | 'rtl'>
  placeholder: Ref<string>

  // Items (set by consumer via MentionContent)
  items: Ref<MentionItemData[]>
  setItems: (items: MentionItemData[]) => void
  loading: Ref<boolean>
  setLoading: (loading: boolean) => void

  // Actions
  selectItem: (item: MentionItemData) => void
  removeMention: (mention: Mention) => void
  setHighlightedIndex: (index: number) => void
  openPopover: (trigger: string, query: string, position: number) => void
  closePopover: () => void
  updateSearchQuery: (query: string) => void

  // Input handlers (used by MentionInput)
  handleInputChange: (newValue: string, selectionStart: number) => void
  handleBackspace: (selectionStart: number, selectionEnd: number) => boolean
  handleKeyDown: (event: KeyboardEvent) => boolean

  // Refs
  inputRef: Ref<HTMLInputElement | HTMLTextAreaElement | null>
  contentRef: Ref<HTMLElement | null>
  inputId: string
  labelId: string

  // Position (for popover placement)
  virtualAnchor: Ref<VirtualAnchor | null>
  triggerPosition: Ref<number>
}

/**
 * Virtual anchor for Floating UI positioning
 */
export interface VirtualAnchor {
  getBoundingClientRect: () => DOMRect
}

/**
 * Props for MentionInput component
 */
export interface MentionInputProps {
  /** Custom CSS class */
  class?: string

  /** CSS class for mention tag highlights */
  tagClass?: string
}

/**
 * Props for MentionHighlighter component
 */
export interface MentionHighlighterProps {
  /** Custom CSS class */
  class?: string

  /** CSS class for mention tag highlights */
  tagClass?: string
}

/**
 * Props for MentionPortal component
 */
export interface MentionPortalProps {
  /** Target container for teleport */
  to?: string | HTMLElement

  /** Disable teleporting */
  disabled?: boolean
}

/**
 * Props for MentionContent component
 */
export interface MentionContentProps {
  /** Items to display in the popover */
  items?: MentionItemData[]

  /** Whether items are loading */
  loading?: boolean

  /** Side of the anchor to render */
  side?: 'top' | 'bottom'

  /** Offset from anchor */
  sideOffset?: number

  /** Alignment relative to anchor */
  align?: 'start' | 'center' | 'end'

  /** Avoid collisions with viewport */
  avoidCollisions?: boolean

  /** Custom CSS class */
  class?: string
}

/**
 * Props for MentionItem component
 */
export interface MentionItemProps {
  /** Item data */
  item: MentionItemData

  /** Custom CSS class */
  class?: string
}

/**
 * Slot props for MentionItem
 */
export interface MentionItemSlotProps {
  item: MentionItemData
  highlighted: boolean
  disabled: boolean
  select: () => void
}

/**
 * Props for MentionEmpty component
 */
export interface MentionEmptyProps {
  /** Custom CSS class */
  class?: string
}

/**
 * Props for MentionLoading component
 */
export interface MentionLoadingProps {
  /** Custom CSS class */
  class?: string
}

/**
 * Props for MentionLabel component
 */
export interface MentionLabelProps {
  /** Custom CSS class */
  class?: string
}

/**
 * Context key for provide/inject
 */
export const MENTION_INJECTION_KEY = Symbol('mention-context') as InjectionKey<MentionContext>

/**
 * Context for MentionItem (provided by MentionContent)
 */
export interface MentionItemContext {
  index: number
}

export const MENTION_ITEM_INJECTION_KEY = Symbol(
  'mention-item-context',
) as InjectionKey<MentionItemContext>

import type { InjectionKey } from 'vue'
