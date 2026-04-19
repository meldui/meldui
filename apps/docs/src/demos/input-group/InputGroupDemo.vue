<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@meldui/vue'
import { IconSearch } from '@meldui/tabler-vue'

const code = `\u003cscript setup>
import { InputGroup, InputGroupAddon, InputGroupInput } from '@meldui/vue'
import { IconSearch } from '@meldui/tabler-vue'
<\/script>

<template>
  <InputGroup>
    <InputGroupAddon>
      <IconSearch class="size-4" />
    </InputGroupAddon>
    <InputGroupInput placeholder="Search..." />
  </InputGroup>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <InputGroup class="max-w-sm">
      <InputGroupAddon>
        <IconSearch class="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  </DemoBlock>
</template>
