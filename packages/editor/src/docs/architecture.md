# MeldEditor Architecture

> **Portability note:** This component is designed for eventual extraction to `@meldui/vue`. Keep it self-contained with no app-specific dependencies.

## System Overview

MeldEditor is a pluggable rich-text editor Vue 3 component built on three layers:

```
 Consumer App (Vue 3)
       |
       v
 +--------------------------+
 |     MeldEditor.vue       |  Props / Events / Slots / Expose
 +--------------------------+
       |
       v
 +----------+  +----------+  +----------+
 | tiptap   |  | MeldUI   |  | Tabler   |
 | (editor  |  | (UI      |  | (icons)  |
 |  engine) |  |  prims)  |  |          |
 +----------+  +----------+  +----------+
       |
       v
 +----------+
 |ProseMirror|  (document model, transactions, schema)
 +----------+
```

- **tiptap v3** -- Editor engine. Manages the document model, extensions, commands, and input handling.
- **@meldui/vue** -- UI primitives (Button, Toggle, Tooltip, Dialog, DropdownMenu, ScrollArea, Separator, Input). Provides consistent styling, accessibility, and dark mode support.
- **@meldui/tabler-vue** -- Icons. All editor icons use Tabler components instead of inline SVGs.
- **@meldui/charts-vue** -- Chart components. Renders data charts inside the editor as custom nodes.

---

## Component Hierarchy

```
MeldEditor.vue
 |
 +-- [header slot]                  (consumer-controlled: action buttons)
 |
 +-- EditorToolbar.vue              (slot: toolbar -- hidden by default)
 |    +-- MeldUI Toggle + Tooltip
 |    +-- Tabler Icons
 |
 +-- EditorContent (tiptap)         (core editor area)
 |
 +-- DragHandle.vue                 (block drag-and-drop)
 |    +-- Tabler IconPlus, IconGripVertical
 |
 +-- TextBubbleMenu.vue             (slot: bubble-menu)
 |    +-- tiptap BubbleMenu
 |    +-- MeldUI Toggle + Separator
 |    +-- Tabler Icons
 |
 +-- TableControls.vue              (table row/col handles)
 |    +-- MeldUI DropdownMenu
 |    +-- Tabler Icons
 |
 +-- ImageUrlDialog.vue             (replaces window.prompt)
 |    +-- MeldUI Dialog + Input + Button
 |
 +-- ResizableImageView.vue         (tiptap NodeView)
      +-- MeldUI Toggle + Button
      +-- Tabler Icons
      +-- Resize handles + Caption
```

### Sub-component Responsibilities

| Component               | Responsibility                                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `EditorToolbar`         | Renders toolbar items from `ToolbarItem[]` config. **Hidden by default** (Notion-like = bubble menu + slash commands). |
| `TextBubbleMenu`        | Text formatting popup on selection (bold, italic, align, etc.)                                                         |
| `DragHandle`            | Shows +/grip on block hover, handles drag-and-drop reordering                                                          |
| `TableControls`         | Row/column handles and context menu for table manipulation                                                             |
| `ResizableImageView`    | Image node view with resize handles, alignment, caption, bubble menu                                                   |
| `ImageUrlDialog`        | Modal dialog for entering image URL (Upload + Link tabs)                                                               |
| `SlashCommandExtension` | tiptap extension for `/` command suggestions                                                                           |
| `SlashCommandList`      | Popup list UI for slash command selection                                                                              |

---

## File Structure

```
frontend/src/components/editor/
  index.ts                        # Public exports
  MeldEditor.vue                  # Main component
  types.ts                        # TypeScript interfaces
  defaults.ts                     # Default extensions, toolbar, slash commands
  useBlockSelection.ts            # Block selection composable
  BlockSelectionPlugin.ts         # ProseMirror plugin
  toolbar/
    EditorToolbar.vue
  bubble-menu/
    TextBubbleMenu.vue
  drag-handle/
    DragHandle.vue
  slash-commands/
    SlashCommandExtension.ts
    SlashCommandList.vue
    defaultSlashCommands.ts
  mention/
    MentionExtension.ts
    MentionList.vue
  image/
    ResizableImageView.vue
    ResizableImageExtension.ts
    ImageUrlDialog.vue
  table/
    TableControls.vue
  chart/
    ChartNodeView.vue
    ChartConfigDialog.vue
    ChartNodeExtension.ts
    ChartPickerDialog.vue
  columns/
    ColumnBlockView.vue
    ColumnExtension.ts
    ColumnBlockExtension.ts
  toc/
    TocNodeView.vue
    TocExtension.ts
  custom-components/
    CustomNodeExtension.ts
    ConfirmDeleteDialog.vue
  docs/
    architecture.md               # This file
```

---

## Data Flow

### Content (v-model pattern)

```
Consumer                    MeldEditor                    tiptap
   |                            |                           |
   |-- modelValue (HTML) ------>|                           |
   |                            |-- useEditor({ content }) >|
   |                            |                           |
   |                            |<-- onUpdate --------------|
   |<-- emit update:modelValue -|                           |
   |<-- emit update:json -------|                           |
   |                            |                           |
   |-- modelValue changes ----->|                           |
   |                            |-- watch: setContent() --->|
```

- **Inbound:** `modelValue` prop (HTML string) initializes editor. Watched for external changes; calls `editor.commands.setContent()` when changed (skips if content matches).
- **Outbound:** tiptap's `onUpdate` callback emits both `update:modelValue` (HTML) and `update:json` (JSON) on every transaction.
- **No internal content state:** MeldEditor does not store content separately -- tiptap is the single source of truth.

### Extension Resolution (merge-by-default)

```
Props                              defaults.ts                    tiptap
  |                                    |                            |
  |-- overrideExtensions? ----------->| (if provided, use ONLY these)|
  |                                    |                            |
  |  (otherwise, merge-by-default)     |                            |
  |                                    |-- createDefaultExtensions()|
  |-- defaultExtensions? ------------>|    (apply opt-outs:         |
  |   { table: false, ... }           |     skip disabled ones)     |
  |                                    |                            |
  |-- extraExtensions? -------------->|    (append to defaults)     |
  |                                    |                            |
  |-- customComponents? ------------>|    (auto-generate Node exts) |
  |                                    |                            |
  |                                    |-- final extensions ------->|
```

**Extension strategy (matches tiptap's StarterKit pattern):**

- `defaultExtensions: { table: false }` -- disable individual defaults
- `extraExtensions: [MyCustomExt]` -- add alongside defaults
- `overrideExtensions: [...]` -- escape hatch, replaces ALL defaults

**Slash command strategy (same merge-by-default):**

- `extraSlashCommands: [...]` -- add to defaults
- `disableSlashCommands: ['Table', 'Image']` -- remove by title
- `overrideSlashCommands: [...]` -- escape hatch, replaces ALL defaults
- `customComponents` with `slashCommand` -- auto-appended to whatever list is active

---

## Extension Architecture

### Default Extensions (assembled by `defaults.ts`)

```ts
createDefaultExtensions({
  placeholder,
  slashCommands,
  onRequestImageUrl,
}) => [
  StarterKit,                           // Basic marks + nodes (includes Link, Underline)
  TaskList,
  TaskItem.configure({ nested: true }),
  ResizableImage.configure({ onRequestImageUrl }),
  Table.configure({ resizable: true }),
  TableRow, TableHeader, TableCell,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Placeholder.configure({ placeholder }),
  TableOfContents,
  TocNode,
  ChartNode,
  ColumnExtension, ColumnBlockExtension,
  BlockSelection,
  createSlashCommandExtension(slashCommands),
  createMentionExtension(onMentionSearch),
]
```

### Extension Override Strategy

| Prop                 | Behavior                                                                     |
| -------------------- | ---------------------------------------------------------------------------- |
| `overrideExtensions` | Use **only** these. No defaults. Full consumer control. Escape hatch.        |
| `defaultExtensions`  | Disable/configure individual defaults (e.g. `{ table: false }`).             |
| `extraExtensions`    | Additional extensions **merged** with defaults.                              |
| `customComponents`   | Auto-generate Node extensions + slash commands, **appended** to active list. |

### Custom Node Extension Factory

```
CustomComponentRegistration
  {
    name: 'myWidget',
    component: WidgetView,
    attrs: { widgetId: { default: null } },
    slashCommand: { title: 'Widget', icon: IconWidget, ... }
  }
       |
       v
createCustomNodeExtension(registration)
       |
       v
Node.create({
  name: registration.name,
  group: 'block',
  atom: true,
  addAttributes() => registration.attrs,
  addNodeView() => VueNodeViewRenderer(WrapperComponent)
})
       |
       v
WrapperComponent
  <NodeViewWrapper>
    <registration.component v-bind="nodeViewProps" />
  </NodeViewWrapper>
```

The wrapper component forwards all `nodeViewProps` (node, editor, updateAttributes, deleteNode, selected, getPos) to the consumer's component.

---

## Custom Components: Reference-Based Pattern

Custom components can follow two data patterns:

### 1. Inline-State (e.g., Chart)

The editor document stores the full state in node attributes. Simple, self-contained.

```json
{ "type": "meldChart", "attrs": { "chartType": "bar", "config": {...}, "height": 300 } }
```

### 2. Reference-Based (e.g., Poll, Form, Database)

The editor stores a lightweight entity ID. The component manages its own state externally via a reactive store.

```
Editor Document                    Custom Node View              Entity Store
  { type: "poll",                    PollNodeView.vue             reactive Map
    attrs: {           ------>       - reads entityId    ------>   poll-abc => {
      entityId: "abc"                - fetches from store           question: "...",
    }                                - manages all UI               options: [...]
  }                                                               }
```

**Key principle:** Interactions (voting, editing) do not touch the editor document. Only `updateAttributes()` is called once on creation to persist the reference. All subsequent interactions go through the external store.

### Data Flow: Insert

```
User types /poll --> SlashCommand inserts node with entityId: null
  --> NodeView mounts, sees null --> opens SetupDialog
  --> User fills form, clicks Create
  --> store.createPoll(data) --> returns "poll-abc123"
  --> updateAttributes({ entityId: "poll-abc123" })
  --> NodeView re-renders with active state
```

### Data Flow: Rehydration

```
Editor loads JSON with { entityId: "poll-abc123" }
  --> NodeView mounts, reads entityId
  --> store.getPoll("poll-abc123")
  --> found? render full state : render "Not found" placeholder
```

### Entity Store Pattern

```typescript
// Singleton per entity type, reactive Map
const store = reactive(new Map<string, PollEntity>())

// Fine-grained reactivity:
// - store.get(id) returns reactive object
// - Object.assign(entity, updates) triggers re-renders
// - store.delete(id) causes get(id) to return undefined
```

Multiple component instances sharing the same store type get the same singleton Map. Changes to one entity do not affect others.

### Prefetch Optimization (production)

Extract entity IDs from document JSON before loading content, then prefetch in parallel:

```typescript
function extractEntityIds(doc: any): string[] {
  const ids: string[] = []
  function walk(node: any) {
    if (node.attrs?.entityId) ids.push(node.attrs.entityId)
    node.content?.forEach(walk)
  }
  walk(doc)
  return ids
}

const docJson = await api.loadDocument(docId)
const ids = extractEntityIds(docJson)
await Promise.all(ids.map((id) => store.prefetch(id)))
editor.setContent(docJson)
```

### Inline-State vs Reference-Based Comparison

|                   | Inline-State (Chart)                  | Reference-Based (Poll)                  |
| ----------------- | ------------------------------------- | --------------------------------------- |
| **Node attrs**    | Full state                            | `{ entityId: string }`                  |
| **State source**  | `node.attrs` via `updateAttributes()` | External store                          |
| **Document size** | Grows with component data             | Constant (one ID per instance)          |
| **Rehydration**   | Automatic (tiptap parses attrs)       | Component fetches from store            |
| **Best for**      | Self-contained visual widgets         | Complex, independently-managed entities |

---

## Theme System

### Architecture

```
Consumer App (owns theme)              MeldEditor (reacts)
       |                                     |
       v                                     |
document.documentElement.classList            |
  .toggle('dark')                            |
       |                                     |
       v                                     v
MeldUI CSS variables (OKLCH color space)     |
  .dark { --background: ...; }              All MeldUI components +
       |                                    Tailwind classes + :deep()
       v                                    styles auto-switch
All MeldUI components auto-switch
```

**Key principle: MeldEditor does NOT own theme state.** It reacts to whatever `.dark` class is on `<html>`. The consuming app controls theme via its own system.

- **Single source of truth:** The `.dark` class on `<html>`.
- **No theme prop on MeldEditor.** No `data-theme` attribute. No internal theme state.
- **Works with any theme system:** The consuming app can use any mechanism to toggle `.dark`.

### CSS Variable Mapping

All editor styles use MeldUI design tokens:

| MeldUI Token         | Tailwind Class          | Usage                        |
| -------------------- | ----------------------- | ---------------------------- |
| `--background`       | `bg-background`         | Main background              |
| `--foreground`       | `text-foreground`       | Main text                    |
| `--muted-foreground` | `text-muted-foreground` | Secondary text, drag handles |
| `--border`           | `border-border`         | All borders                  |
| `--muted`            | `bg-muted`              | Code block backgrounds       |
| `--accent`           | `bg-accent`             | Hover and selection states   |
| `--popover`          | `bg-popover`            | Slash command popup          |
| `--primary`          | `text-primary`          | Accent color                 |
| `--destructive`      | `text-destructive`      | Danger actions               |

---

## Styling Strategy

### Three styling layers

1. **Tailwind utility classes** -- Layout, spacing, borders, shadows on component wrapper elements.

   ```html
   <div
     class="flex items-center gap-1 border-b border-border bg-muted/50 px-3 py-2 rounded-t-lg"
   ></div>
   ```

2. **MeldUI design tokens** -- Colors, typography via CSS variables. All MeldUI components (Toggle, Button, etc.) use these internally.

3. **`:deep()` scoped styles** -- ProseMirror content styles that cannot be expressed as Tailwind classes (the `.tiptap` content area, blockquotes, code blocks, table cells). These use MeldUI CSS variables:
   ```css
   :deep(.tiptap blockquote) {
     border-left: 3px solid var(--border);
     color: var(--muted-foreground);
   }
   ```

### Why `:deep()` is needed

ProseMirror generates DOM that Vue's scoped styles cannot reach. The `.tiptap` content area contains elements like `<blockquote>`, `<pre><code>`, `<table>`, `<ul>`, `<hr>` that are created by ProseMirror's schema, not Vue templates. Scoped `:deep()` selectors are the standard pattern for styling this content.

---

## Dependency Graph

```
MeldEditor.vue
  +-- types.ts                  (no deps, pure types)
  +-- defaults.ts               (depends on: types, extensions, icons)
  +-- EditorToolbar.vue         (depends on: types, MeldUI, Tabler)
  +-- TextBubbleMenu.vue        (depends on: MeldUI, Tabler, tiptap/menus)
  +-- DragHandle.vue            (depends on: Tabler, tiptap/core)
  +-- SlashCommandExtension.ts  (depends on: types, tiptap/suggestion, tippy.js)
  +-- SlashCommandList.vue      (depends on: types, MeldUI, Tabler)
  +-- defaultSlashCommands.ts   (depends on: types, Tabler)
  +-- TableControls.vue         (depends on: MeldUI, Tabler, tiptap/core)
  +-- ResizableImageExtension.ts (depends on: tiptap/extension-image, tiptap/vue-3)
  +-- ResizableImageView.vue    (depends on: MeldUI, Tabler, tiptap/vue-3)
  +-- ImageUrlDialog.vue        (depends on: MeldUI)
  +-- ChartNodeExtension.ts     (depends on: types, tiptap/core, tiptap/vue-3)
  +-- ChartNodeView.vue         (depends on: MeldUI, charts-vue, tiptap/vue-3)
  +-- CustomNodeExtension.ts    (depends on: types, tiptap/core, tiptap/vue-3)
  +-- BlockSelectionPlugin.ts   (depends on: tiptap/pm)
  +-- useBlockSelection.ts      (depends on: BlockSelectionPlugin, tiptap/core)
```

### Independently Testable Components

These can be developed and tested in isolation:

- `EditorToolbar` -- Receives `editor` + `items[]`, renders buttons. No tiptap DOM dependency.
- `ImageUrlDialog` -- Pure MeldUI dialog. No tiptap dependency.
- `SlashCommandList` -- Receives `items[]` + `command()`. No tiptap dependency.

These require a running tiptap editor instance:

- `TextBubbleMenu`, `DragHandle`, `TableControls`, `ResizableImageView`

---

## Important Notes

- **tiptap v3 imports:** Use named imports only (`import { Extension } from '@tiptap/...'`), not default imports.
- **BubbleMenu import path:** `import { BubbleMenu } from '@tiptap/vue-3/menus'` (NOT from `@tiptap/vue-3`).
- **StarterKit includes Link + Underline:** Do not install them separately.
- **Extensions are "initial only":** Changing the `extensions` prop after mount requires remounting the component (use `:key`).
