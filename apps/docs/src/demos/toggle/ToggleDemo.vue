<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Toggle } from '@meldui/vue'
import { IconBold } from '@meldui/tabler-vue'

const code = `<script setup>
import { Toggle } from '@meldui/vue'
import { IconBold } from '@meldui/tabler-vue'
</script>

<template>
  <Toggle aria-label="Toggle bold">
    <IconBold class="size-4" />
  </Toggle>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Toggle aria-label="Toggle bold">
      <IconBold class="size-4" />
    </Toggle>
  </DemoBlock>
</template>
