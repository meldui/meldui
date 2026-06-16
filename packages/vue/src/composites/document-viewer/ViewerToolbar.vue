<script setup lang="ts">
/**
 * ViewerToolbar — sticky top toolbar.
 *
 * Mirrors doqo's `ViewerToolbar.vue` layout precisely: sticky `z-30`, responsive
 * `lg:` breakpoint, mobile overflow menu. Button groups appear in canonical
 * left-to-right order (page-nav → zoom → rotate → view-mode → interaction
 * → search → panels → annotate → actions).
 *
 * Plugin wiring is intentionally minimal in this file — the toolbar emits
 * intent events and accepts state props; DocumentViewer.vue subscribes to the
 * EmbedPDF plugins and pipes their state in / their handlers out.
 */
import { computed, ref, watch } from 'vue'
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconBookmarks,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCursorText,
  IconDots,
  IconDownload,
  IconHandStop,
  IconHighlight,
  IconLayoutColumns,
  IconLayoutGrid,
  IconLayoutSidebar,
  IconMessage,
  IconMessageCirclePlus,
  IconPrinter,
  IconRotate,
  IconRotateClockwise,
  IconSearch,
  IconZoomIn,
  IconZoomOut,
} from '@meldui/tabler-vue'
import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Popover, PopoverAnchor, PopoverContent } from '../../components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip'
import { cn } from '../../lib/utils'
import SearchPopover from './SearchPopover.vue'
import type {
  DocumentType,
  InteractionMode,
  Scale,
  ViewerFeatures,
  ToolbarConfig,
  ViewMode,
  ZoomPreset,
} from './types'

interface Props {
  features: Required<ViewerFeatures>
  documentType: DocumentType
  config?: ToolbarConfig

  // View state (typically forwarded from EmbedPDF plugin composables)
  currentPage?: number
  totalPages?: number
  currentScale?: number
  viewMode?: ViewMode
  interactionMode?: InteractionMode

  // Panel open state
  isOutlineOpen?: boolean
  isThumbnailsOpen?: boolean
  isCommentsOpen?: boolean
  isSearchOpen?: boolean

  // Fullscreen state — toolbar swaps icon between Maximize and Minimize
  isFullscreen?: boolean

  // Annotation tool state
  activeAnnotationTool?: string | null

  // Search state (forwarded from the renderer; used by the default search popover)
  searchTotal?: number
  searchActiveIndex?: number
  searchMatchCase?: boolean
  searchWholeWord?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1,
  currentScale: 1,
  viewMode: 'continuous',
  interactionMode: 'text',
  isOutlineOpen: false,
  isThumbnailsOpen: false,
  isCommentsOpen: false,
  isSearchOpen: false,
  isFullscreen: false,
  activeAnnotationTool: null,
  searchTotal: 0,
  searchActiveIndex: -1,
  searchMatchCase: false,
  searchWholeWord: false,
  config: () => ({}),
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'zoom-in'): void
  (e: 'zoom-out'): void
  (e: 'request-zoom', level: Scale): void
  (e: 'rotate', direction: 'cw' | 'ccw'): void
  (e: 'view-mode-change', mode: ViewMode): void
  (e: 'interaction-mode-change', mode: InteractionMode): void
  (e: 'toggle-panel', panel: 'outline' | 'thumbnails' | 'comments' | 'search'): void
  (e: 'set-annotation-tool', tool: string | null): void
  (e: 'print'): void
  (e: 'download'): void
  (e: 'fullscreen'): void
  // Search
  (e: 'search', keyword: string): void
  (e: 'next-match'): void
  (e: 'previous-match'): void
  (e: 'set-match-case', enabled: boolean): void
  (e: 'set-whole-word', enabled: boolean): void
}>()

const isPdfType = computed(() => props.documentType === 'pdf')
// Rotation is meaningful for PDFs and images (ImageViewer applies a CSS
// `rotate()` transform). Text/markdown renderers don't take a rotation prop.
const canRotate = computed(
  () => props.documentType === 'pdf' || props.documentType === 'image',
)
const isSearchableType = computed(
  () =>
    props.documentType === 'pdf' ||
    props.documentType === 'text' ||
    props.documentType === 'markdown',
)

// Each group can be hidden via the consumer's toolbar config.
function isGroupVisible(group: string): boolean {
  if (!props.config.groups) return true
  return props.config.groups.includes(group as never)
}

function isButtonHidden(id: string): boolean {
  return props.config.hide?.includes(id) ?? false
}

const zoomPercent = computed(() => `${Math.round(props.currentScale * 100)}%`)

function nextPage() {
  if (props.currentPage < props.totalPages) emit('page-change', props.currentPage + 1)
}
function prevPage() {
  if (props.currentPage > 1) emit('page-change', props.currentPage - 1)
}

function toggleViewMode() {
  // Toggle between EmbedPDF's two supported modes. Single-page mode is not
  // offered (EmbedPDF has no native single-page concept; we stick to what
  // the underlying plugins provide).
  const next: ViewMode = props.viewMode === 'continuous' ? 'spread' : 'continuous'
  emit('view-mode-change', next)
}

function toggleInteraction() {
  emit('interaction-mode-change', props.interactionMode === 'text' ? 'hand' : 'text')
}

// Page input — local mirror of currentPage so the user can edit freely and
// commit on Enter. Out-of-range values reset to the current page on commit.
const pageInputValue = ref<number>(props.currentPage)
watch(
  () => props.currentPage,
  (next) => {
    pageInputValue.value = next
  },
)
function commitPageInput(e: KeyboardEvent) {
  if (e.key !== 'Enter') return
  const target = e.target as HTMLInputElement
  const next = Number(pageInputValue.value)
  if (Number.isFinite(next) && next >= 1 && next <= props.totalPages) {
    emit('page-change', Math.floor(next))
  } else {
    pageInputValue.value = props.currentPage
  }
  target.blur()
}

// Zoom presets — match doqo's numeric percentages plus EmbedPDF's fit/auto
// modes (engine-supported, surfaced through the toolbar so consumers don't
// have to wire request-zoom themselves).
interface ZoomPresetItem {
  label: string
  value: Scale
  kind: 'mode' | 'percent'
}
const ZOOM_PRESETS: ReadonlyArray<ZoomPresetItem> = [
  { label: 'Fit Width', value: 'fit-width' satisfies ZoomPreset, kind: 'mode' },
  { label: 'Fit Page', value: 'fit-page' satisfies ZoomPreset, kind: 'mode' },
  { label: '50%', value: 0.5, kind: 'percent' },
  { label: '75%', value: 0.75, kind: 'percent' },
  { label: '100%', value: 1, kind: 'percent' },
  { label: '125%', value: 1.25, kind: 'percent' },
  { label: '150%', value: 1.5, kind: 'percent' },
  { label: '200%', value: 2, kind: 'percent' },
] as const
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <div
      class="viewer-toolbar sticky top-0 z-30 flex items-center gap-1 border-b border-border bg-background px-2 py-1.5"
      role="toolbar"
      aria-label="Document viewer toolbar"
    >
      <!-- Page navigation -->
      <div
        v-if="features.outline === false || features.thumbnails === false ? true : true"
        v-show="isGroupVisible('pageNav') && isPdfType"
        class="flex items-center gap-0.5"
      >
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('prev-page')"
              variant="ghost"
              size="icon-sm"
              :disabled="currentPage <= 1"
              aria-label="Previous page"
              @click="prevPage"
            >
              <IconChevronLeft :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous page</TooltipContent>
        </Tooltip>
        <div class="flex items-center gap-1 px-1">
          <input
            v-model.number="pageInputValue"
            type="number"
            :min="1"
            :max="totalPages"
            :aria-label="`Page number, ${currentPage} of ${totalPages}`"
            class="h-6 w-10 rounded border border-input bg-background text-center text-xs tabular-nums [appearance:textfield] focus:outline-none focus:ring-1 focus:ring-ring [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            @keydown="commitPageInput"
          />
          <span class="text-xs tabular-nums text-muted-foreground" aria-hidden="true">
            / {{ totalPages }}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('next-page')"
              variant="ghost"
              size="icon-sm"
              :disabled="currentPage >= totalPages"
              aria-label="Next page"
              @click="nextPage"
            >
              <IconChevronRight :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next page</TooltipContent>
        </Tooltip>
      </div>

      <!-- Zoom -->
      <div v-if="features.zoom" v-show="isGroupVisible('zoom')" class="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('zoom-out')"
              variant="ghost"
              size="icon-sm"
              aria-label="Zoom out"
              @click="emit('zoom-out')"
            >
              <IconZoomOut :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom out</TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              v-show="!isButtonHidden('zoom-preset')"
              variant="ghost"
              size="sm"
              class="h-7 min-w-14 px-1 text-xs tabular-nums text-muted-foreground"
              aria-label="Zoom level"
            >
              {{ zoomPercent }}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <template v-for="(preset, i) in ZOOM_PRESETS" :key="String(preset.value)">
              <DropdownMenuSeparator v-if="i > 0 && preset.kind !== ZOOM_PRESETS[i - 1].kind" />
              <DropdownMenuItem @click="emit('request-zoom', preset.value)">
                {{ preset.label }}
              </DropdownMenuItem>
            </template>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('zoom-in')"
              variant="ghost"
              size="icon-sm"
              aria-label="Zoom in"
              @click="emit('zoom-in')"
            >
              <IconZoomIn :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom in</TooltipContent>
        </Tooltip>
      </div>

      <!-- Rotation (desktop only) -->
      <div
        v-if="features.rotate && canRotate"
        v-show="isGroupVisible('rotate')"
        class="hidden items-center gap-0.5 lg:flex"
      >
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('rotate-ccw')"
              variant="ghost"
              size="icon-sm"
              aria-label="Rotate left"
              @click="emit('rotate', 'ccw')"
            >
              <IconRotate :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('rotate-cw')"
              variant="ghost"
              size="icon-sm"
              aria-label="Rotate right"
              @click="emit('rotate', 'cw')"
            >
              <IconRotateClockwise :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate right</TooltipContent>
        </Tooltip>
      </div>

      <!-- View mode (desktop only, PDF only) -->
      <Tooltip v-if="isPdfType">
        <TooltipTrigger as-child>
          <Button
            v-show="isGroupVisible('viewMode') && !isButtonHidden('view-mode')"
            variant="ghost"
            size="icon-sm"
            class="hidden lg:inline-flex"
            :aria-label="`Switch view mode (currently ${viewMode})`"
            @click="toggleViewMode"
          >
            <IconLayoutGrid v-if="viewMode === 'continuous'" :size="16" />
            <IconLayoutColumns v-else :size="16" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View mode: {{ viewMode }}</TooltipContent>
      </Tooltip>

      <!-- Interaction mode (desktop only, PDF only) -->
      <Tooltip v-if="features.pan && isPdfType">
        <TooltipTrigger as-child>
          <Button
            v-show="isGroupVisible('interactionMode') && !isButtonHidden('interaction-mode')"
            variant="ghost"
            size="icon-sm"
            class="hidden lg:inline-flex"
            :aria-pressed="interactionMode === 'hand'"
            :aria-label="`Switch interaction mode (currently ${interactionMode})`"
            @click="toggleInteraction"
          >
            <IconHandStop v-if="interactionMode === 'hand'" :size="16" />
            <IconCursorText v-else :size="16" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{
          interactionMode === 'hand' ? 'Hand tool' : 'Text select'
        }}</TooltipContent>
      </Tooltip>

      <span class="flex-1" />

      <!-- Search -->
      <Popover
        v-if="features.search && isSearchableType"
        :open="isSearchOpen"
        @update:open="(v) => v !== isSearchOpen && emit('toggle-panel', 'search')"
      >
        <!--
          The search button wants a Tooltip AND opens the popover. Wrapping one
          Button in both `TooltipTrigger as-child` and `PopoverTrigger as-child`
          (or nesting them) breaks Reka's popover anchor (renders off-screen).
          So we anchor the popover with <PopoverAnchor> and give the Button only
          the tooltip's single `as-child`. Open is controlled via `isSearchOpen`;
          the click only OPENS (closing is handled by the popover's
          interact-outside → @update:open) to avoid a double-toggle.
        -->
        <PopoverAnchor class="inline-flex">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                v-show="isGroupVisible('search') && !isButtonHidden('search')"
                variant="ghost"
                size="icon-sm"
                :aria-pressed="isSearchOpen"
                aria-label="Search"
                @click="!isSearchOpen && emit('toggle-panel', 'search')"
              >
                <IconSearch :size="16" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Search (Ctrl+F)</TooltipContent>
          </Tooltip>
        </PopoverAnchor>
        <PopoverContent
          align="end"
          :side-offset="8"
          class="w-[calc(100vw-1rem)] sm:w-auto max-w-md p-2"
        >
          <slot name="search-content">
            <SearchPopover
              :total="searchTotal"
              :active-result-index="searchActiveIndex"
              :match-case="searchMatchCase"
              :whole-word="searchWholeWord"
              @search="(q) => emit('search', q)"
              @next-match="emit('next-match')"
              @previous-match="emit('previous-match')"
              @set-match-case="(v) => emit('set-match-case', v)"
              @set-whole-word="(v) => emit('set-whole-word', v)"
              @close="emit('toggle-panel', 'search')"
            />
          </slot>
        </PopoverContent>
      </Popover>

      <!-- Panels (desktop only, PDF only) -->
      <div
        v-if="isPdfType"
        v-show="isGroupVisible('panels')"
        class="hidden items-center gap-0.5 lg:flex"
      >
        <Tooltip v-if="features.thumbnails">
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('thumbnails')"
              variant="ghost"
              size="icon-sm"
              :aria-pressed="isThumbnailsOpen"
              aria-label="Thumbnails (T)"
              :class="cn(isThumbnailsOpen && 'bg-accent text-accent-foreground')"
              @click="emit('toggle-panel', 'thumbnails')"
            >
              <IconLayoutSidebar :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Thumbnails (T)</TooltipContent>
        </Tooltip>
        <Tooltip v-if="features.outline">
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('outline')"
              variant="ghost"
              size="icon-sm"
              :aria-pressed="isOutlineOpen"
              aria-label="Outline (O)"
              :class="cn(isOutlineOpen && 'bg-accent text-accent-foreground')"
              @click="emit('toggle-panel', 'outline')"
            >
              <IconBookmarks :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Outline (O)</TooltipContent>
        </Tooltip>
        <Tooltip v-if="features.commentThreads">
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('comments')"
              variant="ghost"
              size="icon-sm"
              :aria-pressed="isCommentsOpen"
              aria-label="Annotations (C)"
              :class="cn(isCommentsOpen && 'bg-accent text-accent-foreground')"
              @click="emit('toggle-panel', 'comments')"
            >
              <IconMessage :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Annotations (C)</TooltipContent>
        </Tooltip>
      </div>

      <!-- Annotation tools (desktop only, PDF only) -->
      <div
        v-if="isPdfType && features.annotations"
        v-show="isGroupVisible('annotate')"
        class="hidden items-center gap-0.5 lg:flex"
      >
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon-sm"
              :aria-pressed="activeAnnotationTool === 'highlight'"
              aria-label="Highlight tool"
              :class="
                cn(activeAnnotationTool === 'highlight' && 'bg-accent text-accent-foreground')
              "
              @click="
                emit(
                  'set-annotation-tool',
                  activeAnnotationTool === 'highlight' ? null : 'highlight',
                )
              "
            >
              <IconHighlight :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Highlight</TooltipContent>
        </Tooltip>
        <!--
          Comment-creation tool. Mirrors the Highlight tool's gating — only
          the parent group's `features.annotations` flag controls
          visibility. `commentThreads` is reserved for the built-in side
          panel, so consumers hosting their own annotations panel still
          get this tool whenever annotations are enabled.
        -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon-sm"
              :aria-pressed="activeAnnotationTool === 'comment'"
              aria-label="Add comment"
              :class="cn(activeAnnotationTool === 'comment' && 'bg-accent text-accent-foreground')"
              @click="
                emit('set-annotation-tool', activeAnnotationTool === 'comment' ? null : 'comment')
              "
            >
              <IconMessageCirclePlus :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add comment</TooltipContent>
        </Tooltip>
      </div>

      <!-- Custom buttons from consumer config -->
      <Tooltip v-for="btn in config.customButtons ?? []" :key="btn.id">
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon-sm"
            :aria-pressed="btn.isActive?.()"
            :aria-label="btn.label"
            :disabled="btn.isDisabled?.()"
            @click="btn.onClick"
          >
            <slot :name="`icon-${btn.id}`" v-bind="btn">
              <IconDots :size="16" />
            </slot>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{{ btn.label }}</TooltipContent>
      </Tooltip>

      <!-- Actions (desktop only) -->
      <div v-show="isGroupVisible('actions')" class="hidden items-center gap-0.5 lg:flex">
        <Tooltip v-if="features.download">
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('download')"
              variant="ghost"
              size="icon-sm"
              aria-label="Download"
              @click="emit('download')"
            >
              <IconDownload :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>
        <Tooltip v-if="features.print">
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('print')"
              variant="ghost"
              size="icon-sm"
              aria-label="Print"
              @click="emit('print')"
            >
              <IconPrinter :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print</TooltipContent>
        </Tooltip>
        <Tooltip v-if="features.fullscreen">
          <TooltipTrigger as-child>
            <Button
              v-show="!isButtonHidden('fullscreen')"
              variant="ghost"
              size="icon-sm"
              :aria-pressed="isFullscreen"
              :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen (F11)'"
              @click="emit('fullscreen')"
            >
              <IconArrowsMinimize v-if="isFullscreen" :size="16" />
              <IconArrowsMaximize v-else :size="16" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{
            isFullscreen ? 'Exit fullscreen' : 'Fullscreen (F11)'
          }}</TooltipContent>
        </Tooltip>
      </div>

      <!-- Mobile overflow menu -->
      <!--
        DropdownMenuTrigger must be the only `as-child` wrapper around the
        Button. Double-wrapping with TooltipTrigger AND DropdownMenuTrigger
        both as-child confuses Reka's anchor resolution (the menu renders
        off-screen and never appears). We drop the Tooltip here; the
        title attribute provides the discoverability hint. Same fix as the
        search popover above.
      -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon-sm"
            class="lg:hidden"
            aria-label="More actions"
            title="More actions"
          >
            <IconDots :size="16" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <!-- Rotation -->
          <DropdownMenuItem v-if="features.rotate && canRotate" @click="emit('rotate', 'ccw')">
            <IconRotate :size="16" />
            <span class="flex-1">Rotate left</span>
          </DropdownMenuItem>
          <DropdownMenuItem v-if="features.rotate && canRotate" @click="emit('rotate', 'cw')">
            <IconRotateClockwise :size="16" />
            <span class="flex-1">Rotate right</span>
          </DropdownMenuItem>

          <!-- View / interaction modes -->
          <DropdownMenuItem v-if="isPdfType" @click="toggleViewMode">
            <IconLayoutGrid v-if="viewMode === 'continuous'" :size="16" />
            <IconLayoutColumns v-else :size="16" />
            <span class="flex-1">{{
              viewMode === 'continuous' ? 'Continuous scroll' : 'Spread view'
            }}</span>
            <IconCheck v-if="viewMode === 'spread'" :size="16" class="text-primary" />
          </DropdownMenuItem>
          <DropdownMenuItem v-if="features.pan && isPdfType" @click="toggleInteraction">
            <IconHandStop v-if="interactionMode === 'hand'" :size="16" />
            <IconCursorText v-else :size="16" />
            <span class="flex-1">{{
              interactionMode === 'hand' ? 'Hand tool' : 'Text select'
            }}</span>
            <IconCheck v-if="interactionMode === 'hand'" :size="16" class="text-primary" />
          </DropdownMenuItem>

          <DropdownMenuSeparator v-if="isPdfType" />

          <!-- Panels -->
          <DropdownMenuItem
            v-if="features.thumbnails && isPdfType"
            @click="emit('toggle-panel', 'thumbnails')"
          >
            <IconLayoutSidebar :size="16" />
            <span class="flex-1">Thumbnails</span>
            <IconCheck v-if="isThumbnailsOpen" :size="16" class="text-primary" />
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="features.outline && isPdfType"
            @click="emit('toggle-panel', 'outline')"
          >
            <IconBookmarks :size="16" />
            <span class="flex-1">Outline</span>
            <IconCheck v-if="isOutlineOpen" :size="16" class="text-primary" />
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="features.commentThreads && isPdfType"
            @click="emit('toggle-panel', 'comments')"
          >
            <IconMessage :size="16" />
            <span class="flex-1">Annotations</span>
            <IconCheck v-if="isCommentsOpen" :size="16" class="text-primary" />
          </DropdownMenuItem>

          <DropdownMenuSeparator v-if="isPdfType && features.annotations" />

          <!-- Annotation tools (mobile parity with desktop annotate group) -->
          <DropdownMenuItem
            v-if="features.annotations && isPdfType"
            @click="
              emit('set-annotation-tool', activeAnnotationTool === 'highlight' ? null : 'highlight')
            "
          >
            <IconHighlight :size="16" />
            <span class="flex-1">Highlight text</span>
            <IconCheck
              v-if="activeAnnotationTool === 'highlight'"
              :size="16"
              class="text-primary"
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="features.annotations && isPdfType"
            @click="
              emit('set-annotation-tool', activeAnnotationTool === 'comment' ? null : 'comment')
            "
          >
            <IconMessageCirclePlus :size="16" />
            <span class="flex-1">Add comment</span>
            <IconCheck v-if="activeAnnotationTool === 'comment'" :size="16" class="text-primary" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <!-- Actions -->
          <DropdownMenuItem v-if="features.download" @click="emit('download')">
            <IconDownload :size="16" />
            <span class="flex-1">Download</span>
          </DropdownMenuItem>
          <DropdownMenuItem v-if="features.print" @click="emit('print')">
            <IconPrinter :size="16" />
            <span class="flex-1">Print</span>
          </DropdownMenuItem>
          <DropdownMenuItem v-if="features.fullscreen" @click="emit('fullscreen')">
            <IconArrowsMinimize v-if="isFullscreen" :size="16" />
            <IconArrowsMaximize v-else :size="16" />
            <span class="flex-1">{{ isFullscreen ? 'Exit fullscreen' : 'Fullscreen' }}</span>
            <IconCheck v-if="isFullscreen" :size="16" class="text-primary" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </TooltipProvider>
</template>
