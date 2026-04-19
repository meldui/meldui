<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Mention, MentionInput, MentionContent, MentionItem, Label } from '@meldui/vue'
import { IconAt } from '@meldui/tabler-vue'

const text = ref('')

const users = [
  { value: 'john', label: 'John Smith' },
  { value: 'jane', label: 'Jane Doe' },
  { value: 'michael', label: 'Michael Johnson' },
  { value: 'sarah', label: 'Sarah Williams' },
]

const code = `\u003cscript setup>
import { ref } from 'vue'
import { Mention, MentionInput, MentionContent, MentionItem, Label } from '@meldui/vue'

const text = ref('')

const users = [
  { value: 'john', label: 'John Smith' },
  { value: 'jane', label: 'Jane Doe' },
  { value: 'michael', label: 'Michael Johnson' },
  { value: 'sarah', label: 'Sarah Williams' },
]
\u003c/script>

\u003ctemplate>
  <div class="grid w-full max-w-md gap-1.5">
    <Label>Message</Label>
    <Mention v-model="text" placeholder="Type @ to mention someone...">
      <MentionInput
        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <MentionContent :items="users">
        <MentionItem v-for="user in users" :key="user.value" :item="user">
          {{ user.label }}
        </MentionItem>
      </MentionContent>
    </Mention>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="grid w-full max-w-md gap-1.5">
      <Label>Message</Label>
      <Mention v-model="text" placeholder="Type @ to mention someone...">
        <MentionInput
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs
            placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <MentionContent :items="users">
          <MentionItem v-for="user in users" :key="user.value" :item="user">
            {{ user.label }}
          </MentionItem>
        </MentionContent>
      </Mention>
    </div>
  </DemoBlock>
</template>
