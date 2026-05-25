/**
 * useAnnotationThreads — overlay metadata for annotation threading.
 *
 * EmbedPDF's annotation model is flat (one annotation per ID). PDF spec
 * supports in-reply-to (IRT) primitives but EmbedPDF does not surface
 * threading APIs. We layer threading on top, anchored to EmbedPDF's stable
 * annotation UUIDs.
 *
 * Thread metadata (replies + resolved state) is held in a reactive
 * `Map<annotationId, CommentThread>`. Consumers preload via `loadThreads()`,
 * receive change notifications via `subscribe()`, and export via
 * `exportThreads()` for backend persistence.
 *
 * IMPORTANT: this metadata never enters the PDF binary. If the consumer
 * wants threads to round-trip through `saveAsCopy()`, they must persist
 * threads separately on their backend (typical pattern).
 */
import { reactive, readonly } from 'vue'
import type { CommentReply, CommentThread, ThreadUpdatePayload } from '../types'

type ThreadStore = Map<string, CommentThread>
type ThreadListener = (payload: ThreadUpdatePayload) => void

export function useAnnotationThreads() {
  // Use `reactive` on the map so consumers can `v-for` over `threads.entries()`.
  const threads = reactive(new Map<string, CommentThread>()) as ThreadStore
  const listeners = new Set<ThreadListener>()

  function notify(payload: ThreadUpdatePayload) {
    for (const listener of listeners) listener(payload)
  }

  /** Subscribe to thread-change events. Returns an unsubscribe function. */
  function subscribe(listener: ThreadListener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  /** Replace the entire thread store. Typical use: hydrate from a server payload. */
  function loadThreads(items: CommentThread[]) {
    threads.clear()
    for (const t of items) threads.set(t.annotationId, t)
  }

  /** Snapshot the current thread store (for export / persistence). */
  function exportThreads(): CommentThread[] {
    return Array.from(threads.values()).map((t) => ({
      ...t,
      replies: [...t.replies],
    }))
  }

  /** Get the thread for an annotation, or `null` if none exists. */
  function getThread(annotationId: string): CommentThread | null {
    return threads.get(annotationId) ?? null
  }

  /** Ensure a thread exists for the given annotation id; returns it. */
  function ensureThread(annotationId: string): CommentThread {
    const existing = threads.get(annotationId)
    if (existing) return existing
    const created: CommentThread = {
      annotationId,
      isResolved: false,
      replies: [],
    }
    threads.set(annotationId, created)
    return created
  }

  /** Add a reply to an annotation's thread. Auto-creates the thread if absent. */
  function addReply(input: {
    annotationId: string
    authorUserId: string
    authorName?: string
    authorAvatarUrl?: string
    content: string
  }): CommentReply {
    const thread = ensureThread(input.annotationId)
    const reply: CommentReply = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `reply_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      annotationId: input.annotationId,
      authorUserId: input.authorUserId,
      authorName: input.authorName,
      authorAvatarUrl: input.authorAvatarUrl,
      content: input.content,
      createdAt: new Date().toISOString(),
    }
    thread.replies = [...thread.replies, reply]
    notify({ thread, action: 'reply-added' })
    return reply
  }

  /** Delete a reply by id. */
  function deleteReply(annotationId: string, replyId: string): void {
    const thread = threads.get(annotationId)
    if (!thread) return
    const before = thread.replies.length
    thread.replies = thread.replies.filter((r) => r.id !== replyId)
    if (thread.replies.length !== before) notify({ thread, action: 'reply-deleted' })
  }

  /** Update an existing reply's content. */
  function updateReply(annotationId: string, replyId: string, content: string): void {
    const thread = threads.get(annotationId)
    if (!thread) return
    const idx = thread.replies.findIndex((r) => r.id === replyId)
    if (idx === -1) return
    thread.replies = thread.replies.map((r, i) =>
      i === idx ? { ...r, content, updatedAt: new Date().toISOString() } : r,
    )
    notify({ thread, action: 'reply-added' }) // re-use action; consumer can re-fetch
  }

  /** Mark/unmark a thread as resolved. */
  function setResolved(annotationId: string, resolved: boolean, resolvedByUserId?: string): void {
    const thread = ensureThread(annotationId)
    if (thread.isResolved === resolved) return
    thread.isResolved = resolved
    if (resolved) {
      thread.resolvedByUserId = resolvedByUserId
      thread.resolvedAt = new Date().toISOString()
    } else {
      thread.resolvedByUserId = undefined
      thread.resolvedAt = undefined
    }
    notify({ thread, action: resolved ? 'resolved' : 'unresolved' })
  }

  /** Remove a thread entirely. Typically called when the underlying annotation is deleted. */
  function removeThread(annotationId: string): void {
    threads.delete(annotationId)
  }

  return {
    threads: readonly(threads) as ReadonlyMap<string, CommentThread>,
    subscribe,
    loadThreads,
    exportThreads,
    getThread,
    addReply,
    deleteReply,
    updateReply,
    setResolved,
    removeThread,
  }
}

export type UseAnnotationThreadsReturn = ReturnType<typeof useAnnotationThreads>
