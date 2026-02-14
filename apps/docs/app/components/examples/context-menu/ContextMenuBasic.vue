<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@meldui/vue'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger
      class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
    >
      Right click here
    </ContextMenuTrigger>
    <ContextMenuContent class="w-64">
      <ContextMenuItem>Back</ContextMenuItem>
      <ContextMenuItem>Forward</ContextMenuItem>
      <ContextMenuItem>Reload</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>Save As...</ContextMenuItem>
      <ContextMenuItem>Print...</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
