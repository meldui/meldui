<script setup lang="ts">
/**
 * OutlineNode — recursive tree node used inside OutlinePanel.
 *
 * Recursive composition: a child OutlineNode renders nested children via the
 * `name` option, so Vue can resolve the self-reference.
 */
import { ref } from 'vue'
import type { PdfBookmarkObject } from '@embedpdf/models'
import { IconChevronDown, IconChevronRight } from '@meldui/tabler-vue'
import { Button } from '../../../components/ui/button'
import { cn } from '../../../lib/utils'

interface Props {
  item: PdfBookmarkObject
  level?: number
}

const props = withDefaults(defineProps<Props>(), { level: 0 })

const emit = defineEmits<{
  (e: 'navigate', item: PdfBookmarkObject): void
}>()

defineOptions({ name: 'OutlineNode' })

const isOpen = ref(props.level < 1)

function toggle() {
  isOpen.value = !isOpen.value
}

function activate() {
  emit('navigate', props.item)
}

function handleKey(e: KeyboardEvent, hasChildren: boolean) {
  if (e.key === 'Enter' || e.key === ' ') {
    activate()
    e.preventDefault()
  } else if (e.key === 'ArrowRight' && hasChildren && !isOpen.value) {
    isOpen.value = true
  } else if (e.key === 'ArrowLeft' && hasChildren && isOpen.value) {
    isOpen.value = false
  }
}
</script>

<template>
  <li
    role="treeitem"
    :aria-expanded="(item.children?.length ?? 0) > 0 ? isOpen : undefined"
    :aria-level="level + 1"
  >
    <div
      :class="
        cn(
          'group flex w-full items-center gap-1 rounded-md px-1 py-1 text-sm text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
        )
      "
      :style="{ paddingLeft: `${level * 12}px` }"
    >
      <Button
        v-if="(item.children?.length ?? 0) > 0"
        variant="ghost"
        size="icon-sm"
        class="h-5 w-5 shrink-0"
        :aria-label="isOpen ? 'Collapse' : 'Expand'"
        @click="toggle"
      >
        <IconChevronDown v-if="isOpen" :size="14" />
        <IconChevronRight v-else :size="14" />
      </Button>
      <span v-else class="inline-block w-5 shrink-0" />
      <button
        type="button"
        class="flex-1 truncate text-left text-sm"
        @click="activate"
        @keydown="(e) => handleKey(e, (item.children?.length ?? 0) > 0)"
      >
        {{ item.title }}
      </button>
    </div>

    <ul v-if="(item.children?.length ?? 0) > 0 && isOpen" role="group">
      <OutlineNode
        v-for="(child, i) in item.children"
        :key="i"
        :item="child"
        :level="level + 1"
        @navigate="(v) => emit('navigate', v)"
      />
    </ul>
  </li>
</template>
