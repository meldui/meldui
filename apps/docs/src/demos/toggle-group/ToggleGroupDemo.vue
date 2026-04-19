<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { ToggleGroup, ToggleGroupItem } from '@meldui/vue'
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from '@meldui/tabler-vue'

const alignment = ref('center')

const code = `<script setup>
import { ref } from 'vue'
import { ToggleGroup, ToggleGroupItem } from '@meldui/vue'
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from '@meldui/tabler-vue'

const alignment = ref('center')
</script>

<template>
  <ToggleGroup v-model="alignment" type="single">
    <ToggleGroupItem value="left" aria-label="Align left">
      <IconAlignLeft class="size-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center">
      <IconAlignCenter class="size-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right">
      <IconAlignRight class="size-4" />
    </ToggleGroupItem>
  </ToggleGroup>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <ToggleGroup v-model="alignment" type="single">
      <ToggleGroupItem value="left" aria-label="Align left">
        <IconAlignLeft class="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <IconAlignCenter class="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <IconAlignRight class="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  </DemoBlock>
</template>
