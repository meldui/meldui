/**
 * MeldViewer — annotation system stories.
 *
 * Covers: load-on-open, AI/RAG citation injection via the programmatic API,
 * import/export round-trip, save-as-copy with annotations baked in.
 */
import {
  HIGHLIGHT_COLORS,
  MeldViewer,
  type MeldAnnotation,
  type MeldThread,
  type MeldViewerInstance,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { SAMPLE_PDF_URL, SEEDED_ANNOTATIONS, SEEDED_THREADS, WASM_URL, DEMO_USER } from './_shared'

const meta: Meta<typeof MeldViewer> = {
  title: 'Components/MeldViewer/Annotations',
  component: MeldViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The annotation system uses **native EmbedPDF annotations** under the hood,
with a **threaded comments overlay** layered on top (keyed by EmbedPDF's
stable annotation UUID).

Annotations are persisted via the programmatic API (\`MeldViewerInstance\`)
exposed through Vue's \`defineExpose\` — capture a template ref and call
methods directly.
        `,
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const ENABLE_ANNOTATIONS_FEATURES = {
  annotations: true,
  commentThreads: true,
  zoom: true,
  search: true,
  outline: true,
  thumbnails: true,
  selection: true,
  print: true,
  download: true,
  fullscreen: true,
  keyboardShortcuts: true,
}

/** Load pre-seeded annotations + threads at mount time. */
export const LoadOnOpen: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      return {
        source: SAMPLE_PDF_URL,
        wasmUrl: WASM_URL,
        annotations: SEEDED_ANNOTATIONS,
        threads: SEEDED_THREADS,
        user: DEMO_USER,
        features: ENABLE_ANNOTATIONS_FEATURES,
      }
    },
    template: `
      <div style="height: 100vh;">
        <MeldViewer
          :source="source"
          :wasm-url="wasmUrl"
          :features="features"
          :current-user="user"
          :initial-annotations="annotations"
          :initial-threads="threads"
        />
      </div>
    `,
  }),
}

/**
 * Programmatic annotation — simulates an AI/RAG citation flow that creates
 * a highlight from external code (no user interaction).
 */
export const ProgrammaticAnnotation: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      const viewer = ref<MeldViewerInstance | null>(null)

      async function injectCitation() {
        const v = viewer.value
        if (!v) return
        // Coords mirror the seeded `demo-highlight-1` rect style (x=54,
        // y on a real text-line baseline, height=9 = single line of body
        // text). Lines in this abstract are ~12pt apart starting at y=352.
        // This rect lands on "ternative compilation technique for dynamically-typed languages",
        // ~4 lines below the seeded highlight position.
        const lineY = 399.93
        const lineHeight = 9
        const textWidth = 200
        await v.createAnnotation({
          type: 'highlight',
          pageIndex: 0,
          rect: { origin: { x: 54.14, y: lineY }, size: { width: textWidth, height: lineHeight } },
          segmentRects: [
            { origin: { x: 54.14, y: lineY }, size: { width: textWidth, height: lineHeight } },
          ],
          // Use the palette's Green preset (index 1) so the AI-injected highlight
          // matches the toolbar swatches and a user manually re-colouring it
          // sees the matching swatch highlighted.
          color: HIGHLIGHT_COLORS[1].value,
          opacity: 1,
          selectedText: 'an alternative compilation technique for dynamically-typed languages',
          author: 'AI Assistant',
          metadata: { isEphemeral: true, sourceClaim: 'demo' },
        })
      }

      async function exportAll() {
        const v = viewer.value
        if (!v) return
        // `exportAnnotations()` is the EmbedPDF-native API — returns
        // annotation geometry/metadata only. Thread data (replies +
        // resolved state) lives in MeldUI's parallel `useAnnotationThreads`
        // store. We bundle both halves here for backend persistence; the
        // consumer would typically POST { annotations, threads } as one
        // record per annotation, keyed by annotationId.
        const items = await v.exportAnnotations()
        const annotationList = items.map((i) => i.annotation)
        const threadList = annotationList
          .map((a) => v.getThread(a.id))
          .filter((t) => t !== null)
        const bundle = { annotations: annotationList, threads: threadList }
        console.log('[storybook] exported bundle:', bundle)
        alert(
          `Exported ${bundle.annotations.length} annotation(s) + ${bundle.threads.length} thread(s) — see console.`,
        )
      }

      async function saveAsCopy() {
        const v = viewer.value
        if (!v) return
        const buf = await v.saveAsCopy()
        const blob = new Blob([buf], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
      }

      return {
        viewer,
        source: SAMPLE_PDF_URL,
        wasmUrl: WASM_URL,
        user: DEMO_USER,
        features: ENABLE_ANNOTATIONS_FEATURES,
        injectCitation,
        exportAll,
        saveAsCopy,
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; height: 100vh;">
        <div style="display: flex; gap: 0.5rem; padding: 0.5rem; border-bottom: 1px solid #e5e7eb;">
          <button
            type="button"
            style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #16a34a; color: white;"
            @click="injectCitation"
          >Inject AI Citation</button>
          <button
            type="button"
            style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #2563eb; color: white;"
            @click="exportAll"
          >Export Annotations</button>
          <button
            type="button"
            style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #7c3aed; color: white;"
            @click="saveAsCopy"
          >Save As Copy</button>
        </div>
        <div style="flex: 1; min-height: 0;">
          <MeldViewer
            ref="viewer"
            :source="source"
            :wasm-url="wasmUrl"
            :features="features"
            :current-user="user"
          />
        </div>
      </div>
    `,
  }),
}

/**
 * External annotations panel — disables the built-in side panel
 * (`features.commentThreads = false`) and renders a custom panel beside
 * the viewer. The story shows the full "bring your own panel" pattern:
 *
 *  - Mirror annotations + threads in story-local state, driven entirely
 *    by the viewer's top-level events (`annotation-*` + `thread-update`).
 *  - React to `thread-open-requested` (fires for both highlight-tooltip
 *    view-thread clicks AND comment-marker clicks on the page) to focus
 *    the matching row in the external panel.
 *  - Mutate via the `MeldViewerInstance` programmatic API (addReply,
 *    resolveAnnotation, deleteAnnotation, navigateToAnnotation).
 *
 * The on-page UX (highlight selection, comment markers, the floating
 * highlight tooltip with swatches + view-thread + delete) keeps working
 * even though the built-in side panel is hidden.
 */
export const ExternalPanel: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      const viewer = ref<MeldViewerInstance | null>(null)
      // Mirror the viewer's annotations + threads in story-local state. Both
      // start empty and populate from the viewer's events (the initial seed
      // replays through `annotation-created`).
      const annotations = ref<MeldAnnotation[]>([])
      const threads = ref<MeldThread[]>([...SEEDED_THREADS])
      const focusedId = ref<string | null>(null)
      const replyDrafts = ref<Record<string, string>>({})
      const eventLog = ref<string[]>([])

      function logEvent(line: string) {
        eventLog.value = [`${new Date().toLocaleTimeString()} — ${line}`, ...eventLog.value].slice(
          0,
          12,
        )
      }

      // ─── Event handlers — keep the mirror in sync ────────────────────────
      function onCreated(payload: { annotation: MeldAnnotation }) {
        if (!annotations.value.some((a) => a.id === payload.annotation.id)) {
          annotations.value = [...annotations.value, payload.annotation]
        }
        logEvent(
          `annotation-created · ${payload.annotation.type} · ${payload.annotation.id.slice(0, 8)}`,
        )
      }
      function onUpdated(payload: { annotation: MeldAnnotation }) {
        annotations.value = annotations.value.map((a) =>
          a.id === payload.annotation.id ? payload.annotation : a,
        )
      }
      function onDeleted(payload: { annotationId: string }) {
        annotations.value = annotations.value.filter((a) => a.id !== payload.annotationId)
        threads.value = threads.value.filter((t) => t.annotationId !== payload.annotationId)
        if (focusedId.value === payload.annotationId) focusedId.value = null
        logEvent(`annotation-deleted · ${payload.annotationId.slice(0, 8)}`)
      }
      function onThreadUpdate(payload: { thread: MeldThread; action: string }) {
        const existing = threads.value.findIndex(
          (t) => t.annotationId === payload.thread.annotationId,
        )
        if (existing >= 0) {
          threads.value = threads.value.map((t, i) => (i === existing ? payload.thread : t))
        } else {
          threads.value = [...threads.value, payload.thread]
        }
        logEvent(`thread-update · ${payload.action} · ${payload.thread.annotationId.slice(0, 8)}`)
      }
      function onThreadOpen(payload: { annotationId: string; source: string }) {
        focusedId.value = payload.annotationId
        logEvent(
          `thread-open-requested · source=${payload.source} · ${payload.annotationId.slice(0, 8)}`,
        )
      }

      // ─── External-panel actions — call back into the viewer ───────────────
      function getThread(annotationId: string): MeldThread | undefined {
        return threads.value.find((t) => t.annotationId === annotationId)
      }
      async function submitReply(annotationId: string) {
        const content = (replyDrafts.value[annotationId] ?? '').trim()
        if (!content) return
        await viewer.value?.addReply(annotationId, content)
        replyDrafts.value = { ...replyDrafts.value, [annotationId]: '' }
      }
      async function toggleResolved(annotationId: string) {
        const thread = getThread(annotationId)
        await viewer.value?.resolveAnnotation(annotationId, !thread?.isResolved)
      }
      async function remove(annotationId: string) {
        await viewer.value?.deleteAnnotation(annotationId)
      }
      function jumpTo(annotationId: string) {
        viewer.value?.navigateToAnnotation(annotationId)
      }

      const panelItems = computed(() =>
        annotations.value
          .filter(
            (a) => a.type === 'highlight' || a.type === 'comment' || a.type === 'free-text',
          )
          .map((a) => ({
            annotation: a,
            thread:
              getThread(a.id) ??
              ({ annotationId: a.id, isResolved: false, replies: [] } as MeldThread),
          })),
      )

      return {
        viewer,
        annotations,
        threads,
        focusedId,
        replyDrafts,
        eventLog,
        panelItems,
        onCreated,
        onUpdated,
        onDeleted,
        onThreadUpdate,
        onThreadOpen,
        submitReply,
        toggleResolved,
        remove,
        jumpTo,
        source: SAMPLE_PDF_URL,
        wasmUrl: WASM_URL,
        user: DEMO_USER,
        // Same feature set as the other stories EXCEPT commentThreads = false
        // — the built-in side panel will not render.
        features: {
          ...ENABLE_ANNOTATIONS_FEATURES,
          commentThreads: false,
        },
        initialAnnotations: SEEDED_ANNOTATIONS,
        initialThreads: SEEDED_THREADS,
      }
    },
    template: `
      <div style="display: flex; height: 100vh;">
        <div style="flex: 1; min-width: 0;">
          <MeldViewer
            ref="viewer"
            :source="source"
            :wasm-url="wasmUrl"
            :features="features"
            :current-user="user"
            :initial-annotations="initialAnnotations"
            :initial-threads="initialThreads"
            @annotation-created="onCreated"
            @annotation-updated="onUpdated"
            @annotation-deleted="onDeleted"
            @thread-update="onThreadUpdate"
            @thread-open-requested="onThreadOpen"
          />
        </div>
        <aside style="width: 380px; border-left: 1px solid #e5e7eb; display: flex; flex-direction: column; background: #f9fafb;">
          <header style="padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; background: white;">
            <h2 style="margin: 0; font-size: 0.875rem; font-weight: 600;">External Panel</h2>
            <p style="margin: 0.25rem 0 0; font-size: 0.75rem; color: #6b7280;">
              Built-in panel disabled · {{ annotations.length }} annotation(s)
            </p>
          </header>
          <div style="flex: 1; overflow: auto;">
            <article
              v-for="item in panelItems"
              :key="item.annotation.id"
              :style="{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                background: focusedId === item.annotation.id ? '#e0f2fe' : 'transparent',
              }"
              @click="jumpTo(item.annotation.id)"
            >
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                <strong style="font-size: 0.875rem;">{{ item.annotation.author ?? 'Anonymous' }}</strong>
                <span style="font-size: 0.6875rem; color: #6b7280;">{{ item.annotation.type }}</span>
              </div>
              <p style="margin: 0.25rem 0 0; font-size: 0.8125rem; color: #374151;">
                {{ item.annotation.type === 'highlight' ? item.annotation.selectedText : item.annotation.contents }}
              </p>
              <div v-if="item.thread.replies.length" style="margin-top: 0.5rem;">
                <p style="margin: 0 0 0.375rem; font-size: 0.75rem; color: #6b7280;">
                  {{ item.thread.replies.length }} {{ item.thread.replies.length === 1 ? 'reply' : 'replies' }}
                </p>
                <ul
                  style="list-style: none; margin: 0; padding: 0 0 0 0.75rem; border-left: 2px solid #d1d5db;"
                >
                  <li
                    v-for="reply in item.thread.replies"
                    :key="reply.id"
                    style="margin-bottom: 0.5rem; font-size: 0.8125rem;"
                  >
                    <strong style="font-size: 0.75rem;">{{ reply.authorName ?? 'Anonymous' }}</strong>
                    <p style="margin: 0; color: #374151; white-space: pre-wrap;">{{ reply.content }}</p>
                  </li>
                </ul>
              </div>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;" @click.stop>
                <input
                  v-model="replyDrafts[item.annotation.id]"
                  :placeholder="'Reply...'"
                  style="flex: 1; padding: 0.25rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem; font-size: 0.75rem;"
                  @keydown.enter="submitReply(item.annotation.id)"
                />
                <button
                  type="button"
                  @click="submitReply(item.annotation.id)"
                  style="padding: 0.25rem 0.625rem; background: #2563eb; color: white; border: 0; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;"
                >Reply</button>
                <button
                  type="button"
                  @click="toggleResolved(item.annotation.id)"
                  :style="{
                    padding: '0.25rem 0.625rem',
                    background: item.thread.isResolved ? '#6b7280' : '#16a34a',
                    color: 'white',
                    border: 0,
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }"
                >{{ item.thread.isResolved ? 'Unresolve' : 'Resolve' }}</button>
                <button
                  type="button"
                  @click="remove(item.annotation.id)"
                  style="padding: 0.25rem 0.625rem; background: #dc2626; color: white; border: 0; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;"
                >Delete</button>
              </div>
            </article>
            <p v-if="!panelItems.length" style="padding: 1rem; color: #6b7280; font-size: 0.875rem;">
              No annotations yet. Use the highlight tool or add a comment on the page.
            </p>
          </div>
          <footer style="border-top: 1px solid #e5e7eb; background: white; padding: 0.5rem 1rem; max-height: 12rem; overflow: auto;">
            <p style="margin: 0 0 0.25rem; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; color: #6b7280;">Event log</p>
            <ol style="list-style: none; margin: 0; padding: 0;">
              <li
                v-for="(entry, i) in eventLog"
                :key="i"
                style="font-family: ui-monospace, monospace; font-size: 0.6875rem; color: #374151;"
              >{{ entry }}</li>
              <li v-if="!eventLog.length" style="font-size: 0.75rem; color: #9ca3af;">No events yet.</li>
            </ol>
          </footer>
        </aside>
      </div>
    `,
  }),
}

/**
 * Import / export round-trip — capture annotations from the viewer and
 * re-hydrate them on a fresh mount.
 */
export const ImportExportRoundTrip: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      const viewer = ref<MeldViewerInstance | null>(null)
      const exported = ref<string>('')
      const remountKey = ref(0)
      const annotations = ref(SEEDED_ANNOTATIONS)
      const initialThreads = ref(SEEDED_THREADS)

      // The bundle shape: annotations + threads in one JSON object. This is
      // the canonical "round-trip everything" payload for a backend that
      // persists both halves of MeldUI's data model.
      //
      // `exportAnnotations()` is the EmbedPDF-native API — it returns only
      // annotation geometry/metadata. Thread data (replies + resolved state)
      // lives in MeldUI's parallel `useAnnotationThreads` store. Consumers
      // assemble the bundle by calling `getThread(id)` per annotation.
      async function dumpJson() {
        const v = viewer.value
        if (!v) return
        const items = await v.exportAnnotations()
        const annotationList = items.map((i) => i.annotation)
        const threadList = annotationList
          .map((a) => v.getThread(a.id))
          .filter((t): t is MeldThread => t !== null)
        exported.value = JSON.stringify(
          { annotations: annotationList, threads: threadList },
          null,
          2,
        )
      }

      function importFromJson() {
        try {
          const parsed = JSON.parse(exported.value)
          // Three shapes accepted:
          //   1. `{ annotations: [], threads: [] }` — full bundle (this story's dumpJson)
          //   2. flat `MeldAnnotation[]`            — legacy / hand-edited payload
          //   3. `AnnotationTransferItem[]`         — viewer.exportAnnotations() shape
          if (parsed && !Array.isArray(parsed) && Array.isArray(parsed.annotations)) {
            annotations.value = parsed.annotations as MeldAnnotation[]
            initialThreads.value = Array.isArray(parsed.threads)
              ? (parsed.threads as MeldThread[])
              : []
            remountKey.value++
            return
          }
          if (!Array.isArray(parsed)) {
            alert('Invalid JSON: expected an array, or { annotations, threads } object.')
            return
          }
          const first = parsed[0]
          const isWrapped =
            first &&
            typeof first === 'object' &&
            'annotation' in first &&
            typeof (first as { annotation?: unknown }).annotation === 'object'
          annotations.value = isWrapped
            ? (parsed as Array<{ annotation: MeldAnnotation }>).map((i) => i.annotation)
            : (parsed as MeldAnnotation[])
          // No threads in flat/wrapped shape — leave the seed in place
          remountKey.value++
        } catch (e) {
          alert(`Invalid JSON: ${(e as Error).message}`)
        }
      }

      return {
        viewer,
        annotations,
        initialThreads,
        exported,
        remountKey,
        source: SAMPLE_PDF_URL,
        wasmUrl: WASM_URL,
        user: DEMO_USER,
        features: ENABLE_ANNOTATIONS_FEATURES,
        dumpJson,
        importFromJson,
      }
    },
    template: `
      <div style="display: flex; height: 100vh;">
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column;">
          <div style="display: flex; gap: 0.5rem; padding: 0.5rem; border-bottom: 1px solid #e5e7eb;">
            <button type="button" @click="dumpJson"
              style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #2563eb; color: white;">
              Export → JSON
            </button>
            <button type="button" @click="importFromJson"
              style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #16a34a; color: white;">
              Re-import from JSON
            </button>
          </div>
          <div style="flex: 1; min-height: 0;">
            <MeldViewer
              :key="remountKey"
              ref="viewer"
              :source="source"
              :wasm-url="wasmUrl"
              :features="features"
              :current-user="user"
              :initial-annotations="annotations"
              :initial-threads="initialThreads"
            />
          </div>
        </div>
        <textarea
          v-model="exported"
          style="width: 32rem; font-family: monospace; font-size: 11px; padding: 0.5rem; border: 0; border-left: 1px solid #e5e7eb;"
          placeholder="Click Export to dump annotations as JSON; edit & re-import to test round-trip."
        ></textarea>
      </div>
    `,
  }),
}
