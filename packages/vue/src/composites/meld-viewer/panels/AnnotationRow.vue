<script setup lang="ts">
/**
 * AnnotationRow — single annotation row inside MeldAnnotationsPanel.
 *
 * doqo-style card layout:
 *  - Header: type-icon avatar (highlight = pencil, sticky-note / free-text =
 *    comment circle) + author name + RelativeTime stacked below it; an
 *    optional "Resolved" badge sits on the right.
 *  - Body: highlight `selectedText` or annotation `contents` rendered below
 *    the header. Edit swaps it for an inline textarea + Save / Cancel.
 *  - Flat action row: Reply, Resolve (label flips to Unresolve when set),
 *    Edit (sticky-note / free-text only — highlights have no editable text),
 *    Delete. All buttons use `@click.stop` so the header's navigate handler
 *    doesn't fire underneath.
 *  - Collapsable replies: "N replies" toggle button (collapsed by default).
 *    Auto-expands when the row is focused via `props.focused` so the
 *    marker-click / "Add comment" flow still surfaces the existing replies.
 */
import { computed, nextTick, ref, watch } from 'vue'
import {
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCornerDownRight,
  IconHighlight,
  IconMessageCircle,
  IconPencil,
  IconTrash,
} from '@meldui/tabler-vue'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { RelativeTime } from '../../relative-time'
import CommentReplyForm from './CommentReplyForm.vue'
import { cn } from '../../../lib/utils'
import type { MeldAnnotation, MeldReply, MeldThread } from '../types'

interface Props {
  annotation: MeldAnnotation
  thread: MeldThread
  canResolve?: boolean
  currentUserId?: string
  /**
   * Transient one-shot trigger: when flipped to `true` the row scrolls
   * itself into view and force-expands its replies section, then emits
   * `focus-consumed`. Used for navigation (marker click, "Add comment"
   * action).
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

const isRepliesExpanded = ref(false)
const isReplyOpen = ref(false)
const isEditing = ref(false)
const draft = ref('')
const articleRef = ref<HTMLElement | null>(null)

const isEditable = computed(
  () => props.annotation.type === 'sticky-note' || props.annotation.type === 'free-text',
)
const hasReplies = computed(() => props.thread.replies.length > 0)
const repliesLabel = computed(() =>
  props.thread.replies.length === 1 ? '1 reply' : `${props.thread.replies.length} replies`,
)
const commentText = computed(() => {
  if (props.annotation.type === 'highlight') return props.annotation.selectedText ?? ''
  if (props.annotation.type === 'sticky-note') return props.annotation.contents
  if (props.annotation.type === 'free-text') return props.annotation.contents
  return ''
})

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

function handleReplyClick() {
  isReplyOpen.value = true
  // Open the replies section too so the user can see context while composing.
  isRepliesExpanded.value = true
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
  if (!isEditable.value) return
  draft.value = commentText.value
  isEditing.value = true
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
// the page or from the "Add comment" action in the highlight tooltip —
// surface the replies and scroll the card into view. We deliberately don't
// auto-open the reply form; the user can press Reply if they want to engage.
watch(
  () => props.focused,
  (focused) => {
    if (!focused) return
    if (hasReplies.value) isRepliesExpanded.value = true
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
        'meld-annotation-row flex flex-col gap-2 px-3 py-3 text-sm transition-colors hover:bg-muted/30',
        thread.isResolved && 'opacity-70',
        selected && 'bg-muted/50',
      )
    "
    :data-annotation-row-id="annotation.id"
    :data-resolved="thread.isResolved"
    :data-selected="selected"
  >
    <!--
      Header + comment text form a single clickable area that navigates to
      the annotation on the page. Action buttons inside the card use
      `@click.stop` so they don't trigger nav.
    -->
    <button
      type="button"
      class="flex flex-col gap-2 text-left"
      @click="emit('navigate', annotation)"
    >
      <header class="flex items-start gap-2">
        <Avatar class="h-8 w-8 shrink-0">
          <AvatarFallback class="bg-muted text-muted-foreground">
            <IconHighlight v-if="annotation.type === 'highlight'" :size="16" />
            <IconMessageCircle v-else :size="16" />
          </AvatarFallback>
        </Avatar>

        <div class="flex min-w-0 flex-1 flex-col">
          <span class="truncate text-sm font-semibold text-foreground">
            {{ annotation.author ?? 'Anonymous' }}
          </span>
          <RelativeTime
            v-if="annotation.createdAt"
            :date="annotation.createdAt"
            auto-update
            class="text-xs text-muted-foreground"
          />
        </div>

        <Badge v-if="thread.isResolved" variant="secondary" class="shrink-0 self-center">
          Resolved
        </Badge>
      </header>

      <div v-if="!isEditing && commentText" class="px-1">
        <p class="whitespace-pre-wrap break-words text-sm text-foreground">{{ commentText }}</p>
      </div>
    </button>

    <!-- Inline edit: takes the place of the comment text when active. -->
    <div v-if="isEditing" class="flex flex-col gap-2 px-1">
      <textarea
        v-model="draft"
        class="min-h-[80px] rounded-md border border-input bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Add a note…"
        @click.stop
      />
      <div class="flex items-center gap-2" @click.stop>
        <Button size="sm" @click="saveEdit">Save</Button>
        <Button variant="ghost" size="sm" @click="cancelEdit">Cancel</Button>
      </div>
    </div>

    <!--
      Flat action row, all 4 buttons on one line. Compact padding + gap
      keeps them inside even a 320px panel. Stops propagation so the
      header's navigate handler doesn't fire when an action is clicked.
    -->
    <div class="flex items-center gap-0.5" @click.stop>
      <Button
        variant="ghost"
        size="sm"
        class="h-7 gap-1 px-2 text-xs font-normal"
        @click="handleReplyClick"
      >
        <IconCornerDownRight :size="14" />
        Reply
      </Button>
      <Button
        v-if="canResolve"
        variant="ghost"
        size="sm"
        class="h-7 gap-1 px-2 text-xs font-normal"
        :aria-pressed="thread.isResolved"
        @click="handleToggleResolved"
      >
        <IconCheck :size="14" />
        {{ thread.isResolved ? 'Unresolve' : 'Resolve' }}
      </Button>
      <Button
        v-if="isEditable && !isEditing"
        variant="ghost"
        size="sm"
        class="h-7 gap-1 px-2 text-xs font-normal"
        @click="startEdit"
      >
        <IconPencil :size="14" />
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="h-7 gap-1 px-2 text-xs font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
        @click="handleDelete"
      >
        <IconTrash :size="14" />
        Delete
      </Button>
    </div>

    <!--
      Collapsable replies. Only rendered when the thread has at least one
      reply. The toggle button itself takes the click; @click.stop prevents
      bubbling to the navigate handler. The replies list is unstyled <ul>
      with each reply's row matching the doqo layout (avatar + name +
      RelativeTime + delete on the right, content underneath).
    -->
    <div v-if="hasReplies" class="flex flex-col gap-2" @click.stop>
      <button
        type="button"
        class="flex items-center gap-1 self-start rounded text-xs text-muted-foreground hover:text-foreground"
        :aria-expanded="isRepliesExpanded"
        @click="isRepliesExpanded = !isRepliesExpanded"
      >
        <IconChevronDown v-if="isRepliesExpanded" :size="14" />
        <IconChevronRight v-else :size="14" />
        {{ repliesLabel }}
      </button>

      <ul v-if="isRepliesExpanded" class="flex flex-col gap-2 border-l border-border pl-3">
        <li
          v-for="reply in thread.replies"
          :key="reply.id"
          class="meld-comment-reply flex flex-col gap-1"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex min-w-0 items-center gap-2">
              <Avatar class="h-6 w-6 shrink-0">
                <AvatarImage v-if="reply.authorAvatarUrl" :src="reply.authorAvatarUrl" />
                <AvatarFallback class="text-[10px]">{{ initials(reply.authorName) }}</AvatarFallback>
              </Avatar>
              <span class="truncate text-xs font-medium text-foreground">
                {{ reply.authorName ?? 'Anonymous' }}
              </span>
              <RelativeTime
                :date="reply.createdAt"
                auto-update
                class="text-xs text-muted-foreground"
              />
            </div>
            <Button
              v-if="currentUserId && currentUserId === reply.authorUserId"
              variant="ghost"
              size="icon-sm"
              class="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
              aria-label="Delete reply"
              @click="handleDeleteReply(reply)"
            >
              <IconTrash :size="12" />
            </Button>
          </div>
          <p class="whitespace-pre-wrap break-words pl-8 text-xs text-foreground">
            {{ reply.content }}
          </p>
        </li>
      </ul>
    </div>

    <!-- Inline reply composer (matches doqo: textarea + Cancel + Reply). -->
    <div v-if="isReplyOpen" @click.stop>
      <CommentReplyForm @submit="handleReplySubmit" @cancel="isReplyOpen = false" />
    </div>
  </article>
</template>
