<script setup lang="ts">
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@meldui/vue'
import { ref } from 'vue'

const frameworks = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
]

const selected = ref('')
</script>

<template>
  <Combobox v-model="selected">
    <ComboboxAnchor>
      <ComboboxInput placeholder="Search framework..." />
    </ComboboxAnchor>
    <ComboboxList>
      <ComboboxEmpty>No results found.</ComboboxEmpty>
      <ComboboxItem v-for="framework in frameworks" :key="framework.value" :value="framework.value">
        {{ framework.label }}
      </ComboboxItem>
    </ComboboxList>
  </Combobox>
</template>
