import type { Mention, MentionTrigger, VirtualAnchor } from './types'

/**
 * Regex to match serialized mentions: @[value:label] or #[value:label] etc.
 * Captures: [1] trigger, [2] value, [3] label
 */
const MENTION_REGEX = /([#@/\\])\[([^\]:]+):([^\]]+)\]/g

/**
 * Serialize a mention into the marker format
 */
export function serializeMention(trigger: string, value: string, label: string): string {
  return `${trigger}[${value}:${label}]`
}

/**
 * Parse mentions from serialized text
 */
export function parseMentionsFromSerialized(text: string): Mention[] {
  const mentions: Mention[] = []

  // Reset regex lastIndex
  MENTION_REGEX.lastIndex = 0

  let match = MENTION_REGEX.exec(text)
  while (match !== null) {
    mentions.push({
      trigger: match[1],
      value: match[2],
      label: match[3],
      start: match.index,
      end: match.index + match[0].length,
    })
    match = MENTION_REGEX.exec(text)
  }

  return mentions
}

/**
 * Convert serialized text to display text (replacing markers with trigger+label)
 * Also returns updated mention positions for the display text
 */
export function deserializeToDisplay(serialized: string): {
  displayText: string
  mentions: Mention[]
} {
  const mentions: Mention[] = []
  let displayText = ''
  let lastIndex = 0

  // Reset regex lastIndex
  MENTION_REGEX.lastIndex = 0

  let match = MENTION_REGEX.exec(serialized)
  while (match !== null) {
    const trigger = match[1]
    const value = match[2]
    const label = match[3]
    const displayMention = `${trigger}${label}`

    // Add text before this mention
    displayText += serialized.slice(lastIndex, match.index)

    // Calculate position in display text
    const displayStart = displayText.length
    displayText += displayMention
    const displayEnd = displayText.length

    mentions.push({
      trigger,
      value,
      label,
      start: displayStart,
      end: displayEnd,
    })

    lastIndex = match.index + match[0].length
    match = MENTION_REGEX.exec(serialized)
  }

  // Add remaining text
  displayText += serialized.slice(lastIndex)

  return { displayText, mentions }
}

/**
 * Convert display text back to serialized format using mention positions
 */
export function serializeFromDisplay(displayText: string, mentions: Mention[]): string {
  if (mentions.length === 0) return displayText

  // Sort mentions by position (descending) to replace from end to start
  const sortedMentions = [...mentions].toSorted((a, b) => b.start - a.start)

  let serialized = displayText
  for (const mention of sortedMentions) {
    const before = serialized.slice(0, mention.start)
    const after = serialized.slice(mention.end)
    const marker = serializeMention(mention.trigger, mention.value, mention.label)
    serialized = before + marker + after
  }

  return serialized
}

/**
 * Find the active trigger in text at a given cursor position
 */
export function findActiveTrigger(
  text: string,
  cursorPosition: number,
  triggers: MentionTrigger[],
  mentions: Mention[],
): { trigger: MentionTrigger; query: string; triggerPosition: number } | null {
  // Search backwards from cursor to find a trigger
  for (let i = cursorPosition - 1; i >= 0; i--) {
    const char = text[i]

    // Check if this is a trigger character
    const triggerConfig = triggers.find((t) => t.char === char)
    if (!triggerConfig) continue

    // Check if this position is inside an existing mention
    const isInsideMention = mentions.some((m) => i >= m.start && i < m.end)
    if (isInsideMention) continue

    // Check if trigger is at start or preceded by whitespace
    if (i > 0 && !/\s/.test(text[i - 1])) continue

    // Extract query (text between trigger and cursor)
    const query = text.slice(i + 1, cursorPosition)

    // If spaces not allowed and query contains space, no active trigger
    if (!triggerConfig.allowSpaces && query.includes(' ')) {
      return null
    }

    return {
      trigger: triggerConfig,
      query,
      triggerPosition: i,
    }
  }

  return null
}

/**
 * Check if cursor is at a mention boundary (for backspace deletion)
 */
export function getMentionAtPosition(position: number, mentions: Mention[]): Mention | null {
  // Check if cursor is right after a mention
  return mentions.find((m) => m.end === position) || null
}

/**
 * Update mention positions after text insertion/deletion
 */
export function updateMentionPositions(
  mentions: Mention[],
  changeStart: number,
  changeEnd: number,
  insertedLength: number,
): Mention[] {
  const delta = insertedLength - (changeEnd - changeStart)

  return mentions
    .filter((m) => {
      // Remove mentions that overlap with the change
      if (changeStart < m.end && changeEnd > m.start) {
        return false
      }
      return true
    })
    .map((m) => {
      // Shift mentions that come after the change
      if (m.start >= changeEnd) {
        return {
          ...m,
          start: m.start + delta,
          end: m.end + delta,
        }
      }
      return m
    })
}

/**
 * Measure cursor position in pixels for popover positioning
 */
export function measureCursorPosition(
  input: HTMLInputElement | HTMLTextAreaElement,
  position: number,
): VirtualAnchor {
  // Create a hidden span with matching styles
  const span = document.createElement('span')
  const computed = getComputedStyle(input)

  // Copy relevant styles
  const styles = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'letterSpacing',
    'wordSpacing',
    'lineHeight',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'borderLeftWidth',
    'borderRightWidth',
    'textTransform',
    'whiteSpace',
    'boxSizing',
  ] as const

  for (const style of styles) {
    ;(span.style as unknown as Record<string, string>)[style] = computed[style]
  }

  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  span.style.whiteSpace = 'pre-wrap'
  span.style.wordWrap = 'break-word'
  span.style.overflow = 'hidden'

  // For textarea, set width to match
  if (input.tagName === 'TEXTAREA') {
    span.style.width = `${input.clientWidth}px`
  }

  // Insert text up to cursor
  const text = input.value.substring(0, position)
  span.textContent = text

  // Add marker for cursor position
  const marker = document.createElement('span')
  marker.textContent = '\u200B' // Zero-width space
  span.appendChild(marker)

  document.body.appendChild(span)

  const inputRect = input.getBoundingClientRect()
  const markerRect = marker.getBoundingClientRect()
  const spanRect = span.getBoundingClientRect()

  document.body.removeChild(span)

  // Calculate position relative to viewport
  const lineHeight =
    Number.parseFloat(computed.lineHeight) || Number.parseFloat(computed.fontSize) * 1.2
  const x = inputRect.left + (markerRect.left - spanRect.left) - input.scrollLeft
  const y = inputRect.top + (markerRect.top - spanRect.top) - input.scrollTop + lineHeight

  return {
    getBoundingClientRect: () => ({
      x,
      y,
      top: y,
      left: x,
      bottom: y,
      right: x,
      width: 0,
      height: 0,
      toJSON: () => ({}),
    }),
  }
}

/**
 * Normalize text for comparison (lowercase, remove accents)
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Default filter function for mention items
 */
export function defaultFilter(items: { label: string }[], query: string): { label: string }[] {
  if (!query) return items

  const normalizedQuery = normalizeText(query)
  return items.filter((item) => normalizeText(item.label).includes(normalizedQuery))
}
