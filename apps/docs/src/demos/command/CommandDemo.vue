<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import {
  Command, CommandInput, CommandList,
  CommandGroup, CommandItem, CommandEmpty, CommandSeparator,
} from '@meldui/vue'

const code = `\u003cscript setup>
import {
  Command, CommandInput, CommandList,
  CommandGroup, CommandItem, CommandEmpty, CommandSeparator,
} from '@meldui/vue'
\u003c/script>

<template>
  <Command class="rounded-lg border shadow-md">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem value="calendar">Calendar</CommandItem>
        <CommandItem value="search">Search</CommandItem>
        <CommandItem value="settings">Settings</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem value="profile">Profile</CommandItem>
        <CommandItem value="billing">Billing</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Command class="w-full max-w-md rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar">Calendar</CommandItem>
          <CommandItem value="search">Search</CommandItem>
          <CommandItem value="settings">Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile">Profile</CommandItem>
          <CommandItem value="billing">Billing</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </DemoBlock>
</template>
