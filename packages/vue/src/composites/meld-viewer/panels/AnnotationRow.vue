<script setup lang="ts">
/**
 * AnnotationRow — single annotation row inside MeldAnnotationsPanel.
 *
 * Replaces the older `CommentThreadItem` with two additions the audit
 * called out:
 *  - a three-dot `DropdownMenu` per row with **Edit** (opens an inline
 *    textarea bound to `annotation.contents` — same field for both
 *    highlights and sticky-notes, matching EmbedPDF's own demo) and
 *    **Delete** (removes the annotation entirely).
 *  - the row lists *every* annotation that supports a thread, not only
 *    those that already have a thread. Highlights without replies show
 *    their `selectedText` as the preview.
 */
import { nextTick, ref, watch } from 'vue'
import {
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconHighlight,
  IconMessage,
  IconMessageCircle,
  IconPencil,
  IconTrash,
} from '@meldui/tabler-vue'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import CommentReplyForm from './CommentReplyForm.vue'
import { cn } from '../../../lib/utils'
import type { MeldAnnotation, MeldReply, MeldThread } from '../types'

interface Props {
  annotation: MeldAnnotation
  thread: MeldThread
  canResolve?: boolean
  currentUserId?: string
  /**
   * Transient one-shot trigger: when flipped to `true` the row expands and
   * scrolls itself into view, then emits `focus-consumed`. Used for
   * navigation (marker click, "Add comment" action).
   */
  focused?: boolean
  /**
   * Persistent flag: stays `true` for as long as this row's annotation is
   * the currently-selected one on the page. Drives the active-row visual
   * (border + ring + subtle background) so the user can see at a glance
   * which annotation in the panel matches the selection on the page.
   */
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canResolve: true,
  focused: false,
  selected: false,
})

const emit = defineEmits<{
  (e: 'navigate', annotation: MeldAnnotation): void
  (e: 'add-reply', payload: { annotationId: string; content: string }): void
  (e: 'delete-reply', payload: { annotationId: string; replyId: string }): void
  (e: 'toggle-resolved', payload: { annotationId: string; resolved: boolean }): void
  (e: 'update', payload: { annotationId: string; patch: { contents: string } }): void
  (e: 'delete', payload: { annotationId: string }): void
  (e: 'focus-consumed'): void
}>()

const isExpanded = ref(true)
const isReplyOpen = ref(false)
const isEditing = ref(false)
const draft = ref('')
const articleRef = ref<HTMLElement | null>(null)

function preview(annotation: MeldAnnotation): string {
  if (annotation.type === 'highlight' && annotation.selectedText) return annotation.selectedText
  if (annotation.type === 'sticky-note') return annotation.contents
  if (annotation.type === 'free-text') return annotation.contents
  return `${annotation.type} on page ${annotation.pageIndex + 1}`
}

function currentContents(): string {
  if (props.annotation.type === 'sticky-note') return props.annotation.contents
  if (props.annotation.type === 'free-text') return props.annotation.contents
  return ''
}

function initials(name?: string): string {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function handleReplySubmit(content: string) {
  emit('add-reply', { annotationId: props.annotation.id, content })
  isReplyOpen.value = false
}

function handleDeleteReply(reply: MeldReply) {
  emit('delete-reply', { annotationId: props.annotation.id, replyId: reply.id })
}

function handleToggleResolved() {
  emit('toggle-resolved', { annotationId: props.annotation.id, resolved: !props.thread.isResolved })
}

function startEdit() {
  draft.value = currentContents()
  isEditing.value = true
  isExpanded.value = true
}

function saveEdit() {
  emit('update', {
    annotationId: props.annotation.id,
    patch: { contents: draft.value.trim() },
  })
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
  draft.value = ''
}

function handleDelete() {
  emit('delete', { annotationId: props.annotation.id })
}

// When the parent flags this row as focused — either from a marker click on
// the page or from the "Add comment" action in the highlight tooltip — expand
// the row and scroll it into view (doqo's panel-navigation behaviour). We
// deliberately don't auto-open the reply form; the user can press Reply if
// they want to engage.
watch(
  () => props.focused,
  (focused) => {
    if (!focused) return
    isExpanded.value = true
    void nextTick().then(() => {
      articleRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      emit('focus-consumed')
    })
  },
  { immediate: true },
)
</script>

<template>
  <article
    ref="articleRef"
    :class="
      cn(
        'meld-annotation-row flex flex-col gap-2 rounded-md border border-border bg-card p-3 text-sm transition-colors',
        thread.isResolved && 'opacity-70',
        selected && 'border-primary ring-2 ring-primary/40',
      )
    "
    :data-annotation-row-id="annotation.id"
    :data-resolved="thread.isResolved"
    :data-selected="selected"
  >
    <header class="flex items-start gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        class="h-5 w-5 shrink-0"
        :aria-expanded="isExpanded"
        :aria-label="isExpanded ? 'Collapse' : 'Expand'"
        @click="isExpanded = !isExpanded"
      >
        <IconChevronDown v-if="isExpanded" :size="14" />
        <IconChevronRight v-else :size="14" />
      </Button>

      <span class="mt-0.5 shrink-0" aria-hidden="true">
        <IconHighlight v-if="annotation.type === 'highlight'" :size="14" />
        <IconMessageCircle v-else :size="14" />
      </span>

      <button
        type="button"
        class="flex-1 cursor-pointer text-left"
        @click="emit('navigate', annotation)"
      >
        <p class="line-clamp-2 text-sm text-foreground">
          {{ preview(annotation) }}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          <span v-if="annotation.author">{{ annotation.author }}</span>
        </p>
      </button>

      <Badge v-if="thread.isResolved" variant="secondary" class="shrink-0">Resolved</Badge>

      <Button
        v-if="canResolve"
        variant="ghost"
        size="icon-sm"
        :aria-pressed="thread.isResolved"
        :aria-label="thread.isResolved ? 'Reopen' : 'Mark as resolved'"
        @click="handleToggleResolved"
      >
        <IconCheck :size="14" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Annotation actions"
            class="annotation-row-menu-trigger"
          >
            <IconDotsVertical :size="14" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @select="startEdit">
            <IconPencil :size="14" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem class="text-destructive focus:text-destructive" @select="handleDelete">
            <IconTrash :size="14" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>

    <section v-show="isExpanded" class="flex flex-col gap-2 pl-7">
      <div v-if="isEditing" class="flex flex-col gap-2">
        <textarea
          v-model="draft"
          class="min-h-[80px] rounded-md border border-input bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Add a note…"
        />
        <div class="flex items-center gap-2">
          <Button size="sm" @click="saveEdit">Save</Button>
          <Button variant="ghost" size="sm" @click="cancelEdit">Cancel</Button>
        </div>
      </div>

      <div
        v-for="reply in thread.replies"
        :key="reply.id"
        class="meld-comment-reply flex gap-2 rounded-md bg-muted/50 p-2"
      >
        <Avatar class="h-6 w-6 shrink-0">
          <AvatarImage v-if="reply.authorAvatarUrl" :src="reply.authorAvatarUrl" />
          <AvatarFallback class="text-[10px]">{{ initials(reply.authorName) }}</AvatarFallback>
        </Avatar>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-medium text-foreground">
              {{ reply.authorName ?? 'Anonymous' }}
            </span>
            <Button
              v-if="currentUserId && currentUserId === reply.authorUserId"
              variant="ghost"
              size="icon-sm"
              class="h-5 w-5"
              aria-label="Delete reply"
              @click="handleDeleteReply(reply)"
            >
              <IconTrash :size="12" />
            </Button>
          </div>
          <p class="whitespace-pre-wrap break-words text-xs text-foreground">{{ reply.content }}</p>
        </div>
      </div>

      <Button
        v-if="!isReplyOpen && !isEditing"
        variant="ghost"
        size="sm"
        class="self-start"
        @click="isReplyOpen = true"
      >
        <IconMessage :size="14" />
        Reply
      </Button>

      <CommentReplyForm
        v-if="isReplyOpen"
        @submit="handleReplySubmit"
        @cancel="isReplyOpen = false"
      />
    </section>
  </article>
</template>
