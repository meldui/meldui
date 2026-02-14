<script setup lang="ts">
import { MultiSelect } from '@meldui/vue'
import { ref } from 'vue'

const selected = ref<string[]>([])

const options = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
]
</script>

<template>
  <MultiSelect
    v-model="selected"
    :options="options"
    placeholder="Select frameworks..."
    search-placeholder="Search..."
    empty-text="No frameworks found."
  />
</template>
