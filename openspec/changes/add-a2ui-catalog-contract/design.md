## Context

[A2UI](https://a2ui.org) is Google's Agent-Driven UI protocol: an agent backend streams JSON messages describing a UI, and a client renderer turns those messages into real widgets. Three layers are involved, and only the middle one is MeldUI's to own:

```
Agent (any A2UI-speaking backend)  →  emits A2UI v0.9 messages targeting a catalogId
        │  transport: SSE / WebSocket / A2A  (owned by the consuming app)
        ▼
Protocol core (@a2ui/web_core)     ←  message processor, surface state, JSON-Pointer binding (renderer-side dep)
        ▼
MeldUI                              ←  ❶ Catalog contract (THIS change)  ❷ Vue renderer (next change)
        ▼
Consuming app                      ←  owns transport + where surfaces mount
```

The **catalog** is the contract between agent and renderer. It is a JSON-Schema document, not code: it declares a `catalogId`, a set of `components` (each a JSON-Schema of its properties), optional `functions` (validators), and an optional `theme`. Negotiation is by id — the client advertises `supportedCatalogIds`; the agent picks one and locks it for a surface's lifetime. Because the catalog is framework-agnostic, **any** A2UI agent can target MeldUI without knowing it renders in Vue.

This change delivers the catalog contract as the standalone, portable, headline artifact. The Vue reference renderer is deliberately split into `add-a2ui-vue-renderer` so the contract can be reviewed, versioned, and consumed independently (e.g. by a future `@meldui/react` renderer, or by agent-side tooling) without entangling it with Vue implementation details.

**Target spec: A2UI v0.9** (current/published). v0.9 is "prompt-first" and far simpler than v0.8: flat discriminator (`{"component":"Text", ...}`), plain-JSON data model (`{"name":"Alice"}`), standard JSON Pointer paths (`/path/to/value`). Messages: `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`, each carrying `version: "v0.9"`.

## Goals / Non-Goals

**Goals:**

- Define a single, stable, versioned `catalogId` for the MeldUI A2UI catalog.
- Author per-component A2UI v0.9 JSON-Schema property definitions for the agreed component set (Basic primitives + MeldUI structural/display + rich).
- Produce a published, validatable `meldui-v1.catalog.json` artifact and export it from `@meldui/a2ui/catalog`.
- Guarantee the published contract cannot drift from its component definitions via codegen (single source of truth).
- Establish `@meldui/a2ui` as a sibling package following existing repo conventions, so the renderer change can build on it without restructuring.

**Non-Goals:**

- No Vue rendering code, `provideA2UI`, `A2UISurface`, `DynamicComponent`, prop adapters, or `sendAction` wiring — all deferred to `add-a2ui-vue-renderer`.
- No theme bridge implementation (the catalog may declare a `theme` _shape_, but mapping it onto MeldUI OKLCH CSS vars is renderer work).
- No `@a2ui/web_core` dependency in this change (renderer-side).
- No doqo/Phoenix agent integration.
- No support for A2UI v0.8 (target v0.9 only).
- No `DataTable` component (excluded by decision; `Table` covers tabular output).

## Decisions

### D1 — Catalog is the headline artifact; renderer is a separate change

The catalog is framework-agnostic and outlives any single renderer. Shipping it first means MeldUI becomes targetable by the A2UI ecosystem independent of Vue, and a React/Flutter renderer could later implement the same contract. **Alternative considered:** one combined change delivering catalog + renderer together — rejected because it couples the portable contract's review/versioning to Vue implementation churn and produces a larger, less reviewable change.

### D2 — Single advertised catalog, authored in reliability tiers

All components live under **one** `catalogId`. The Basic/structural/rich "tiers" are an authoring and documentation grouping, not separate catalogs. Keeping the A2UI Basic primitives under their **exact spec names** (`Row`, `Column`, `Text`, `Button`, …) means agents already targeting the A2UI "basic" catalog render in MeldUI's look with zero changes — maximum ecosystem interop. MeldUI-specific components extend the same catalog as a superset. **Alternative considered:** a separate "meldui-extended" catalog id — rejected as it complicates negotiation for no benefit; a single superset id subsumes basic.

### D3 — Single source of truth via codegen

Each component's A2UI JSON-Schema fragment is authored as **co-located metadata** (one definition per component), and `scripts/generate-catalog.ts` assembles the published `meldui-v1.catalog.json` from those definitions. The generated file is committed and a CI check asserts no diff between committed output and a fresh run. This mirrors the established `tabler-vue/scripts/generate.ts` pattern. **Why:** the renderer change will attach Vue components to these same definitions; a single source prevents the contract and the implementation from diverging. **Alternative considered:** hand-maintaining `catalog.json` directly — rejected because it inevitably drifts from the renderer's component map and from prop expectations.

### D4 — Target A2UI v0.9 only, version pinned in one place

Author against v0.9's flat-discriminator component shape and plain-JSON data model. The `version: "v0.9"` literal and the `catalogId` version segment are defined once and referenced everywhere. **Why:** v0.9 is current and dramatically simpler to model than v0.8; supporting both would double the schema surface for a deprecated format.

### D5 — `catalogId` URI: stable identity now, resolvable host later

Use a stable, versioned URI of the form `https://meldui.dev/catalogs/vue/v1/catalog.json` as the `catalogId`, and also export the file from the package (`@meldui/a2ui/catalog`) for direct import. The id functions as an opaque identity for negotiation even before the URL is live; making it physically resolvable (canonical hosting) is tracked as an open question. **Why:** negotiation is by string match — the contract is usable immediately; hosting is an independent concern.

### D6 — Package follows the existing sibling template

`@meldui/a2ui` copies the `charts-vue`/`tabler-vue` package conventions: `type: module`, ESM+CJS+dts build, `publishConfig` to `npm.pkg.github.com`, `files: ["dist", "README.md"]`, a `generate-catalog` script alongside `build`/`typecheck`. In this change the build output is primarily the catalog JSON + type definitions for the schema metadata; the runtime Vue surface is added by the renderer change. **Why:** consistency with the monorepo and zero restructuring when the renderer lands.

## Risks / Trade-offs

- **Complex components are hard for LLMs to emit correctly** (`Table`, `Combobox`, `Sidebar`, `Chart`) → keep their schemas tight, strongly-typed, and well-`description`'d; document `Markdown` + display-only components as the primary path so agents lean on the reliable set.
- **`catalogId` not yet resolvable** → ship the file in-package and use a single consistent placeholder URI; agents negotiate by string id regardless. Tracked in Open Questions.
- **`@a2ui/web_core` API not yet verified first-hand** (this change doesn't depend on it, but the renderer will) → de-risked here by keeping the catalog purely declarative and spec-driven; the renderer change owns confirming web_core's exports.
- **v0.9 spec evolution** → pin `version`/`catalogId` in one place so a future bump is a localized edit; the codegen re-emits the artifact consistently.
- **Schema/renderer drift** → mitigated by D3 codegen + CI no-diff check; the renderer change attaches components to the same definitions rather than re-declaring props.

## Migration Plan

Net-new package and capability — no migration of existing code. Rollout:

1. Land `@meldui/a2ui` with schema metadata, `generate-catalog.ts`, committed `meldui-v1.catalog.json`, and a `0.1.0` changeset.
2. Validate the generated catalog against the A2UI catalog meta-schema in CI.
3. `add-a2ui-vue-renderer` builds on the published contract.

Rollback: the package is additive and unreferenced by existing exports; removing it has no consumer impact prior to a renderer release.

## Resolved during implementation

- **`functions` scope** — RESOLVED: v1 declares the full A2UI Basic function set (`required`, `regex`, `length`, `numeric`, `email`, `formatString`, `formatNumber`, `formatCurrency`, `formatDate`, `pluralize`, `openUrl`, `and`, `or`, `not`), reused verbatim from google/A2UI (Apache-2.0, attributed). They are catalog-agnostic validators/formatters; shipping them now lets the renderer wire `checks` without a catalog change.
- **`theme` block** — RESOLVED: v1 declares the A2UI Basic `theme` token shape (`primaryColor`, `iconUrl`, `agentDisplayName`) in `$defs.theme`. The renderer's OKLCH bridge consumes it later.
- **Interop subset** — `Video` and `AudioPlayer` from the A2UI Basic catalog are intentionally omitted (no MeldUI equivalent); easy future adds.
- **Schema validity tooling** — `validate-catalog` compiles the catalog with Ajv 2020 against a committed `common_types.fixture.json`, registering the catalog under both its own `$id` and the sibling URL `common_types.json` expects (it back-references `catalog.json#/$defs/anyFunction`).
- **Formatter interaction** — oxfmt reformats JSON; the generated catalog + vendored A2UI JSON are added to `.oxfmtrc`/`.oxlintrc` `ignorePatterns` so formatting never conflicts with the codegen output / drift check.

## Open Questions

- **Canonical hosting for the `catalogId` URI** — `meldui.dev/catalogs/...` vs a GitHub Pages/raw URL of this repo. Until resolved, use the placeholder consistently. (Still open.)
