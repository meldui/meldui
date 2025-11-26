# Task 12: Mention Component

> **Status:** Not Started
> **Priority:** High
> **Depends on:** Task 03 (Vue Package Setup - Complete)

## Overview

Create a composable mention/tagging component for `@meldui/vue` that allows users to trigger and select items from a dropdown by typing trigger characters (like `@`, `#`, `/`). Selected mentions render as styled inline tags within the input while maintaining a plain-text serialized value.

**Key Design Decisions:**
- Uses overlay technique (not contenteditable) for inline tag rendering
- Real `<input>` or `<textarea>` handles all text input natively
- Absolutely positioned highlighter mirrors input and renders styled mention spans
- Plain text with markers as the serialized format (e.g., `@[user:123:John Doe]`)
- Multiple configurable trigger characters supported
- Heavily customizable item rendering via slots
- Based on DiceUI's proven architecture (ported from React to Vue 3)

---

## Technical Architecture

### The Overlay Approach

Instead of using contenteditable (which has numerous cross-browser issues), this component uses a clever overlay technique:

```
┌──────────────────────────────────────────────────┐
│  Highlighter Layer (absolute positioned)         │  ← Visual layer with styled [tags]
│  ┌──────────────────────────────────────────┐   │
│  │ Hello @[John Doe] how are you?           │   │  ← Renders mention spans with data-tag
│  └──────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│  Actual Input/Textarea (transparent text)        │  ← Real input, text color transparent
│  ┌──────────────────────────────────────────┐   │
│  │ Hello @John Doe how are you?             │   │  ← Plain text value
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**How it works:**
1. A real `<input>` or `<textarea>` handles all text input (keyboard, IME, paste, etc.)
2. An absolutely positioned overlay (`MentionHighlighter`) sits on top
3. The overlay mirrors the input's styles (font, padding, scroll position)
4. Mentions are rendered as `<span data-tag>` elements in the overlay
5. The input's text is made transparent so only the overlay is visible
6. Scroll, resize, and style changes are synced via observers

**Benefits:**
- No contenteditable quirks
- Full IME (international text input) support
- Native paste, undo/redo behavior
- Mobile keyboard compatibility
- Screen readers see the real input

### Data Flow

```
User types: "Hello @jo"
                   ↓
         Trigger detected ("@")
                   ↓
         Query extracted ("jo")
                   ↓
         Popover opens at cursor position
                   ↓
         Items filtered/provided by consumer
                   ↓
User selects "John Doe" (value: "user:123")
                   ↓
         Mention inserted into text
                   ↓
         Internal: "Hello @John Doe "
         Serialized: "Hello @[user:123:John Doe] "
                   ↓
         Highlighter renders: "Hello <span data-tag>@John Doe</span> "
```

### Serialization Format

Plain text with markers:
```
Hello @[user:123:John Doe] and #[channel:456:general]!
       └─────────────────┘     └───────────────────┘
       trigger[value:label]    trigger[value:label]
```

This format:
- Is human-readable in raw form
- Can be parsed to extract mention metadata
- Works with any backend storage
- Preserves the display label for rendering

---

## Component Architecture

### Components Overview

| Component | Purpose |
|-----------|---------|
| `Mention` | Root - manages state, provides context via provide/inject |
| `MentionInput` | Text input with trigger detection and cursor tracking |
| `MentionHighlighter` | Overlay that renders styled mention tags |
| `MentionPortal` | Teleports popover outside DOM hierarchy |
| `MentionContent` | Positioned popover container for suggestions |
| `MentionItem` | Individual selectable suggestion (slot-based) |
| `MentionEmpty` | Shown when no matches found |
| `MentionLabel` | Accessible label for the input |
| `MentionLoading` | Loading indicator during async filtering |

### Component Hierarchy

```
Mention (root - provides context)
├── MentionLabel (accessible label)
├── MentionInput (text input + highlighter wrapper)
│   ├── <input> or <textarea> (real input)
│   └── MentionHighlighter (overlay with styled mentions)
└── MentionPortal (teleport wrapper)
    └── MentionContent (positioned popover)
        ├── MentionLoading (loading state)
        ├── MentionEmpty (no results state)
        └── MentionItem (selectable suggestions)
```

---

## API Specification

### Mention (Root Component)

**Props:**

```typescript
interface MentionProps {
  /** v-model binding - serialized value with mention markers */
  modelValue?: string

  /** Trigger configurations */
  triggers?: MentionTrigger[]  // Default: [{ char: '@' }]

  /** Disable all interactions */
  disabled?: boolean

  /** Read-only mode (can view but not edit) */
  readonly?: boolean

  /** Placeholder text */
  placeholder?: string

  /** Use textarea instead of input */
  multiline?: boolean  // Default: false

  /** Enable keyboard navigation looping */
  loop?: boolean  // Default: true

  /** Custom CSS class */
  class?: string

  /** Direction for RTL support */
  dir?: 'ltr' | 'rtl'
}

interface MentionTrigger {
  /** Character that activates this trigger (e.g., '@', '#', '/') */
  char: string

  /** Allow spaces in the search query */
  allowSpaces?: boolean  // Default: false

  /** Custom regex pattern for matching (advanced) */
  pattern?: RegExp
}
```

**Emits:**

```typescript
interface MentionEmits {
  /** Serialized value changed */
  'update:modelValue': [value: string]

  /** Popover opened (trigger detected) */
  'open': [trigger: string, query: string]

  /** Popover closed */
  'close': []

  /** Search query changed */
  'search': [trigger: string, query: string]

  /** Mention selected */
  'select': [item: MentionItem, trigger: string]

  /** Mention removed */
  'remove': [mention: Mention]
}
```

**Context Provided (via provide/inject):**

```typescript
interface MentionContext {
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

  // Items (set by consumer)
  items: Ref<MentionItemData[]>
  setItems: (items: MentionItemData[]) => void
  loading: Ref<boolean>
  setLoading: (loading: boolean) => void

  // Actions
  selectItem: (item: MentionItemData) => void
  removeMention: (mention: Mention) => void
  setHighlightedIndex: (index: number) => void
  closePopover: () => void

  // Refs
  inputRef: Ref<HTMLInputElement | HTMLTextAreaElement | null>
  contentRef: Ref<HTMLElement | null>

  // Position (for popover placement)
  virtualAnchor: Ref<{ getBoundingClientRect: () => DOMRect } | null>
}

interface Mention {
  /** Unique identifier/value */
  value: string
  /** Display label */
  label: string
  /** Trigger character used */
  trigger: string
  /** Start position in text */
  start: number
  /** End position in text */
  end: number
}

interface MentionItemData {
  /** Unique value for this item */
  value: string
  /** Display label */
  label: string
  /** Whether item is disabled */
  disabled?: boolean
  /** Any additional data for custom rendering */
  [key: string]: unknown
}
```

---

### MentionInput

**Props:**

```typescript
interface MentionInputProps {
  /** Custom CSS class */
  class?: string

  /** Additional input attributes */
  inputProps?: Record<string, unknown>
}
```

**Data Attributes:**

| Attribute | When Present |
|-----------|--------------|
| `[data-disabled]` | Input is disabled |
| `[data-readonly]` | Input is read-only |
| `[data-focused]` | Input has focus |

Handles:
- Text input and change events
- Trigger character detection
- Cursor position tracking for popover placement
- Keyboard navigation (Arrow keys, Enter, Escape, Backspace)
- Mention deletion (entire mention removed on backspace)
- Paste handling (detect mentions in pasted text)

---

### MentionHighlighter

**Props:**

```typescript
interface MentionHighlighterProps {
  /** Custom CSS class */
  class?: string
}
```

Internal component that:
- Mirrors input dimensions and styling
- Syncs scroll position with input
- Renders text with mentions wrapped in `<span data-tag>`
- Uses ResizeObserver and MutationObserver for sync

**Styling mentions:**

```css
/* Style mention tags via data attribute */
[data-tag] {
  background-color: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  border-radius: 0.25rem;
  padding: 0 0.25rem;
}
```

---

### MentionPortal

**Props:**

```typescript
interface MentionPortalProps {
  /** Target container for teleport */
  to?: string | HTMLElement  // Default: 'body'

  /** Disable teleporting */
  disabled?: boolean
}
```

Uses Vue's `<Teleport>` to render content outside DOM hierarchy.

---

### MentionContent

**Props:**

```typescript
interface MentionContentProps {
  /** Side of the anchor to render */
  side?: 'top' | 'bottom'  // Default: 'bottom'

  /** Offset from anchor */
  sideOffset?: number  // Default: 4

  /** Alignment relative to anchor */
  align?: 'start' | 'center' | 'end'  // Default: 'start'

  /** Avoid collisions with viewport */
  avoidCollisions?: boolean  // Default: true

  /** Custom CSS class */
  class?: string
}
```

**Data Attributes:**

| Attribute | Value |
|-----------|-------|
| `[data-state]` | `"open"` \| `"closed"` |
| `[data-side]` | `"top"` \| `"bottom"` |
| `[data-align]` | `"start"` \| `"center"` \| `"end"` |

Uses Floating UI (via Reka UI) for positioning at cursor location.

---

### MentionItem

**Props:**

```typescript
interface MentionItemProps {
  /** Item data */
  item: MentionItemData

  /** Custom CSS class */
  class?: string
}
```

**Data Attributes:**

| Attribute | When Present |
|-----------|--------------|
| `[data-highlighted]` | Item is keyboard-highlighted |
| `[data-disabled]` | Item is disabled |

**Slot Props:**

```typescript
interface MentionItemSlotProps {
  item: MentionItemData
  highlighted: boolean
  disabled: boolean
  select: () => void
}
```

---

### MentionEmpty

**Props:**

```typescript
interface MentionEmptyProps {
  class?: string
}
```

Rendered when items array is empty and not loading.

---

### MentionLoading

**Props:**

```typescript
interface MentionLoadingProps {
  class?: string
}
```

Rendered when `loading` is true.

---

### MentionLabel

**Props:**

```typescript
interface MentionLabelProps {
  class?: string
}
```

Accessible label associated with the input.

---

## Implementation Tasks

### Phase 1: Core Infrastructure

- [ ] Create directory structure: `packages/vue/src/composites/mention/`
- [ ] Create `index.ts` with exports
- [ ] Create `types.ts` with all TypeScript interfaces
- [ ] Create `useMention.ts` composable for shared state management
- [ ] Create `utils.ts` for helper functions:
  - [ ] `parseMentions(text, triggers)` - Extract mentions from serialized text
  - [ ] `serializeMentions(text, mentions)` - Convert to serialized format
  - [ ] `deserializeMentions(serialized)` - Parse serialized format
  - [ ] `measureTextPosition(input, position)` - Calculate cursor pixel position
  - [ ] `normalizeText(text)` - Normalize for comparison (lowercase, accents)

### Phase 2: Root Component

- [ ] Implement `Mention.vue` (root with context provider)
  - [ ] Set up provide/inject for context
  - [ ] Manage mentions array state
  - [ ] Handle serialization/deserialization of modelValue
  - [ ] Coordinate open/close state
  - [ ] Handle keyboard navigation delegation

### Phase 3: Input Components

- [ ] Implement `MentionInput.vue`
  - [ ] Render input or textarea based on `multiline` prop
  - [ ] Detect trigger characters on input
  - [ ] Track cursor position for query extraction
  - [ ] Calculate virtual anchor position for popover
  - [ ] Handle keyboard events (arrows, enter, escape, backspace)
  - [ ] Handle mention deletion (backspace removes entire mention)
  - [ ] Handle paste with mention detection
  - [ ] Support IME input properly

- [ ] Implement `MentionHighlighter.vue`
  - [ ] Position absolutely over input
  - [ ] Mirror input styles (font, padding, line-height)
  - [ ] Sync scroll position with input
  - [ ] Render text segments with mention spans
  - [ ] Use ResizeObserver for dimension sync
  - [ ] Use MutationObserver for style sync

### Phase 4: Popover Components

- [ ] Implement `MentionPortal.vue`
  - [ ] Wrap Vue Teleport
  - [ ] Support custom target

- [ ] Implement `MentionContent.vue`
  - [ ] Use Floating UI for positioning
  - [ ] Position at virtual anchor (cursor position)
  - [ ] Handle collision avoidance
  - [ ] Animate open/close

- [ ] Implement `MentionItem.vue`
  - [ ] Handle click selection
  - [ ] Support keyboard highlighting
  - [ ] Provide slot props for custom rendering

- [ ] Implement `MentionEmpty.vue`
  - [ ] Render when no items match

- [ ] Implement `MentionLoading.vue`
  - [ ] Render during async filtering

- [ ] Implement `MentionLabel.vue`
  - [ ] Associate with input for accessibility

### Phase 5: Cursor Position Calculation

- [ ] Implement text measurement utility
  - [ ] Create hidden span with matching styles
  - [ ] Calculate text width up to cursor
  - [ ] Handle line wrapping for textarea
  - [ ] Account for scroll offset
  - [ ] Support RTL text direction
  - [ ] Return DOMRect-compatible object for Floating UI

### Phase 6: Keyboard Navigation

- [ ] Arrow Up/Down: Navigate items
- [ ] Enter/Tab: Select highlighted item
- [ ] Escape: Close popover
- [ ] Backspace at mention boundary: Delete entire mention
- [ ] Home/End: Jump to first/last item

### Phase 7: Multi-Trigger Support

- [ ] Support multiple trigger configurations
- [ ] Track which trigger is active
- [ ] Allow different behaviors per trigger (allowSpaces, pattern)
- [ ] Emit trigger info with events

### Phase 8: Exports & Integration

- [ ] Export all components from `packages/vue/src/composites/mention/index.ts`
- [ ] Export types
- [ ] Add exports to `packages/vue/src/index.ts`
- [ ] Verify TypeScript definitions

### Phase 9: Storybook Documentation

- [ ] Create `Mention.stories.ts` with basic usage (Default story)
- [ ] Add story: Single-line mention input
- [ ] Add story: Multiline textarea with mentions
- [ ] Add story: Multiple triggers (@users, #channels, /commands)
- [ ] Add story: Custom item rendering (avatars, descriptions)
- [ ] Add story: Async loading with search
- [ ] Add story: Disabled and read-only states
- [ ] Add story: Custom styling
- [ ] Add story: Form integration example

---

## File Structure

```
packages/vue/src/composites/mention/
├── index.ts                    # Exports
├── types.ts                    # TypeScript interfaces
├── Mention.vue                 # Root component
├── MentionInput.vue            # Input with trigger detection
├── MentionHighlighter.vue      # Overlay for styled mentions
├── MentionPortal.vue           # Teleport wrapper
├── MentionContent.vue          # Popover container
├── MentionItem.vue             # Selectable item
├── MentionEmpty.vue            # Empty state
├── MentionLoading.vue          # Loading state
├── MentionLabel.vue            # Accessible label
├── useMention.ts               # Main composable
└── utils.ts                    # Helper functions
```

---

## Usage Examples

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  Mention,
  MentionInput,
  MentionPortal,
  MentionContent,
  MentionItem,
  MentionEmpty,
} from '@meldui/vue'

const value = ref('')
const users = ref([
  { value: 'user:1', label: 'John Doe' },
  { value: 'user:2', label: 'Jane Smith' },
  { value: 'user:3', label: 'Bob Wilson' },
])

const filteredUsers = ref(users.value)

function handleSearch(trigger: string, query: string) {
  filteredUsers.value = users.value.filter(user =>
    user.label.toLowerCase().includes(query.toLowerCase())
  )
}
</script>

<template>
  <Mention v-model="value" @search="handleSearch">
    <MentionInput
      class="w-full px-3 py-2 border rounded-lg"
      placeholder="Type @ to mention someone..."
    />

    <MentionPortal>
      <MentionContent class="bg-popover border rounded-lg shadow-lg p-1 w-64">
        <MentionEmpty class="px-3 py-2 text-sm text-muted-foreground">
          No users found
        </MentionEmpty>

        <MentionItem
          v-for="user in filteredUsers"
          :key="user.value"
          :item="user"
          class="px-3 py-2 rounded cursor-pointer data-[highlighted]:bg-accent"
        >
          {{ user.label }}
        </MentionItem>
      </MentionContent>
    </MentionPortal>
  </Mention>
</template>
```

### Custom Item Rendering with Avatars

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Avatar, AvatarImage, AvatarFallback } from '@meldui/vue'

interface User {
  value: string
  label: string
  avatar: string
  role: string
}

const users = ref<User[]>([
  { value: 'user:1', label: 'John Doe', avatar: '/avatars/john.jpg', role: 'Engineer' },
  { value: 'user:2', label: 'Jane Smith', avatar: '/avatars/jane.jpg', role: 'Designer' },
])
</script>

<template>
  <Mention v-model="value">
    <MentionInput placeholder="Mention a team member..." />

    <MentionPortal>
      <MentionContent class="bg-popover border rounded-lg shadow-lg p-1 w-72">
        <MentionItem
          v-for="user in users"
          :key="user.value"
          :item="user"
          v-slot="{ item, highlighted }"
          class="flex items-center gap-3 px-3 py-2 rounded cursor-pointer"
          :class="{ 'bg-accent': highlighted }"
        >
          <Avatar size="sm">
            <AvatarImage :src="item.avatar" :alt="item.label" />
            <AvatarFallback>{{ item.label[0] }}</AvatarFallback>
          </Avatar>
          <div>
            <div class="font-medium text-sm">{{ item.label }}</div>
            <div class="text-xs text-muted-foreground">{{ item.role }}</div>
          </div>
        </MentionItem>
      </MentionContent>
    </MentionPortal>
  </Mention>
</template>
```

### Multiple Triggers

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const activeTrigger = ref<string | null>(null)

const users = [
  { value: 'user:1', label: 'John Doe' },
  { value: 'user:2', label: 'Jane Smith' },
]

const channels = [
  { value: 'channel:1', label: 'general' },
  { value: 'channel:2', label: 'random' },
]

const commands = [
  { value: 'cmd:giphy', label: 'giphy', description: 'Search for GIFs' },
  { value: 'cmd:remind', label: 'remind', description: 'Set a reminder' },
]

const items = ref<any[]>([])

function handleOpen(trigger: string) {
  activeTrigger.value = trigger
  if (trigger === '@') items.value = users
  else if (trigger === '#') items.value = channels
  else if (trigger === '/') items.value = commands
}
</script>

<template>
  <Mention
    v-model="value"
    :triggers="[
      { char: '@' },
      { char: '#' },
      { char: '/', allowSpaces: false }
    ]"
    @open="handleOpen"
  >
    <MentionInput placeholder="Type @user, #channel, or /command..." />

    <MentionPortal>
      <MentionContent class="bg-popover border rounded-lg shadow-lg p-1">
        <div v-if="activeTrigger === '/'" class="px-2 py-1 text-xs text-muted-foreground">
          Commands
        </div>

        <MentionItem
          v-for="item in items"
          :key="item.value"
          :item="item"
          v-slot="{ item: data, highlighted }"
          class="px-3 py-2 rounded cursor-pointer data-[highlighted]:bg-accent"
        >
          <span v-if="activeTrigger === '#'">#{{ data.label }}</span>
          <span v-else-if="activeTrigger === '/'">
            /{{ data.label }}
            <span class="text-muted-foreground text-xs ml-2">{{ data.description }}</span>
          </span>
          <span v-else>{{ data.label }}</span>
        </MentionItem>
      </MentionContent>
    </MentionPortal>
  </Mention>
</template>
```

### Async Search with Loading

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Spinner } from '@meldui/vue'

const value = ref('')
const items = ref<any[]>([])
const loading = ref(false)

async function handleSearch(trigger: string, query: string) {
  if (query.length < 2) {
    items.value = []
    return
  }

  loading.value = true
  try {
    const response = await fetch(`/api/users?q=${encodeURIComponent(query)}`)
    items.value = await response.json()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Mention v-model="value" @search="handleSearch">
    <MentionInput placeholder="Search users..." />

    <MentionPortal>
      <MentionContent class="bg-popover border rounded-lg shadow-lg p-1 w-64">
        <MentionLoading v-if="loading" class="flex items-center justify-center py-4">
          <Spinner size="sm" />
        </MentionLoading>

        <template v-else>
          <MentionEmpty class="px-3 py-4 text-center text-sm text-muted-foreground">
            Type at least 2 characters to search
          </MentionEmpty>

          <MentionItem
            v-for="user in items"
            :key="user.value"
            :item="user"
            class="px-3 py-2 rounded cursor-pointer data-[highlighted]:bg-accent"
          >
            {{ user.label }}
          </MentionItem>
        </template>
      </MentionContent>
    </MentionPortal>
  </Mention>
</template>
```

### Multiline Textarea

```vue
<template>
  <Mention v-model="value" multiline>
    <MentionInput
      class="w-full min-h-[100px] px-3 py-2 border rounded-lg resize-y"
      placeholder="Write a message... Use @ to mention"
    />

    <MentionPortal>
      <MentionContent>
        <!-- items -->
      </MentionContent>
    </MentionPortal>
  </Mention>
</template>
```

### Custom Mention Tag Styling

```vue
<template>
  <Mention v-model="value">
    <MentionInput class="mention-input" />
    <!-- ... -->
  </Mention>
</template>

<style>
.mention-input [data-tag] {
  background: linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.1));
  color: hsl(var(--primary));
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-weight: 500;
}

/* Different styles per trigger */
.mention-input [data-tag][data-trigger="#"] {
  background: hsl(var(--blue-500) / 0.1);
  color: hsl(var(--blue-500));
}

.mention-input [data-tag][data-trigger="/"] {
  background: hsl(var(--amber-500) / 0.1);
  color: hsl(var(--amber-500));
  font-family: monospace;
}
</style>
```

---

## Technical Implementation Notes

### Text Measurement for Cursor Position

```typescript
// utils.ts
export function measureCursorPosition(
  input: HTMLInputElement | HTMLTextAreaElement,
  position: number
): { x: number; y: number } {
  // Create a hidden span with matching styles
  const span = document.createElement('span')
  const computed = getComputedStyle(input)

  // Copy relevant styles
  const styles = [
    'font-family', 'font-size', 'font-weight', 'font-style',
    'letter-spacing', 'word-spacing', 'line-height',
    'padding-left', 'padding-right', 'padding-top', 'padding-bottom',
    'border-left-width', 'border-right-width',
    'text-transform', 'white-space'
  ]

  styles.forEach(style => {
    span.style.setProperty(style, computed.getPropertyValue(style))
  })

  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  span.style.whiteSpace = 'pre-wrap'
  span.style.wordWrap = 'break-word'

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

  // Calculate position relative to input
  return {
    x: inputRect.left + (markerRect.left - spanRect.left) - input.scrollLeft,
    y: inputRect.top + (markerRect.top - spanRect.top) - input.scrollTop + parseFloat(computed.lineHeight)
  }
}
```

### Mention Serialization

```typescript
// utils.ts
const MENTION_REGEX = /([#@/])?\[([^\]:]+):([^\]]+)\]/g

export function serializeMention(trigger: string, value: string, label: string): string {
  return `${trigger}[${value}:${label}]`
}

export function parseMentions(text: string): Mention[] {
  const mentions: Mention[] = []
  let match: RegExpExecArray | null

  while ((match = MENTION_REGEX.exec(text)) !== null) {
    mentions.push({
      trigger: match[1] || '@',
      value: match[2],
      label: match[3],
      start: match.index,
      end: match.index + match[0].length
    })
  }

  return mentions
}

export function getDisplayText(serialized: string): string {
  return serialized.replace(MENTION_REGEX, (match, trigger, value, label) => {
    return `${trigger || '@'}${label}`
  })
}
```

### Highlighter Synchronization

```typescript
// In MentionHighlighter.vue
const syncStyles = () => {
  if (!inputRef.value || !highlighterRef.value) return

  const computed = getComputedStyle(inputRef.value)
  const highlighter = highlighterRef.value

  // Sync dimensions
  highlighter.style.width = `${inputRef.value.offsetWidth}px`
  highlighter.style.height = `${inputRef.value.offsetHeight}px`

  // Sync font styles
  highlighter.style.fontFamily = computed.fontFamily
  highlighter.style.fontSize = computed.fontSize
  highlighter.style.fontWeight = computed.fontWeight
  highlighter.style.lineHeight = computed.lineHeight
  highlighter.style.letterSpacing = computed.letterSpacing

  // Sync padding
  highlighter.style.paddingTop = computed.paddingTop
  highlighter.style.paddingRight = computed.paddingRight
  highlighter.style.paddingBottom = computed.paddingBottom
  highlighter.style.paddingLeft = computed.paddingLeft

  // Sync scroll
  highlighter.scrollTop = inputRef.value.scrollTop
  highlighter.scrollLeft = inputRef.value.scrollLeft
}

// Set up observers
onMounted(() => {
  // Resize observer
  const resizeObserver = new ResizeObserver(syncStyles)
  resizeObserver.observe(inputRef.value!)

  // Scroll sync
  inputRef.value!.addEventListener('scroll', syncStyles)

  // Initial sync
  syncStyles()
})
```

---

## Accessibility Considerations

- Label properly associated with input via `for`/`id`
- Input has `role="combobox"` with appropriate ARIA attributes
- `aria-expanded` reflects popover state
- `aria-activedescendant` points to highlighted item
- Items have `role="option"` with `aria-selected`
- Keyboard navigation fully supported
- Screen reader announces mention insertions/deletions
- Focus management on popover open/close

---

## Success Criteria

1. **Trigger Detection** - Typing trigger character opens popover with filtered items
2. **Inline Tags** - Mentions render as styled tags within input/textarea
3. **Cursor Positioning** - Popover appears at cursor location, not input edge
4. **Keyboard Navigation** - Full arrow key, enter, escape, backspace support
5. **Multi-Trigger** - Support for @, #, /, and custom triggers
6. **Serialization** - Plain text with markers format works correctly
7. **Native Input** - IME, paste, undo/redo all work properly
8. **Textarea Support** - Works with multiline input
9. **Custom Items** - Slots allow full control over item rendering
10. **Async Loading** - Loading state displays during async search
11. **Accessibility** - Screen reader and keyboard accessible
12. **TypeScript** - Full type safety with exported interfaces
13. **Documentation** - Comprehensive Storybook stories

---

## References

- [DiceUI Mention](https://www.diceui.com/docs/components/mention) - Architecture inspiration
- [DiceUI GitHub](https://github.com/sadmann7/diceui) - Source code reference (React)
- [vue-mention by Akryum](https://github.com/Akryum/vue-mention) - Alternative Vue implementation
- [Floating UI](https://floating-ui.com/) - Popover positioning
- [Reka UI](https://reka-ui.com/) - Primitives used in MeldUI
- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) - Cursor handling
- [MDN: ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) - Dimension sync
