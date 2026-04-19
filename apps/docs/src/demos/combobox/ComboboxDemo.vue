<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import {
  Combobox, ComboboxAnchor, ComboboxInput,
  ComboboxList, ComboboxItem, ComboboxItemIndicator,
  ComboboxEmpty, ComboboxTrigger,
} from '@meldui/vue'

const selected = ref('')
const frameworks = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]

const code = `<script setup>
import { ref } from 'vue'
import {
  Combobox, ComboboxAnchor, ComboboxInput,
  ComboboxList, ComboboxItem, ComboboxItemIndicator,
  ComboboxEmpty, ComboboxTrigger,
} from '@meldui/vue'

const selected = ref('')
const frameworks = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]
</script>

<template>
  <Combobox v-model="selected">
    <ComboboxAnchor>
      <ComboboxInput placeholder="Select framework..." />
      <ComboboxTrigger />
    </ComboboxAnchor>
    <ComboboxList>
      <ComboboxEmpty>No framework found.</ComboboxEmpty>
      <ComboboxItem v-for="fw in frameworks" :key="fw.value" :value="fw.value">
        {{ fw.label }}
        <ComboboxItemIndicator />
      </ComboboxItem>
    </ComboboxList>
  </Combobox>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Combobox v-model="selected">
      <ComboboxAnchor>
        <ComboboxInput placeholder="Select framework..." />
        <ComboboxTrigger />
      </ComboboxAnchor>
      <ComboboxList>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxItem v-for="fw in frameworks" :key="fw.value" :value="fw.value">
          {{ fw.label }}
          <ComboboxItemIndicator />
        </ComboboxItem>
      </ComboboxList>
    </Combobox>
  </DemoBlock>
</template>
