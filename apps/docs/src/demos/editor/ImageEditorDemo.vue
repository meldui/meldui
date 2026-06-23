<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import '@meldui/editor/styles'

// A self-contained sample image (inline SVG data URL — no network needed).
const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="240">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0" stop-color="#6366f1"/>
           <stop offset="1" stop-color="#06b6d4"/>
         </linearGradient>
       </defs>
       <rect width="640" height="240" fill="url(#g)"/>
       <text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="28"
             text-anchor="middle" dominant-baseline="middle">Sample image</text>
     </svg>`,
  )

// Upload handler — return the URL the editor should insert. Here we just
// create a local object URL; in an app you'd upload and return the stored URL.
async function uploadImage(file: File): Promise<string> {
  return URL.createObjectURL(file)
}

const SAMPLE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Drag the image edge to resize it, or insert your own via /Image.' }],
    },
    { type: 'image', attrs: { src: SAMPLE_IMAGE } },
    { type: 'paragraph' },
  ],
}

function seed(editor: Editor) {
  editor.commands.setContent(SAMPLE)
}

const code = `<script setup lang="ts">
import { MeldEditor } from '@meldui/editor'
import '@meldui/editor/styles'

// Insert "Image" from the / slash menu (or toolbar). The editor calls
// onImageUpload with the chosen File and inserts the returned URL.
async function uploadImage(file: File): Promise<string> {
  // Upload the file and return its URL.
  return URL.createObjectURL(file)
}
<\/script>

<template>
  <MeldEditor :on-image-upload="uploadImage" />
</template>`
</script>

<template>
  <DemoBlock :code="code" align="start">
    <div class="w-full">
      <MeldEditor :on-image-upload="uploadImage" @created="seed" />
    </div>
  </DemoBlock>
</template>
