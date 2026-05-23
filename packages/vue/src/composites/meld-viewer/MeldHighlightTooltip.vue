<script setup lang="ts">
/**
 * MeldHighlightTooltip — floating affordance shown over a selected highlight.
 *
 * Mounted inside `<AnnotationLayer>`'s `#selection-menu` scoped slot. The
 * plugin positions us automatically (respecting page rotation), so all this
 * component does is render the actions: five colour presets, "Add comment",
 * and Delete.
 *
 * Why props-only / no direct capability use: keeping this component
 * presentational lets us reuse it in stories and document it in isolation;
 * the renderer wires the actions to `updateAnnotation` / `deleteAnnotation`
 * / `addThread` through its slot binding.
 */
import { computed } from 'vue'
import { Button } from '../../components/ui/button'
import { IconMessageCirclePlus, IconTrash } from '@meldui/tabler-vue'
import { HIGHLIGHT_COLORS } from './types'

interface Props {
  currentColor: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'change-color', color: string): void
  (e: 'add-comment'): void
  (e: 'delete'): void
}>()

function normalize(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase()
}

const normalizedCurrent = computed(() => normalize(props.currentColor))

function isActive(value: string): boolean {
  return normalizedCurrent.value === normalize(value)
}
</script>

<template>
  <div
    class="meld-highlight-tooltip flex items-center gap-1 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
    role="toolbar"
    aria-label="Highlight actions"
  >
    <div class="flex items-center gap-1 px-1" role="radiogroup" aria-label="Highlight color">
      <button
        v-for="color in HIGHLIGHT_COLORS"
        :key="color.name"
        type="button"
        role="radio"
        :aria-checked="isActive(color.value)"
        :aria-label="`${color.name} highlight`"
        :title="color.name"
        class="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
        :class="isActive(color.value) ? 'border-foreground' : 'border-transparent'"
        :style="{ backgroundColor: color.value }"
        @click="emit('change-color', color.value)"
      />
    </div>

    <div class="h-5 w-px bg-border" aria-hidden="true" />

    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Add comment to highlight"
      title="Add comment"
      @click="emit('add-comment')"
    >
      <IconMessageCirclePlus :size="14" />
    </Button>

    <Button
      variant="ghost"
      size="icon-sm"
      class="text-destructive hover:bg-destructive/10 hover:text-destructive"
      aria-label="Delete highlight"
      title="Delete highlight"
      @click="emit('delete')"
    >
      <IconTrash :size="14" />
    </Button>
  </div>
</template>
