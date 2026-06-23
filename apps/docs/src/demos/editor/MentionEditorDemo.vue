<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { MeldEditor } from '@meldui/editor'
import type { MentionItem } from '@meldui/editor'
import '@meldui/editor/styles'

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

const code = `<script setup lang="ts">
import { MeldEditor } from '@meldui/editor'
import type { MentionItem } from '@meldui/editor'
import '@meldui/editor/styles'

const PEOPLE: MentionItem[] = [
  { id: 'user-1', label: 'Alice Johnson' },
  { id: 'user-2', label: 'Bob Smith' },
]

// The mention extension only loads when onMentionSearch is provided.
async function searchPeople(query: string): Promise<MentionItem[]> {
  const q = query.toLowerCase()
  return PEOPLE.filter((p) => p.label.toLowerCase().includes(q))
}
<\/script>

<template>
  <MeldEditor
    placeholder="Type @ to mention someone…"
    :on-mention-search="searchPeople"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code" align="start">
    <div class="w-full">
      <MeldEditor placeholder="Type @ to mention someone…" :on-mention-search="searchPeople" />
    </div>
  </DemoBlock>
</template>
