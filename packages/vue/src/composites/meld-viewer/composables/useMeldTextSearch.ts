/**
 * useMeldTextSearch — DOM-based search highlighting for the text and
 * markdown renderers. The PDF renderer gets full-text search from the
 * `@embedpdf/plugin-search` SearchLayer; this composable provides the
 * equivalent for non-PDF documents.
 *
 * Walks text nodes via `TreeWalker`, wraps matches in `<mark>` elements,
 * and scrolls the active match into view. The exposed methods mirror the
 * PDF controller's search surface (`searchKeyword`, `nextMatch`,
 * `previousMatch`, `setMatchCase`, `setWholeWord`, `clearSearch`) so
 * `MeldViewer` can dispatch search calls to whichever renderer is active
 * without branching on document type at the call site.
 *
 * Highlight colours match the PDF SearchLayer (yellow for matches, orange
 * for the active match) so search visuals are consistent across types.
 */
import { nextTick, readonly, ref, watch, type Ref } from 'vue'

const HIGHLIGHT_CLASS = 'meld-search-highlight'
const HIGHLIGHT_CURRENT_CLASS = 'meld-search-highlight-current'

export interface UseMeldTextSearchReturn {
  totalMatches: Readonly<Ref<number>>
  /** 1-based index of the active match; 0 when no match is active. */
  currentMatchIndex: Readonly<Ref<number>>
  matchCase: Readonly<Ref<boolean>>
  wholeWord: Readonly<Ref<boolean>>
  searchKeyword: (keyword: string) => void
  nextMatch: () => void
  previousMatch: () => void
  setMatchCase: (enabled: boolean) => void
  setWholeWord: (enabled: boolean) => void
  clearSearch: () => void
}

export function useMeldTextSearch(contentRef: Ref<HTMLElement | null>): UseMeldTextSearchReturn {
  const query = ref('')
  const matchCase = ref(false)
  const wholeWord = ref(false)
  const currentMatchIndex = ref(0)
  const totalMatches = ref(0)
  const highlightElements = ref<HTMLElement[]>([])

  function clearHighlights(): void {
    if (!contentRef.value) return
    const marks = contentRef.value.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`)
    marks.forEach((mark) => {
      const text = document.createTextNode(mark.textContent ?? '')
      mark.parentNode?.replaceChild(text, mark)
    })
    contentRef.value.normalize()
    highlightElements.value = []
    totalMatches.value = 0
  }

  function buildRegex(q: string, caseSensitive: boolean, wholeWordOnly: boolean): RegExp {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = wholeWordOnly ? `\\b${escaped}\\b` : escaped
    return new RegExp(pattern, caseSensitive ? 'g' : 'gi')
  }

  function highlightMatches(): void {
    clearHighlights()
    const root = contentRef.value
    const q = query.value.trim()
    if (!root || !q) return

    const regex = buildRegex(q, matchCase.value, wholeWord.value)
    const elements: HTMLElement[] = []

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT
        const parent = node.parentElement
        const tag = parent?.tagName
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MARK') {
          return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT
      },
    })

    const textNodes: Text[] = []
    let node: Node | null
    while ((node = walker.nextNode())) textNodes.push(node as Text)

    for (const textNode of textNodes) {
      const text = textNode.textContent ?? ''
      const matches: Array<{ start: number; end: number }> = []
      regex.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = regex.exec(text)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length })
        if (m[0].length === 0) regex.lastIndex++
      }
      if (matches.length === 0) continue

      const fragment = document.createDocumentFragment()
      let cursor = 0
      for (const { start, end } of matches) {
        if (start > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, start)))
        const mark = document.createElement('mark')
        mark.className = HIGHLIGHT_CLASS
        mark.textContent = text.slice(start, end)
        fragment.appendChild(mark)
        elements.push(mark)
        cursor = end
      }
      if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)))
      textNode.parentNode?.replaceChild(fragment, textNode)
    }

    highlightElements.value = elements
    totalMatches.value = elements.length
    if (elements.length === 0) {
      currentMatchIndex.value = 0
    } else if (currentMatchIndex.value === 0) {
      currentMatchIndex.value = 1
    } else if (currentMatchIndex.value > elements.length) {
      currentMatchIndex.value = elements.length
    }
    nextTick(() => scrollToCurrentMatch())
  }

  function scrollToCurrentMatch(): void {
    highlightElements.value.forEach((el) => el.classList.remove(HIGHLIGHT_CURRENT_CLASS))
    if (currentMatchIndex.value <= 0 || highlightElements.value.length === 0) return
    const el = highlightElements.value[currentMatchIndex.value - 1]
    if (!el) return
    el.classList.add(HIGHLIGHT_CURRENT_CLASS)
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  }

  watch([query, matchCase, wholeWord], () => {
    if (query.value.trim()) nextTick(() => highlightMatches())
    else clearHighlights()
  })

  watch(currentMatchIndex, () => {
    if (highlightElements.value.length > 0) scrollToCurrentMatch()
  })

  function searchKeyword(keyword: string): void {
    query.value = keyword
    if (!keyword) currentMatchIndex.value = 0
  }

  function nextMatch(): void {
    if (totalMatches.value === 0) return
    currentMatchIndex.value = (currentMatchIndex.value % totalMatches.value) + 1
  }

  function previousMatch(): void {
    if (totalMatches.value === 0) return
    currentMatchIndex.value =
      currentMatchIndex.value <= 1 ? totalMatches.value : currentMatchIndex.value - 1
  }

  function setMatchCase(enabled: boolean): void {
    matchCase.value = enabled
  }

  function setWholeWord(enabled: boolean): void {
    wholeWord.value = enabled
  }

  function clearSearch(): void {
    query.value = ''
    currentMatchIndex.value = 0
    clearHighlights()
  }

  return {
    totalMatches: readonly(totalMatches),
    currentMatchIndex: readonly(currentMatchIndex),
    matchCase: readonly(matchCase),
    wholeWord: readonly(wholeWord),
    searchKeyword,
    nextMatch,
    previousMatch,
    setMatchCase,
    setWholeWord,
    clearSearch,
  }
}
