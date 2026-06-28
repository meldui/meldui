import { Mention, type MentionNodeAttrs } from '@tiptap/extension-mention'
import type { Editor } from '@tiptap/core'
import { MENTION_INJECTION_KEY, type MentionContext, type MentionItemData } from '@meldui/vue'
import { createApp, ref, type App } from 'vue'
import MentionList from './MentionList.vue'
import type { MentionItem } from '../types'

const noop = () => {}

export function createMentionExtension(onSearch: (query: string) => Promise<MentionItem[]>) {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: {
      items: (_props: { query: string }) => {
        return [] as MentionItem[]
      },
      render: () => {
        let app: App | undefined
        let container: HTMLElement | undefined
        let currentCommand: ((item: MentionNodeAttrs) => void) | null = null
        let getRect: (() => DOMRect | null) | null = null
        let searchAbort: AbortController | null = null

        // Reactive state shared with the MeldUI Mention primitives. The editor
        // owns the input (ProseMirror), so we drive the dropdown by providing a
        // context that satisfies MentionContent / MentionItem / MentionLoading /
        // MentionEmpty — the parts of the design-system component we reuse here.
        const open = ref(false)
        const items = ref<MentionItemData[]>([])
        const loading = ref(false)
        const highlightedIndex = ref(0)
        const virtualAnchor = ref<{ getBoundingClientRect: () => DOMRect } | null>(null)
        const contentRef = ref<HTMLElement | null>(null)

        const enabledItems = () => items.value.filter((item) => !item.disabled)

        const setHighlightedIndex = (index: number) => {
          const enabled = enabledItems()
          if (!enabled.length) return
          highlightedIndex.value = ((index % enabled.length) + enabled.length) % enabled.length
        }

        const selectItem = (item: MentionItemData) => {
          currentCommand?.({ id: String(item.value), label: item.label })
          open.value = false
        }

        async function fetchItems(query: string) {
          searchAbort?.abort()
          searchAbort = new AbortController()
          loading.value = true
          items.value = []
          try {
            const results = await onSearch(query)
            if (!searchAbort.signal.aborted) {
              items.value = results.map((r) => ({ value: r.id, label: r.label }))
              highlightedIndex.value = 0
            }
          } catch {
            // Ignore aborted requests
          } finally {
            if (!searchAbort.signal.aborted) {
              loading.value = false
            }
          }
        }

        // Re-point the virtual anchor at the current caret. Reassigning the ref
        // (not just the inner fn) lets Floating UI inside MentionContent recompute
        // placement as the query grows.
        const setAnchor = () => {
          virtualAnchor.value = {
            getBoundingClientRect: () => getRect?.() ?? new DOMRect(),
          }
        }

        // Full MentionContext: the four primitives we render only read a subset
        // (open, items, loading, highlightedIndex, virtualAnchor, selectItem,
        // setHighlightedIndex, setItems/setLoading, contentRef). The rest belong
        // to the input-driven root component and are inert stubs here.
        const context: MentionContext = {
          open,
          inputValue: ref(''),
          mentions: ref([]),
          highlightedIndex,
          activeTrigger: ref<string | null>('@'),
          searchQuery: ref(''),
          triggers: ref([{ char: '@' }]),
          disabled: ref(false),
          readonly: ref(false),
          multiline: ref(false),
          loop: ref(true),
          dir: ref<'ltr' | 'rtl'>('ltr'),
          placeholder: ref(''),
          items,
          setItems: (newItems) => {
            items.value = newItems
            highlightedIndex.value = 0
          },
          loading,
          setLoading: (value) => {
            loading.value = value
          },
          selectItem,
          removeMention: noop,
          setHighlightedIndex,
          openPopover: noop,
          closePopover: () => {
            open.value = false
          },
          updateSearchQuery: noop,
          handleInputChange: noop,
          handleBackspace: () => false,
          handleKeyDown: () => false,
          inputRef: ref(null),
          contentRef,
          inputId: 'meld-editor-mention',
          labelId: 'meld-editor-mention-label',
          virtualAnchor: virtualAnchor as MentionContext['virtualAnchor'],
          triggerPosition: ref(0),
        }

        return {
          onStart: (props: {
            command: (item: MentionNodeAttrs) => void
            clientRect?: (() => DOMRect | null) | null
            editor: { view: { dom: HTMLElement } }
            query: string
          }) => {
            currentCommand = props.command
            getRect = props.clientRect ?? null
            setAnchor()
            open.value = true
            fetchItems(props.query)

            const editorWrap = props.editor.view.dom.closest('[data-meld-editor]') ?? document.body
            container = document.createElement('div')
            editorWrap.appendChild(container)

            app = createApp(MentionList)
            app.provide(MENTION_INJECTION_KEY, context)
            app.mount(container)
          },

          onUpdate: (props: {
            command: (item: MentionNodeAttrs) => void
            clientRect?: (() => DOMRect | null) | null
            query: string
          }) => {
            currentCommand = props.command
            getRect = props.clientRect ?? null
            setAnchor()
            fetchItems(props.query)
          },

          onKeyDown: (props: { event: KeyboardEvent }) => {
            if (!open.value) return false
            const enabled = enabledItems()

            switch (props.event.key) {
              case 'ArrowDown':
                props.event.preventDefault()
                setHighlightedIndex(highlightedIndex.value + 1)
                return true
              case 'ArrowUp':
                props.event.preventDefault()
                setHighlightedIndex(highlightedIndex.value - 1)
                return true
              case 'Enter':
              case 'Tab':
                if (enabled[highlightedIndex.value]) {
                  props.event.preventDefault()
                  selectItem(enabled[highlightedIndex.value])
                  return true
                }
                return false
              case 'Escape':
                props.event.preventDefault()
                open.value = false
                return true
            }
            return false
          },

          onExit: () => {
            searchAbort?.abort()
            open.value = false
            app?.unmount()
            container?.remove()
            app = undefined
            container = undefined
            currentCommand = null
            getRect = null
          },
        }
      },
      command: ({
        editor,
        range,
        props,
      }: {
        editor: Editor
        range: { from: number; to: number }
        props: MentionNodeAttrs
      }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent([
            { type: 'mention', attrs: { id: props.id ?? '', label: props.label } },
            { type: 'text', text: ' ' },
          ])
          .run()
      },
    },
  })
}
