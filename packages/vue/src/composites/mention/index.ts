// Components
export { default as Mention } from './Mention.vue'
export { default as MentionContent } from './MentionContent.vue'
export { default as MentionEmpty } from './MentionEmpty.vue'
export { default as MentionHighlighter } from './MentionHighlighter.vue'
export { default as MentionInput } from './MentionInput.vue'
export { default as MentionItem } from './MentionItem.vue'
export { default as MentionLabel } from './MentionLabel.vue'
export { default as MentionLoading } from './MentionLoading.vue'
export { default as MentionPortal } from './MentionPortal.vue'

// Types
export type {
  Mention as MentionData,
  MentionContentProps,
  MentionContext,
  MentionEmptyProps,
  MentionHighlighterProps,
  MentionInputProps,
  MentionItemData,
  MentionItemProps,
  MentionItemSlotProps,
  MentionLabelProps,
  MentionLoadingProps,
  MentionPortalProps,
  MentionRootEmits,
  MentionRootProps,
  MentionTrigger,
} from './types'
// Composable
export { useMention } from './useMention'
// Utilities
export {
  defaultFilter,
  deserializeToDisplay,
  normalizeText,
  parseMentionsFromSerialized,
  serializeFromDisplay,
  serializeMention,
} from './utils'
