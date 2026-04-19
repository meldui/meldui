<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import {
  CommandDialog, CommandInput, CommandList,
  CommandGroup, CommandItem, CommandEmpty, Button,
} from '@meldui/vue'

const open = ref(false)

const code = `\u003cscript setup>
import { ref } from 'vue'
import {
  CommandDialog, CommandInput, CommandList,
  CommandGroup, CommandItem, CommandEmpty, Button,
} from '@meldui/vue'

const open = ref(false)
\u003c/script>

<template>
  <Button variant="outline" @click="open = true">Open Command Palette</Button>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="Type a command..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Actions">
        <CommandItem value="new-file">New File</CommandItem>
        <CommandItem value="new-folder">New Folder</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div>
      <Button variant="outline" @click="open = true">Open Command Palette</Button>
      <CommandDialog v-model:open="open">
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem value="new-file">New File</CommandItem>
            <CommandItem value="new-folder">New Folder</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  </DemoBlock>
</template>
