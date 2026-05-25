<script setup lang="ts">
/**
 * SearchPopover — the search popover content slotted into ViewerToolbar.
 *
 * Mirrors doqo's search UX: input + match counter + prev/next buttons +
 * case-sensitive and whole-word toggles. Emits intent events upward.
 */
import { onMounted, ref, watch } from 'vue'
import { IconChevronDown, IconChevronUp, IconX } from '@meldui/tabler-vue'
import { Button } from '../../components/ui/button'
import { Toggle } from '../../components/ui/toggle'
import { cn } from '../../lib/utils'

interface Props {
  total?: number
  activeResultIndex?: number
  matchCase?: boolean
  wholeWord?: boolean
}

withDefaults(defineProps<Props>(), {
  total: 0,
  activeResultIndex: -1,
  matchCase: false,
  wholeWord: false,
})

const emit = defineEmits<{
  (e: 'search', keyword: string): void
  (e: 'next-match'): void
  (e: 'previous-match'): void
  (e: 'set-match-case', enabled: boolean): void
  (e: 'set-whole-word', enabled: boolean): void
  (e: 'close'): void
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const query = ref('')

onMounted(() => {
  inputEl.value?.focus()
})

watch(query, (q) => emit('search', q))

function handleEnter(e: KeyboardEvent) {
  if (e.shiftKey) emit('previous-match')
  else emit('next-match')
  e.preventDefault()
}

function handleEscape() {
  emit('close')
}
</script>

<template>
  <div class="search-popover flex flex-col gap-2 p-1">
    <div class="flex items-center gap-1">
      <input
        ref="inputEl"
        v-model="query"
        type="search"
        placeholder="Find in document"
        aria-label="Find in document"
        :class="
          cn(
            'h-8 flex-1 rounded-md border border-input bg-background px-2 text-sm',
            'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          )
        "
        @keydown.enter="handleEnter"
        @keydown.escape="handleEscape"
      />
      <span class="min-w-14 px-1 text-center text-xs tabular-nums text-muted-foreground">
        {{ total === 0 ? '' : `${Math.max(0, activeResultIndex) + 1} / ${total}` }}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        :disabled="total === 0"
        aria-label="Previous match"
        @click="emit('previous-match')"
      >
        <IconChevronUp :size="16" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        :disabled="total === 0"
        aria-label="Next match"
        @click="emit('next-match')"
      >
        <IconChevronDown :size="16" />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Close search" @click="emit('close')">
        <IconX :size="16" />
      </Button>
    </div>
    <div class="flex items-center gap-1">
      <Toggle
        size="sm"
        :model-value="matchCase"
        aria-label="Match case"
        @update:model-value="(v) => emit('set-match-case', !!v)"
      >
        Aa
      </Toggle>
      <Toggle
        size="sm"
        :model-value="wholeWord"
        aria-label="Whole word"
        @update:model-value="(v) => emit('set-whole-word', !!v)"
      >
        Ab|
      </Toggle>
    </div>
  </div>
</template>
