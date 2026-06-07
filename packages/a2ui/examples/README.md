# A2UI examples

Five example surfaces — simple → complex — built against the MeldUI A2UI catalog
(`https://meldui.dipayanb.com/a2ui/v1/catalog.json`). Each `.json` file is a **JSON array
of A2UI v0.9 messages**, in the exact order an agent would stream them to the client. Parse
a file and hand the array straight to the renderer's `processor.processMessages(messages)`.

## The message envelope

Each element of the array is one message. Three kinds appear across these examples:

```jsonc
// 1. Open a surface and bind it to the MeldUI catalog (always first)
{ "version": "v0.9", "createSurface": { "surfaceId": "s1", "catalogId": "…/v1/catalog.json" } }

// 2. Seed / patch the data model that components bind to via { "path": "/x" }
{ "version": "v0.9", "updateDataModel": { "surfaceId": "s1", "path": "/", "value": { … } } }

// 3. Add or replace components. There is always one with "id": "root" (the mount point).
{ "version": "v0.9", "updateComponents": { "surfaceId": "s1", "components": [ … ] } }
```

Key rules the examples follow:

- **Children are referenced by id, never inlined.** A `Column` lists `"children": ["a","b"]`;
  a `Card` points at one `"child": "id"`. The referenced components are flat entries in the
  same `components` array.
- **Dynamic values bind to the data model** with `{ "path": "/some/key" }`, so inputs
  (`TextField`, `CheckBox`, `ChoicePicker`, `Slider`, …) two-way bind and `Table`/`Chart`
  read their rows/series from it.
- **Functions** like `formatCurrency`, `formatNumber`, and `formatString` wrap a value to
  format it for display (see examples 03–04).
- **Actions** (`Button`) emit `{ "event": { "name": "…" } }` back to the agent, optionally
  with a `data` payload snapshotting bound paths.
- A surface can be **streamed in several `updateComponents` messages** (example 05 sends the
  shell first, then each tab panel) — the renderer patches incrementally, so the array simply
  holds those messages in sequence.

## The examples

| #   | File                           | Complexity                | Components exercised                                                                                                                                                                                                     |
| --- | ------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `01-hello-card.json`           | Simplest                  | `Card`, `Column`, `Text`, `Button`                                                                                                                                                                                       |
| 2   | `02-newsletter-signup.json`    | Form + data model         | `TextField` (regex validation), `ChoicePicker` (chips), `CheckBox`, `Divider`, action with `data` payload                                                                                                                |
| 3   | `03-order-tracking.json`       | Display + format fns      | `Badge`, `Alert`, `Timeline`, `Table`, `ButtonGroup`, `formatString` / `formatCurrency`                                                                                                                                  |
| 4   | `04-analytics-dashboard.json`  | Layout + data viz         | weighted `Row`/`Card` stat tiles, `Tabs`, `Chart` (area/bar), `Table`, `formatNumber` / `formatCurrency`                                                                                                                 |
| 5   | `05-account-settings-app.json` | App shell, multi-message  | `Sidebar`, `Avatar`, `Tabs`, `Combobox`, `MultiSelect`, `ToggleGroup`, `Accordion`, `Table`, `Markdown`, `Alert` — streamed across 4 `updateComponents` messages                                                         |
| 6   | `06-media-player.json`         | Icon usage                | `Icon` in three contexts — icon-only `Button`s (transport/favorite), icon + `Text` rows (shuffle/share/download), and a standalone icon beside a `Slider`                                                                |
| 7   | `07-coffee-receipt.json`       | `justify` + list template | An order receipt: each `Row` uses a different `justify` (header `start`, line items / totals `spaceBetween`), and line items are generated from `/items` via a `{ path, componentId }` list template with relative paths |

## Try one quickly

Each file is a single JSON array, so you can sanity-check it parses and count its messages:

```bash
jq 'length' 01-hello-card.json   # -> number of messages in the stream
```

To render, parse the file into an array of objects and hand it to the Vue renderer's
`processor.processMessages(messages)` (see the package README for wiring).
