<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { PinInput, PinInputGroup, PinInputSlot, PinInputSeparator } from '@meldui/vue'

const code = `\u003cscript setup>
import { PinInput, PinInputGroup, PinInputSlot, PinInputSeparator } from '@meldui/vue'
<\/script>

<template>
  <PinInput>
    <PinInputGroup>
      <PinInputSlot :index="0" />
      <PinInputSlot :index="1" />
      <PinInputSlot :index="2" />
      <PinInputSeparator />
      <PinInputSlot :index="3" />
      <PinInputSlot :index="4" />
      <PinInputSlot :index="5" />
    </PinInputGroup>
  </PinInput>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <PinInput>
      <PinInputGroup>
        <PinInputSlot :index="0" />
        <PinInputSlot :index="1" />
        <PinInputSlot :index="2" />
        <PinInputSeparator />
        <PinInputSlot :index="3" />
        <PinInputSlot :index="4" />
        <PinInputSlot :index="5" />
      </PinInputGroup>
    </PinInput>
  </DemoBlock>
</template>
