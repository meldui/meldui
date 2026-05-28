/**
 * Plugin registry — builds the EmbedPDF plugin registration list.
 *
 * **Phase 1 plugins are always registered.** This is a deliberate trade-off:
 * Vue's `setup()` hooks must call composables unconditionally (you can't put
 * `useZoom()` inside an `if`), but EmbedPDF composables throw "Plugin X not
 * found" when their plugin isn't registered. Always-on registration keeps
 * the controller logic simple and the programmatic API always available
 * regardless of which UI features the consumer exposes.
 *
 * The `features` prop therefore controls **toolbar visibility / UX**, not
 * plugin presence. Consumers who want true plugin-level tree-shaking should
 * use a different registry function (Phase 2 plugins below show the pattern).
 *
 * **Phase 2 plugins remain opt-in** — stamps, signature, redaction, forms,
 * and attachments are only registered when their flag is enabled. Most
 * consumers won't use them and they each pull in non-trivial dependencies.
 */
import { createPluginRegistration } from '@embedpdf/core'
import type { PluginBatchRegistrations } from '@embedpdf/core'

// Core (always-on)
import { DocumentManagerPluginPackage } from '@embedpdf/plugin-document-manager/vue'
import { ViewportPluginPackage } from '@embedpdf/plugin-viewport/vue'
import { ScrollPluginPackage } from '@embedpdf/plugin-scroll/vue'
import { RenderPluginPackage } from '@embedpdf/plugin-render/vue'
import { TilingPluginPackage } from '@embedpdf/plugin-tiling/vue'

// Phase 1 — view controls (always registered)
import { ZoomPluginPackage, ZoomMode, type ZoomLevel } from '@embedpdf/plugin-zoom/vue'
import { RotatePluginPackage } from '@embedpdf/plugin-rotate/vue'
import { SpreadPluginPackage } from '@embedpdf/plugin-spread/vue'
import { PanPluginPackage } from '@embedpdf/plugin-pan/vue'
import { FullscreenPluginPackage } from '@embedpdf/plugin-fullscreen/vue'
import { InteractionManagerPluginPackage } from '@embedpdf/plugin-interaction-manager/vue'
import { SelectionPluginPackage } from '@embedpdf/plugin-selection/vue'
import { SearchPluginPackage } from '@embedpdf/plugin-search/vue'
import { BookmarkPluginPackage } from '@embedpdf/plugin-bookmark/vue'
import { ThumbnailPluginPackage } from '@embedpdf/plugin-thumbnail/vue'
import { ExportPluginPackage } from '@embedpdf/plugin-export/vue'
import { PrintPluginPackage } from '@embedpdf/plugin-print/vue'
import { CommandsPluginPackage } from '@embedpdf/plugin-commands/vue'

// Phase 1 — annotations (always registered)
import { AnnotationPluginPackage } from '@embedpdf/plugin-annotation/vue'
import { HistoryPluginPackage } from '@embedpdf/plugin-history/vue'

// Phase 2 — editing (opt-in)
import { StampPluginPackage } from '@embedpdf/plugin-stamp/vue'
import { SignaturePluginPackage } from '@embedpdf/plugin-signature/vue'
import { RedactionPluginPackage } from '@embedpdf/plugin-redaction/vue'
import { FormPluginPackage } from '@embedpdf/plugin-form/vue'
import { AttachmentPluginPackage } from '@embedpdf/plugin-attachment/vue'

import type { DocumentSource, FeatureConfig, ViewerFeatures, ZoomPreset } from '../types'

/**
 * Map a {@link ZoomPreset} to EmbedPDF's `ZoomLevel`. Defaults to fit-page so
 * a freshly-opened document fits the viewport instead of rendering at 100%
 * (which often overflows). Consumers override via `featureConfig.zoom.defaultMode`.
 */
function resolveDefaultZoom(preset: ZoomPreset | undefined): ZoomLevel {
  switch (preset) {
    case 'fit-width':
      return ZoomMode.FitWidth
    case 'actual-size':
      return 1
    default:
      return ZoomMode.FitPage
  }
}

/** Default feature flags — sensible defaults for a typical PDF viewer. */
export const DEFAULT_FEATURES: Required<ViewerFeatures> = {
  zoom: true,
  rotate: true,
  spread: false,
  pan: true,
  fullscreen: true,
  search: true,
  selection: true,
  outline: true,
  thumbnails: true,
  print: true,
  download: true,
  annotations: false,
  commentThreads: false,
  undoRedo: false,
  stamps: false,
  signature: false,
  redaction: false,
  forms: false,
  attachments: false,
  keyboardShortcuts: true,
  touchGestures: true,
}

/** Resolve user-provided features against defaults. */
export function resolveFeatures(features: ViewerFeatures | undefined): Required<ViewerFeatures> {
  return { ...DEFAULT_FEATURES, ...features }
}

interface BuildPluginsOptions {
  features: Required<ViewerFeatures>
  config: FeatureConfig
  /** Initial document URL — passed to DocumentManager. */
  source: DocumentSource
}

/**
 * Build the plugin registration list for `<EmbedPDF :plugins="...">`.
 *
 * Dependency order is significant — EmbedPDF requires:
 *   - DocumentManager + render core first
 *   - InteractionManager + Selection + History before Annotation
 *   - Annotation before Stamp/Signature/Redaction
 */
export function buildPlugins({
  features,
  config,
  source,
}: BuildPluginsOptions): PluginBatchRegistrations {
  const plugins: PluginBatchRegistrations = []

  // Always-on core. We only seed `initialDocuments` from a URL string here;
  // File/Blob/ArrayBuffer sources are loaded imperatively by PdfViewer
  // once the engine is ready.
  const initialDocuments = typeof source === 'string' ? [{ url: source }] : []
  plugins.push(
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments,
    }),
  )
  plugins.push(createPluginRegistration(ViewportPluginPackage))
  plugins.push(createPluginRegistration(ScrollPluginPackage))
  plugins.push(createPluginRegistration(RenderPluginPackage))
  plugins.push(createPluginRegistration(TilingPluginPackage))

  // Phase 1 view controls — always registered (toolbar visibility is gated
  // by `features` separately so the composables they expose are safe to call).
  plugins.push(
    createPluginRegistration(ZoomPluginPackage, {
      defaultZoomLevel: resolveDefaultZoom(config.zoom?.defaultMode),
      minZoom: config.zoom?.min,
      maxZoom: config.zoom?.max,
    }),
  )
  plugins.push(createPluginRegistration(RotatePluginPackage))
  plugins.push(createPluginRegistration(SpreadPluginPackage))
  plugins.push(createPluginRegistration(PanPluginPackage))
  plugins.push(createPluginRegistration(FullscreenPluginPackage))
  plugins.push(createPluginRegistration(InteractionManagerPluginPackage))
  plugins.push(createPluginRegistration(SelectionPluginPackage))
  plugins.push(createPluginRegistration(SearchPluginPackage))
  plugins.push(createPluginRegistration(BookmarkPluginPackage))
  plugins.push(createPluginRegistration(ThumbnailPluginPackage))
  plugins.push(createPluginRegistration(ExportPluginPackage))
  plugins.push(createPluginRegistration(PrintPluginPackage))
  // Commands plugin: keyboard shortcuts + single command registry consumed
  // by both the keyboard bridge and (later) the toolbar.
  plugins.push(createPluginRegistration(CommandsPluginPackage, { commands: {} }))

  // Phase 1 annotations — always registered (the programmatic CRUD API
  // depends on these even when the toolbar tools are hidden).
  plugins.push(createPluginRegistration(HistoryPluginPackage))
  plugins.push(
    createPluginRegistration(AnnotationPluginPackage, {
      annotationAuthor: config.annotations?.author,
    }),
  )

  // ─── Phase 2 plugins remain opt-in ───────────────────────────────────────

  if (features.stamps) {
    plugins.push(
      createPluginRegistration(StampPluginPackage, {
        libraries: config.stamps?.libraries,
        defaultLibrary: config.stamps?.defaultLibrary,
      } as Record<string, unknown>),
    )
  }
  if (features.signature) plugins.push(createPluginRegistration(SignaturePluginPackage))
  if (features.redaction) {
    plugins.push(
      createPluginRegistration(RedactionPluginPackage, {
        useAnnotationMode: config.redaction?.useAnnotationMode ?? true,
      }),
    )
  }
  if (features.forms) plugins.push(createPluginRegistration(FormPluginPackage))
  if (features.attachments) plugins.push(createPluginRegistration(AttachmentPluginPackage))

  return plugins
}
