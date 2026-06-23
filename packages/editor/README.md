# @meldui/editor

A Vue 3 rich-text editor for the MeldUI design system, built on [TipTap](https://tiptap.dev)
v3. Provides the `MeldEditor` component with a default extension set, a configurable toolbar
and `/` slash-command menu, a selection bubble menu, tables, resizable images, mentions,
multi-column layouts, a table-of-contents block, chart blocks, a drag handle, and a
custom-component extension point.

## Installation

```bash
pnpm add @meldui/editor @meldui/vue @meldui/tabler-vue @meldui/charts-vue vue
```

`@meldui/vue`, `@meldui/tabler-vue`, `@meldui/charts-vue`, and `vue` are **peer
dependencies**. The TipTap engine (`@tiptap/*`) and `tippy.js` are bundled dependencies and
installed automatically.

> The chart block renders via `@meldui/charts-vue`, which is a **required** peer.

### Styles

Import the editor's scoped styles once at your app root, and add the package to your
Tailwind v4 content sources so its utility classes are generated (using your existing
MeldUI theme tokens):

```ts
import '@meldui/vue/themes/default'
import '@meldui/editor/styles'
```

```css
/* app.css */
@import 'tailwindcss';
@import '@meldui/vue/themes/default';
@source "../node_modules/@meldui/editor/dist/**/*.mjs";
```

## Usage

```vue
<script setup lang="ts">
import { MeldEditor } from '@meldui/editor'
import '@meldui/vue/themes/default'

async function onImageUpload(file: File): Promise<string> {
  // upload and return a URL
  return URL.createObjectURL(file)
}
</script>

<template>
  <MeldEditor
    :show-toolbar="true"
    :on-image-upload="onImageUpload"
    @update:json="(json) => console.log(json)"
  />
</template>
```

## Public API

- `MeldEditor` — the editor component
- `createCustomNodeExtension` — register a consumer Vue component as a custom node
- `ChartNode` — the chart block extension
- `createDefaultToolbarItems`, `resolveSlashCommands`, `defaultSlashCommands` — defaults
- Types: `MeldEditorProps`, `MeldEditorEmits`, `MeldEditorExposed`, `ToolbarItem`,
  `SlashCommandItem`, `DefaultExtensionOptions`, `CustomComponentRegistration`,
  `DeleteDialogItem`, `MentionItem`

See `src/docs/architecture.md` for the extension architecture.
