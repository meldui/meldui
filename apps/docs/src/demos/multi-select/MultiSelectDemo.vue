<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { MultiSelect } from '@meldui/vue'

const selected = ref<string[]>([])

const options = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
  { value: 'astro', label: 'Astro' },
]

const code = `\u003cscript setup>
import { ref } from 'vue'
import { MultiSelect } from '@meldui/vue'

const selected = ref([])

const options = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
]
\u003c/script>

\u003ctemplate>
  <MultiSelect v-model="selected" :options="options" placeholder="Select frameworks..." />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <MultiSelect v-model="selected" :options="options" placeholder="Select frameworks..." class="w-full max-w-sm" />
  </DemoBlock>
</template>
