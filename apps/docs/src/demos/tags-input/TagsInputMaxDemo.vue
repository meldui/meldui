<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@meldui/vue'

const tags = ref(['React', 'Vue', 'Svelte'])

const code = `\u003cscript setup>
import { ref } from 'vue'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@meldui/vue'

const tags = ref(['React', 'Vue', 'Svelte'])
\u003c/script>

\u003ctemplate>
  <!-- Max 5 tags allowed -->
  <TagsInput v-model="tags" :max="5">
    <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
      <TagsInputItemText />
      <TagsInputItemDelete />
    </TagsInputItem>
    <TagsInputInput placeholder="Add framework (max 5)..." />
  </TagsInput>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <TagsInput v-model="tags" :max="5" class="max-w-sm">
      <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
      <TagsInputInput placeholder="Add framework (max 5)..." />
    </TagsInput>
  </DemoBlock>
</template>
