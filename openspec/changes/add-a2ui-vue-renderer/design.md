## Context

`add-a2ui-catalog-contract` defines the portable MeldUI A2UI catalog. This change implements the Vue **renderer** that consumes A2UI v0.9 messages and produces live `@meldui/vue` UI. It sits on Google's official protocol core; only the Vue rendering layer is MeldUI's to write.

```
Agent → A2UI v0.9 messages (targeting MeldUI catalogId)
   │  transport owned by the consuming app
   ▼
@a2ui/web_core /v0_9   ← MessageProcessor, Surface/Component/DataModel, ComponentContext/DataContext, GenericBinder  (DEP)
   ▼
@meldui/a2ui renderer  ← THIS change: Preact→Vue reactivity bridge, recursive lazy host, catalog→@meldui/vue mapping, theme bridge
   ▼
Consuming Vue app
```

### Verified `@a2ui/web_core` surface (v0.10.0, `/v0_9` export)

Confirmed first-hand (resolves the open risk from the catalog change's plan). web_core's reactivity is built on **`@preact/signals-core`** (`signal`/`computed`/`effect`), not Vue. Relevant exports:

- `MessageProcessor<Api>(catalogs)` — `processMessages(msgs)`, `model.surfacesMap` / `model.getSurface(id)`, `onSurfaceCreated/onSurfaceDeleted`, `model.dispose()`.
- `SurfaceModel` — `componentsModel` (`get(id)`, `onCreated`/`onDeleted` subscribable events), `dataModel` (`get`/`set`/`subscribe(path, cb)`), `catalog` (`components`, `functions`).
- `ComponentModel` — `id`, `type`, `properties`, `onUpdated`.
- `ComponentContext(surface, id, basePath)` and `DataContext(dataModel, basePath, functionInvoker)` — `resolveSignal(value)` (→ Preact signal), `path`, `nested(path)`, `set(path, value)`.
- `GenericBinder<Props>(context, schema)` — resolves a component's whole prop set from the data model; exposes `.subscribe(cb)`, `.snapshot`, `.dispose()`.
- `A2uiClientAction`, `A2uiMessage`, message `Schemas`.

### How the three existing renderers bridge Preact signals (evidence base)

- **React (official):** `useSyncExternalStore` + a per-component `GenericBinder`; `DeferredChild` subscribes per-id to existence; lazy `buildChild`; `binding.dispose()` on unmount; `memo`. **Fine-grained.**
- **Angular (official):** `ComponentBinder.bind` resolves each prop's Preact signal via `dataContext.resolveSignal` and converts each to a native Angular signal with `toAngularSignal(sig, destroyRef, ngZone)`; `NgComponentOutlet` host-per-id, `OnPush`, `destroyRef` cleanup. **Fine-grained (per-property).**
- **a2ui-vue (community):** a single global `version` ref bumped on any change + "touch `version.value`" to subscribe; eager tree materialization; no per-node subscription or dispose. **Coarse.**

Both of Google's own renderers are fine-grained and reuse `GenericBinder`/`resolveSignal`; the community Vue lib is the outlier. This change follows the official pattern.

### Spike findings (web_core 0.10.0 — verified by compiling against the installed package)

Corrections/refinements to the assumed surface above:

- `DataContext` constructor is `(surface, path)` — the `functionInvoker` is derived internally from `surface.catalog`. Use `surface`-scoped contexts, not a hand-built one.
- `MessageProcessor(catalogs, actionHandler?)` accepts a global `actionHandler`; `SurfaceModel` also exposes `onAction: EventSource<A2uiClientAction>` and `dispatchAction(payload, sourceComponentId)`. The processor exposes `getClientCapabilities()` which builds the `a2uiClientCapabilities` (incl. `supportedCatalogIds`) — use it rather than hand-rolling negotiation.
- **The catalog and `GenericBinder` are driven by Zod schemas, not JSON Schema.** `ComponentApi = { name: string; schema: z.ZodTypeAny }`; `Catalog<T>(id, components: T[], functions?, themeSchema?)`. `scrapeSchemaBehavior(zodSchema)` is what classifies each prop as DYNAMIC / ACTION / STRUCTURAL / CHECKABLE / STATIC, so an accurate Zod schema per component is required for the binder to work.
- web_core ships reusable Zod building blocks: `@a2ui/web_core/v0_9/basic_catalog` exports component APIs (`TextApi`, `ButtonApi`, …) and `basic_functions`; `@a2ui/web_core/v0_9` exports the common-type Zod schemas (`DynamicStringSchema`, `DynamicNumberSchema`, `DynamicBooleanSchema`, `DynamicStringListSchema`, `ChildListSchema`, `ComponentIdSchema`, `ActionSchema`, `DataBindingSchema`).

**Implication — the renderer catalog is a Zod layer, parallel to Change A's JSON contract:**

- For the 16 Basic primitives: reuse web_core's `*Api` (name + Zod schema) and attach a MeldUI Vue render component.
- For the 19 MeldUI components (structural/display + rich): author a Zod schema from the exported common-type schemas, define `{ name, schema }`, and attach a Vue render component.
- `VueComponentApi extends ComponentApi { render: Component }` (mirrors React's `ReactComponentImplementation`).
- Change A's `meldui-v1.catalog.json` remains the **agent-facing** contract; this Zod catalog is the **renderer-facing** one. They describe the same component names/props and MUST stay consistent — a test asserts the renderer catalog's component-name set equals `MELDUI_COMPONENT_NAMES` from `@meldui/a2ui`.

## Goals / Non-Goals

**Goals:**

- Render A2UI v0.9 surfaces using `@meldui/vue` components, driven by streamed messages.
- Fine-grained reactivity: only the node whose bound data changed re-renders (official-renderer parity).
- Reuse web_core's `GenericBinder` for per-component prop resolution.
- Lazy, recursive, leak-free component host (dispose binders/effects on unmount).
- Full A2UI catalog negotiation: advertise the stable MeldUI `catalogId` via `supportedCatalogIds`.
- Inherit MeldUI OKLCH theming automatically.

**Non-Goals:**

- No changes to the catalog _contract_ itself (owned by `add-a2ui-catalog-contract`), beyond attaching renderer-facing metadata if strictly required.
- No transport (SSE/WebSocket/A2A) — owned by the consuming app; stories use canned message arrays.
- No doqo/Phoenix agent integration.
- No v0.8 support.
- No React renderer (future, separate).

## Decisions

### D1 — Fine-grained reactivity via a `toVueRef` signal adapter

Bridge each web_core Preact signal into Vue's reactivity with a small adapter — the Vue analog of Angular's `toAngularSignal` and React's `useSyncExternalStore`:

```ts
import { customRef, onScopeDispose } from 'vue'
import { effect as preactEffect } from '@a2ui/web_core/v0_9'

function toVueRef<T>(signal: { value: T; peek(): T }) {
  let stop: () => void
  const r = customRef<T>((track, trigger) => {
    stop = preactEffect(() => {
      signal.value
      trigger()
    }) // re-trigger Vue when the signal changes
    return { get: () => (track(), signal.peek()), set: () => {} }
  })
  onScopeDispose(() => stop?.())
  return r
}
```

**Rationale:** matches both official renderers; only the changing node updates; directly fixes the streaming-markdown perf concern (a token delta touches one node's data path, not the whole surface). **Alternative considered:** the community lib's single coarse `version` ref — rejected for this change because it recomputes broadly per delta and the user chose official parity / no shortcut. (The coarse approach is still documented as a possible fallback if a web_core API mismatch makes fine-grained impractical — see Risks.)

### D2 — Reuse `GenericBinder` for per-component prop resolution

Each rendered component wraps `new GenericBinder<Props>(context, api.schema)` and reads `binder.snapshot`, subscribing via `binder.subscribe`. This is exactly the official React path. **Rationale:** DynamicValue / `{path}` binding / `{call,args}` function resolution already live in web_core and stay in sync with the spec; reimplementing them (as Angular's manual binder and a2ui-vue do) is avoidable maintenance. **Alternative considered:** hand-rolled `dataContext.resolveSignal` per prop — rejected to minimize duplicated, spec-coupled logic.

### D3 — Lazy recursive host with explicit disposal

An `A2UISurface` renders the root (`id: 'root'`); a `DeferredChild`-style host resolves each child by id from `componentsModel` on demand and recurses — no eager `VueComponentNode` tree. Each host subscribes to that id's create/delete, creates its binder, and **disposes the binder + the `toVueRef` effect on unmount** (`onScopeDispose`/`onUnmounted`). **Rationale:** mirrors React's `DeferredChild`/`buildChild` and Angular's host-per-id; avoids DataModel subscription leaks that web_core explicitly warns about. **Alternative considered:** eager materialization (a2ui-vue) — rejected; it pairs naturally with coarse invalidation, not fine-grained.

### D4 — Catalog implementation as name → `@meldui/vue` component + adapters

A `MELDUI_CATALOG` maps each contract component name to a `@meldui/vue` component, plus a `props(context)` adapter that reads resolved values from the binder snapshot and maps A2UI prop names → MeldUI prop names. Thin `.vue` adapters (`MeldRow`, `MeldColumn`, `MeldText`, `MeldIcon`) cover primitives MeldUI lacks. Interactive components call `sendAction(action)` → `{ version: 'v0.9', action }` client-action envelope dispatched through the processor wrapper. **Rationale:** keeps the protocol↔MeldUI mapping in one isolation layer; a spec or MeldUI API change touches adapters, not consumers.

### D5 — Build on web_core's `/v0_9` entry, pinned

Import strictly from `@a2ui/web_core/v0_9` (the root export still points at v0_8). Pin `@a2ui/web_core@^0.10`. **Rationale:** v0.9 is the target; the subpath is stable and is what the official v0.9 renderers use.

### D6 — Theme bridge over existing OKLCH tokens

`provideA2UI` accepts a `theme`; the default binds A2UI theme tokens onto MeldUI's existing CSS variables from `@meldui/vue/themes/default`. No new colors. **Rationale:** surfaces inherit MeldUI light/dark for free; single source of truth for tokens.

## Risks / Trade-offs

- **`GenericBinder`/`ComponentContext` API drift from assumptions** → the API was verified from type surface, not yet compiled against. Mitigation: a thin spike against the installed package is the first implementation task; the renderer's public API (`provideA2UI`/`A2USurface`/catalog) is insulated from web_core internals so adjustments stay in `src/core/`.
- **`toVueRef` effect lifecycle leaks** → every `preactEffect` must be stopped on scope dispose; bind it to `onScopeDispose` and dispose binders on unmount (React/Angular both do this explicitly). Covered by a leak-check in verification.
- **Fine-grained complexity vs coarse simplicity** → more moving parts than a2ui-vue. Mitigation: the coarse single-`version` approach remains a documented fallback if a web_core mismatch blocks fine-grained for v0.1; the catalog/renderer public API is identical either way, so the bridge is swappable.
- **`@preact/signals-core` + Vue double reactivity** → keep Preact signals strictly inside `src/core/`; never expose raw signals to catalog components — they receive plain resolved values from the binder snapshot.
- **Storybook consumes built dist** → stories require building `@meldui/vue` and `@meldui/a2ui` first; note in tasks.

## Migration Plan

Additive within `@meldui/a2ui`; depends on `add-a2ui-catalog-contract` being applied first. Rollout: spike web_core → core bridge/host → catalog entries+adapters → theme → stories → changeset (minor bump). Rollback: renderer code is isolated under `src/core`/`src/catalog`/`src/theme`; the published catalog artifact is unaffected.

## Open Questions

- Does the catalog contract need renderer-facing metadata attached (Vue component refs / `theme` shape), or does it remain unchanged (no `a2ui-catalog` delta)? Resolve when wiring `MELDUI_CATALOG`.
- `provideA2UI` ergonomics: app-level `app.provide` (a2ui-vue style) vs root-component `setup()` provide — pick the one that composes best with `customRef`/`onScopeDispose` lifecycle.
- Streaming-markdown: confirm fine-grained binding updates only the markdown node per token; if `MarkdownViewer` re-mounts instead of patching, special-case its binding.
