import { Catalog, type FunctionImplementation } from '@a2ui/web_core/v0_9'
import * as basicCatalog from '@a2ui/web_core/v0_9/basic_catalog'
import { CATALOG_ID } from '../../constants'
import { MELDUI_COMPONENT_NAMES } from '../../catalog/index'
import type { VueComponentApi } from '../types'
import { textEntry } from './components/text'
import { markdownEntry } from './components/markdown'
import { columnEntry } from './components/column'
import { cardEntry } from './components/card'
import { buttonEntry } from './components/button'
import { textFieldEntry } from './components/text-field'
import { alertEntry } from './components/alert'
import { badgeEntry } from './components/badge'
import { avatarEntry } from './components/avatar'
import { avatarGroupEntry } from './components/avatar-group'
import { kbdEntry } from './components/kbd'
import { separatorEntry } from './components/separator'
import { dividerEntry } from './components/divider'
import { imageEntry } from './components/image'
import { rowEntry } from './components/row'
import { listEntry } from './components/list'
import { scrollAreaEntry } from './components/scroll-area'
import { buttonGroupEntry } from './components/button-group'
import { tableEntry } from './components/table'
import { checkBoxEntry } from './components/checkbox'
import { sliderEntry } from './components/slider'
import { choicePickerEntry } from './components/choice-picker'
import { toggleGroupEntry } from './components/toggle-group'
import { multiSelectEntry } from './components/multi-select'
import { dateTimeInputEntry } from './components/datetime-input'
import { tabsEntry } from './components/tabs'
import { accordionEntry } from './components/accordion'
import { modalEntry } from './components/modal'
import { carouselEntry } from './components/carousel'

/**
 * The MeldUI Vue renderer catalog. Vertical slice: a representative set proving
 * the end-to-end pipeline (display, streamed Markdown, layout-with-children,
 * single-child container, action, data-bound input). The remaining contract
 * components are added in a follow-up pass — see `pendingRendererComponents()`.
 */
export const meldVueCatalog: VueComponentApi[] = [
  textEntry,
  markdownEntry,
  columnEntry,
  cardEntry,
  buttonEntry,
  textFieldEntry,
  alertEntry,
  badgeEntry,
  avatarEntry,
  avatarGroupEntry,
  kbdEntry,
  separatorEntry,
  dividerEntry,
  imageEntry,
  rowEntry,
  listEntry,
  scrollAreaEntry,
  buttonGroupEntry,
  tableEntry,
  checkBoxEntry,
  sliderEntry,
  choicePickerEntry,
  toggleGroupEntry,
  multiSelectEntry,
  dateTimeInputEntry,
  tabsEntry,
  accordionEntry,
  modalEntry,
  carouselEntry,
]

/** Contract components not yet implemented by the Vue renderer. */
export function pendingRendererComponents(): string[] {
  const implemented = new Set(meldVueCatalog.map((entry) => entry.name))
  return MELDUI_COMPONENT_NAMES.filter((name) => !implemented.has(name))
}

function collectBasicFunctions(): FunctionImplementation[] {
  return Object.values(basicCatalog).filter(
    (v): v is FunctionImplementation =>
      !!v &&
      typeof v === 'object' &&
      typeof (v as { execute?: unknown }).execute === 'function' &&
      'name' in (v as object),
  )
}

/**
 * Builds the web_core `Catalog` for the renderer. Enforces that every renderer
 * component is a real component in the published `@meldui/a2ui` contract (so
 * the renderer can never drift away from the agent-facing catalog).
 */
export function buildVueCatalog(
  components: VueComponentApi[] = meldVueCatalog,
): Catalog<VueComponentApi> {
  const contract = new Set(MELDUI_COMPONENT_NAMES)
  const unknown = components.filter((c) => !contract.has(c.name)).map((c) => c.name)
  if (unknown.length > 0) {
    throw new Error(`[a2ui] renderer components not in the catalog contract: ${unknown.join(', ')}`)
  }
  return new Catalog<VueComponentApi>(CATALOG_ID, components, collectBasicFunctions())
}
