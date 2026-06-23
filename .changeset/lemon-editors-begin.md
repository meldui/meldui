---
'@meldui/editor': minor
---

Add `@meldui/editor` — a Vue 3 rich-text editor built on TipTap v3, lifted from the doqo
app. Ships the `MeldEditor` component with a default extension set (headings, lists, tables,
resizable images, mentions, multi-column layouts, table-of-contents, and chart blocks), a
`/` slash-command menu, a selection bubble menu, an optional toolbar, a Notion-style drag
handle, and a custom-component extension point. Integration is callback-driven via
`onImageUpload`, `onMentionSearch`, and `customComponents`. Requires `@meldui/vue`,
`@meldui/tabler-vue`, and `@meldui/charts-vue` as peers.
