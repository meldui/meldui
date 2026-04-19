<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut } from '@meldui/vue'

const code = `\u003cscript setup>
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <ContextMenu>
    <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
      Right click here
    </ContextMenuTrigger>
    <ContextMenuContent class="w-64">
      <ContextMenuItem>
        Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>Save As...</ContextMenuItem>
      <ContextMenuItem>Print...</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <ContextMenu>
      <ContextMenuTrigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent class="w-64">
        <ContextMenuItem>
          Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Save As...</ContextMenuItem>
        <ContextMenuItem>Print...</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </DemoBlock>
</template>
