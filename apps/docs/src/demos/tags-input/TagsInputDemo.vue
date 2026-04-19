<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@meldui/vue'

const tags = ref(['Vue', 'TypeScript'])

const code = `\u003cscript setup>
import { ref } from 'vue'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@meldui/vue'

const tags = ref(['Vue', 'TypeScript'])
<\/script>

<template>
  <TagsInput v-model="tags">
    <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
      <TagsInputItemText />
      <TagsInputItemDelete />
    </TagsInputItem>
    <TagsInputInput placeholder="Add tag..." />
  </TagsInput>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <TagsInput v-model="tags" class="max-w-sm">
      <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
      <TagsInputInput placeholder="Add tag..." />
    </TagsInput>
  </DemoBlock>
</template>
