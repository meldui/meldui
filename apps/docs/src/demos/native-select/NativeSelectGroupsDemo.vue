<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from '@meldui/vue'

const code = `\u003cscript setup>
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <NativeSelect>
    <NativeSelectOption value="" disabled>Select a vehicle</NativeSelectOption>
    <NativeSelectOptGroup label="Cars">
      <NativeSelectOption value="sedan">Sedan</NativeSelectOption>
      <NativeSelectOption value="suv">SUV</NativeSelectOption>
    </NativeSelectOptGroup>
    <NativeSelectOptGroup label="Bikes">
      <NativeSelectOption value="sport">Sport</NativeSelectOption>
      <NativeSelectOption value="cruiser">Cruiser</NativeSelectOption>
    </NativeSelectOptGroup>
  </NativeSelect>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <NativeSelect class="w-[200px]">
      <NativeSelectOption value="" disabled>Select a vehicle</NativeSelectOption>
      <NativeSelectOptGroup label="Cars">
        <NativeSelectOption value="sedan">Sedan</NativeSelectOption>
        <NativeSelectOption value="suv">SUV</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Bikes">
        <NativeSelectOption value="sport">Sport</NativeSelectOption>
        <NativeSelectOption value="cruiser">Cruiser</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  </DemoBlock>
</template>
