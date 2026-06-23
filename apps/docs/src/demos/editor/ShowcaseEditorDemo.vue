<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { MentionItem } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

// --- Callbacks ---------------------------------------------------------------
const PEOPLE: MentionItem[] = [
  { id: 'user-1', label: 'Alice Johnson' },
  { id: 'user-2', label: 'Bob Smith' },
  { id: 'user-3', label: 'Carol Williams' },
  { id: 'user-4', label: 'David Brown' },
  { id: 'user-5', label: 'Eve Davis' },
]

async function searchPeople(query: string): Promise<MentionItem[]> {
  const q = query.toLowerCase()
  return PEOPLE.filter((p) => p.label.toLowerCase().includes(q))
}

async function uploadImage(file: File): Promise<string> {
  return URL.createObjectURL(file)
}

// A self-contained sample image (inline SVG data URL — no network needed).
const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="220">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0" stop-color="#6366f1"/>
           <stop offset="1" stop-color="#06b6d4"/>
         </linearGradient>
       </defs>
       <rect width="640" height="220" fill="url(#g)"/>
       <text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="26"
             text-anchor="middle" dominant-baseline="middle">Resizable image</text>
     </svg>`,
  )

// --- Helpers -----------------------------------------------------------------
type J = Record<string, unknown>
const text = (t: string, marks?: string[]): J => ({
  type: 'text',
  text: t,
  ...(marks ? { marks: marks.map((type) => ({ type })) } : {}),
})
const p = (...content: J[]): J => ({ type: 'paragraph', content })
const h = (level: number, ...content: J[]): J => ({ type: 'heading', attrs: { level }, content })
const li = (...content: J[]): J => ({ type: 'listItem', content })
const task = (checked: boolean, t: string): J => ({
  type: 'taskItem',
  attrs: { checked },
  content: [p(text(t))],
})
const cell = (t: string, header = false): J => ({
  type: header ? 'tableHeader' : 'tableCell',
  content: [p(text(t))],
})
const column = (...content: J[]): J => ({ type: 'column', content })

// --- The showcase document ---------------------------------------------------
const SAMPLE: J = {
  type: 'doc',
  content: [
    h(1, text('Welcome to MeldEditor ✨')),

    { type: 'tableOfContentsNode' },

    {
      type: 'blockquote',
      content: [
        p(text('💡 This whole page is editable.', ['bold'])),
        p(
          text('Select any text for the bubble menu, hover a block for the drag handle, or type '),
          text('/', ['code']),
          text(' to open the command menu — every feature below is live.'),
        ),
      ],
    },

    h(2, text('Text & formatting')),
    p(
      text('Write with '),
      text('bold', ['bold']),
      text(', '),
      text('italic', ['italic']),
      text(', '),
      text('underline', ['underline']),
      text(', '),
      text('strikethrough', ['strike']),
      text(', and '),
      text('inline code', ['code']),
      text('. Mention teammates like '),
      { type: 'mention', attrs: { id: 'user-1', label: 'Alice Johnson' } },
      text(' by typing '),
      text('@', ['code']),
      text('.'),
    ),
    { type: 'paragraph', attrs: { textAlign: 'center' }, content: [text('Text can be aligned, too — this line is centered.')] },

    p(text('Try some Markdown shortcuts:', ['bold'])),
    { type: 'codeBlock', content: [text('# Heading\n- Bullet list\n1. Ordered list\n> Blockquote\n`inline code`')] },

    h(2, text('Lists & tasks')),
    {
      type: 'bulletList',
      content: [
        li(p(text('Headings, lists, quotes, and code blocks'))),
        li(p(text('Tables, images, columns, charts, and a table of contents'))),
      ],
    },
    {
      type: 'orderedList',
      content: [li(p(text('Step one'))), li(p(text('Step two'))), li(p(text('Step three')))],
    },
    {
      type: 'taskList',
      content: [task(true, 'Install @meldui/editor'), task(false, 'Build something great')],
    },

    h(2, text('Tables')),
    {
      type: 'table',
      content: [
        { type: 'tableRow', content: [cell('Quarter', true), cell('Revenue', true), cell('Growth', true)] },
        { type: 'tableRow', content: [cell('Q1'), cell('$120k'), cell('+8%')] },
        { type: 'tableRow', content: [cell('Q2'), cell('$200k'), cell('+12%')] },
      ],
    },

    h(2, text('Columns')),
    {
      type: 'columnBlock',
      content: [
        column(h(3, text('Side by side')), p(text('Place any blocks next to each other.'))),
        column(h(3, text('2 or 3 wide')), p(text('Add, remove, or flatten columns from the block controls.'))),
      ],
    },

    h(2, text('Charts')),
    {
      type: 'meldChart',
      attrs: {
        chartType: 'bar',
        config: {
          series: [{ name: 'Revenue', data: [120, 200, 150, 280, 190, 230] }],
          xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        },
        title: 'Monthly revenue',
      },
    },

    h(2, text('Images')),
    { type: 'image', attrs: { src: SAMPLE_IMAGE } },

    { type: 'horizontalRule' },
    p(text("That's the tour — start editing above, or type "), text('/', ['code']), text(' to insert more.')),
  ],
}

function seed(editor: Editor) {
  editor.commands.setContent(SAMPLE)
}

const code = `<script setup lang="ts">
import { MeldEditor } from '@meldui/editor'
import type { Editor, MentionItem } from '@meldui/editor'
import '@meldui/editor/styles'

async function searchPeople(query: string): Promise<MentionItem[]> {
  // Return mention candidates: { id, label }[]
  return await fetchPeople(query)
}

async function uploadImage(file: File): Promise<string> {
  // Upload the file and return its URL.
  return await uploadToStorage(file)
}

// Seed the document from the created handler (TipTap JSON).
function seed(editor: Editor) {
  editor.commands.setContent(richDocument)
}
<\/script>

<template>
  <MeldEditor
    :on-mention-search="searchPeople"
    :on-image-upload="uploadImage"
    @created="seed"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code" align="start">
    <div class="w-full">
      <MeldEditor
        :on-mention-search="searchPeople"
        :on-image-upload="uploadImage"
        @created="seed"
      />
    </div>
  </DemoBlock>
</template>
