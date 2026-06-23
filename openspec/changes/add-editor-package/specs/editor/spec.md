# editor Specification

## ADDED Requirements

### Requirement: MeldEditor Component Package

The design system SHALL provide a Vue 3 rich-text editor as an independently versioned,
publishable package `@meldui/editor`, built on TipTap v3. The package SHALL export a
`MeldEditor` component plus its supporting extension factories, defaults, and TypeScript
types, and SHALL build to ESM, CJS, and type declarations following the conventions of
`@meldui/vue`.

#### Scenario: Package builds standalone

- **WHEN** `pnpm --filter @meldui/editor build` is run
- **THEN** the package emits ESM (`dist/esm/*.mjs`), CJS (`dist/cjs/*.cjs`), and types
  (`dist/index.d.ts`)
- **AND** `@tiptap/*`, `tippy.js`, `nanoid`, `vue`, and the `@meldui/*` peers are NOT bundled
  into the output

#### Scenario: Public API is exported

- **WHEN** a consumer imports from `@meldui/editor`
- **THEN** `MeldEditor`, `createCustomNodeExtension`, `ChartNode`,
  `createDefaultToolbarItems`, `resolveSlashCommands`, and `defaultSlashCommands` are
  available
- **AND** the public types (`MeldEditorProps`, `MeldEditorEmits`, `MeldEditorExposed`,
  `ToolbarItem`, `SlashCommandItem`, `DefaultExtensionOptions`,
  `CustomComponentRegistration`, `DeleteDialogItem`, `MentionItem`) are exported

### Requirement: Editing Capabilities Preserved From Source

`MeldEditor` SHALL preserve the editing capabilities of the source implementation:
formatting via a bubble menu and optional toolbar, a `/` slash-command menu, tables with
hover controls, resizable images with captions, mentions, multi-column layouts, a
table-of-contents block, chart blocks, a drag handle for block reordering, and Notion-style
cross-block selection.

#### Scenario: Default editing works

- **WHEN** `MeldEditor` is mounted with default props
- **THEN** the user can type, open the `/` slash menu to insert blocks, format selected text
  via the bubble menu, and reorder blocks with the drag handle

#### Scenario: Read-only mode

- **WHEN** `MeldEditor` is mounted with `editable: false`
- **THEN** content renders but cannot be modified

### Requirement: Callback-Driven Integration Points

`MeldEditor` SHALL integrate with host applications through props and callbacks rather than
direct app coupling. Image upload, mention search, and custom block components SHALL be
provided by the consumer.

#### Scenario: Image upload callback

- **WHEN** a consumer provides `onImageUpload` and inserts an image
- **THEN** the callback is invoked with the `File` and its resolved URL is used; when no
  callback is provided the editor falls back to an inline data URL

#### Scenario: Mention search callback

- **WHEN** a consumer provides `onMentionSearch` and types a mention trigger
- **THEN** the callback resolves the suggestion list shown in the mention dropdown

#### Scenario: Custom components

- **WHEN** a consumer passes `customComponents`
- **THEN** each is registered as a custom node and rendered within the document

### Requirement: Chart Block Depends On @meldui/charts-vue

The chart block SHALL render via `@meldui/charts-vue`, which SHALL be a required peer
dependency of `@meldui/editor`. `@meldui/vue` and `@meldui/tabler-vue` SHALL also be peer
dependencies, alongside `vue`.

#### Scenario: Chart block renders

- **WHEN** a chart block is inserted in an app that has `@meldui/charts-vue` installed
- **THEN** the chart renders using the `MeldChart` component
