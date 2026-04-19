<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { MultiSelect } from '@meldui/vue'

const selected = ref<string[]>([])

const groups = [
  {
    label: 'Frontend',
    options: [
      { value: 'vue', label: 'Vue' },
      { value: 'react', label: 'React' },
      { value: 'svelte', label: 'Svelte' },
    ],
  },
  {
    label: 'Backend',
    options: [
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'go', label: 'Go' },
    ],
  },
]

const code = `\u003cscript setup>
import { ref } from 'vue'
import { MultiSelect } from '@meldui/vue'

const selected = ref([])

const groups = [
  {
    label: 'Frontend',
    options: [
      { value: 'vue', label: 'Vue' },
      { value: 'react', label: 'React' },
    ],
  },
  {
    label: 'Backend',
    options: [
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python' },
    ],
  },
]
\u003c/script>

\u003ctemplate>
  <MultiSelect
    v-model="selected"
    :groups="groups"
    placeholder="Select technologies..."
    :max-display="3"
    creatable
  />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <MultiSelect
      v-model="selected"
      :groups="groups"
      placeholder="Select technologies..."
      :max-display="3"
      creatable
      class="w-full max-w-sm"
    />
  </DemoBlock>
</template>
