<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import '@meldui/editor/styles'

// Returns a local object URL instead of hitting a server.
async function uploadImage(file: File): Promise<string> {
  return URL.createObjectURL(file)
}

const code = `<script setup lang="ts">
import { MeldEditor } from '@meldui/editor'
import '@meldui/editor/styles'

async function uploadImage(file: File): Promise<string> {
  // Upload the file and return its URL.
  return URL.createObjectURL(file)
}
<\/script>

<template>
  <MeldEditor
    :show-toolbar="true"
    placeholder="Use the toolbar or the / menu…"
    :on-image-upload="uploadImage"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code" align="start">
    <div class="w-full">
      <MeldEditor
        :show-toolbar="true"
        placeholder="Use the toolbar or the / menu…"
        :on-image-upload="uploadImage"
      />
    </div>
  </DemoBlock>
</template>
