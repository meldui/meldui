<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@meldui/vue'

const code = `\u003cscript setup>
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@meldui/vue'
<\/script>

<template>
  <Select>
    <SelectTrigger class="w-[180px]">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
    </SelectContent>
  </Select>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Select>
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  </DemoBlock>
</template>
