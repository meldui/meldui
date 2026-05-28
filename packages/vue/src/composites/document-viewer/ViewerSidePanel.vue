<script setup lang="ts">
/**
 * ViewerSidePanel — generic side container for outline, thumbnails,
 * comments, etc.
 *
 * Mirrors the shape of doqo's `ViewerSidePanel.vue`: header (title + close
 * button), fixed width, supports left/right placement.
 */
import { IconX } from '@meldui/tabler-vue'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

interface Props {
  title: string
  isOpen: boolean
  position?: 'left' | 'right'
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: 'right',
  width: '320px',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const panelId = `side-panel-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <Transition
    :enter-active-class="
      cn(
        'transition-transform duration-200',
        position === 'left' ? '-translate-x-0' : 'translate-x-0',
      )
    "
    :leave-active-class="
      cn(
        'transition-transform duration-200',
        position === 'left' ? '-translate-x-full' : 'translate-x-full',
      )
    "
    :enter-from-class="position === 'left' ? '-translate-x-full' : 'translate-x-full'"
    :leave-to-class="position === 'left' ? '-translate-x-full' : 'translate-x-full'"
  >
    <aside
      v-show="isOpen"
      :id="panelId"
      role="region"
      :aria-labelledby="`${panelId}-title`"
      :class="
        cn(
          'flex h-full flex-shrink-0 flex-col border-border bg-background',
          position === 'right' ? 'border-l' : 'border-r',
        )
      "
      :style="{ width: props.width }"
    >
      <header class="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 :id="`${panelId}-title`" class="text-sm font-medium text-foreground">
          {{ title }}
        </h2>
        <Button variant="ghost" size="icon-sm" aria-label="Close panel" @click="emit('close')">
          <IconX :size="16" />
        </Button>
      </header>

      <!--
        No scroll here: each panel owns its own scroll region (MeldUI
        <ScrollArea> for outline/annotations, EmbedPDF's own scroller for
        thumbnails) so the viewer never shows a second, unstyled native bar.
      -->
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <slot />
      </div>
    </aside>
  </Transition>
</template>
