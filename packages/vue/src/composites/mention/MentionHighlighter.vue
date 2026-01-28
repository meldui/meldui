<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import type { MentionHighlighterProps } from './types'
import { MENTION_INJECTION_KEY } from './types'

const props = defineProps<MentionHighlighterProps & { class?: HTMLAttributes['class'] }>()

const context = inject(MENTION_INJECTION_KEY)

if (!context) {
  throw new Error('MentionHighlighter must be used within a Mention component')
}

const { inputValue, mentions, inputRef, multiline } = context

// Ref for the highlighter element
const highlighterRef = ref<HTMLElement | null>(null)

// Generate segments for rendering
const segments = computed(() => {
  const text = inputValue.value
  const sortedMentions = [...mentions.value].toSorted((a, b) => a.start - b.start)

  const result: Array<{
    type: 'text' | 'mention'
    content: string
    trigger?: string
    key: string
  }> = []
  let lastIndex = 0

  for (const mention of sortedMentions) {
    // Add text before mention
    if (mention.start > lastIndex) {
      result.push({
        type: 'text',
        content: text.slice(lastIndex, mention.start),
        key: `text-${lastIndex}`,
      })
    }

    // Add mention
    result.push({
      type: 'mention',
      content: text.slice(mention.start, mention.end),
      trigger: mention.trigger,
      key: `mention-${mention.start}`,
    })

    lastIndex = mention.end
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      type: 'text',
      content: text.slice(lastIndex),
      key: `text-${lastIndex}`,
    })
  }

  // If empty, add a placeholder space to maintain height
  if (result.length === 0) {
    result.push({
      type: 'text',
      content: '\u200B', // Zero-width space
      key: 'empty',
    })
  }

  return result
})

// Sync styles from input - apply directly to element for reliability
const syncStyles = () => {
  const input = inputRef.value
  const highlighter = highlighterRef.value
  if (!input || !highlighter) return

  const cs = getComputedStyle(input)

  // Apply all styles directly to the element - match DiceUI's approach
  highlighter.style.position = 'absolute'
  highlighter.style.inset = '0'
  highlighter.style.color = 'transparent' // Text is transparent, only [data-tag] spans are visible
  highlighter.style.whiteSpace = 'pre-wrap'
  highlighter.style.overflowWrap = 'break-word'
  highlighter.style.pointerEvents = 'none'
  highlighter.style.userSelect = 'none'
  highlighter.style.overflow = 'hidden'
  highlighter.style.width = '100%'
  highlighter.style.wordBreak = 'normal'
  highlighter.style.direction = cs.direction

  // Copy font styles exactly
  highlighter.style.fontStyle = cs.fontStyle
  highlighter.style.fontVariant = cs.fontVariant
  highlighter.style.fontWeight = cs.fontWeight
  highlighter.style.fontSize = cs.fontSize
  highlighter.style.lineHeight = cs.lineHeight
  highlighter.style.fontFamily = cs.fontFamily
  highlighter.style.letterSpacing = cs.letterSpacing
  highlighter.style.textTransform = cs.textTransform
  highlighter.style.textIndent = cs.textIndent

  // Copy spacing - padding and border (critical for alignment)
  highlighter.style.padding = cs.padding
  highlighter.style.borderWidth = cs.borderWidth
  highlighter.style.borderStyle = 'solid'
  highlighter.style.borderColor = 'currentcolor' // Same as DiceUI
  highlighter.style.borderRadius = cs.borderRadius
  highlighter.style.boxSizing = cs.boxSizing

  // Sync height
  highlighter.style.height = `${input.offsetHeight}px`
}

// Sync scroll position
const syncScroll = () => {
  if (!inputRef.value || !highlighterRef.value) return

  highlighterRef.value.scrollTop = inputRef.value.scrollTop
  highlighterRef.value.scrollLeft = inputRef.value.scrollLeft
}

// Set up observers
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

const setupObservers = () => {
  if (!inputRef.value || !highlighterRef.value) return

  // Clean up previous observers
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  inputRef.value?.removeEventListener('scroll', syncScroll)

  // Initial sync
  syncStyles()

  // Resize observer
  resizeObserver = new ResizeObserver(syncStyles)
  resizeObserver.observe(inputRef.value)

  // Mutation observer for style changes
  mutationObserver = new MutationObserver(syncStyles)
  mutationObserver.observe(inputRef.value, {
    attributes: true,
    attributeFilter: ['style', 'class'],
  })

  // Scroll sync
  inputRef.value.addEventListener('scroll', syncScroll)
}

onMounted(() => {
  nextTick(setupObservers)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  inputRef.value?.removeEventListener('scroll', syncScroll)
})

// Watch for inputRef to become available (it's set after MentionInput mounts)
watch(
  inputRef,
  (newRef) => {
    if (newRef && highlighterRef.value) {
      nextTick(setupObservers)
    }
  },
  { immediate: true },
)

// Watch for highlighterRef
watch(highlighterRef, (newRef) => {
  if (newRef && inputRef.value) {
    nextTick(setupObservers)
  }
})

// Re-sync when input value changes (in case of content-based sizing)
watch(inputValue, () => {
  nextTick(syncStyles)
})
</script>

<template>
  <div
    ref="highlighterRef"
    :class="props.class"
    data-slot="mention-highlighter"
    aria-hidden="true"
    dir="ltr"
  >
    <template v-for="segment in segments" :key="segment.key">
      <span
        v-if="segment.type === 'mention'"
        :class="cn('bg-primary/15 rounded', props.tagClass)"
        data-tag
        :data-trigger="segment.trigger"
        >{{ segment.content }}</span
      >
      <span v-else>{{ segment.content }}</span>
    </template>
    <!-- Trailing space to match input behavior -->
    <span>&nbsp;</span>
  </div>
</template>
