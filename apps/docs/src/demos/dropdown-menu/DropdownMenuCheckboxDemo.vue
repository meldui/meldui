<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, Button } from '@meldui/vue'

const showStatusBar = ref(true)
const showPanel = ref(false)

const code = `\u003cscript setup>
import { ref } from 'vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@meldui/vue'
import { Button } from '@meldui/vue'

const showStatusBar = ref(true)
const showPanel = ref(false)
\u003c/script>

\u003ctemplate>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">View Options</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem v-model:checked="showStatusBar">
        Status Bar
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model:checked="showPanel">
        Activity Panel
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">View Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem v-model:checked="showStatusBar">
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem v-model:checked="showPanel">
          Activity Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </DemoBlock>
</template>
