<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut } from '@meldui/vue'

const code = `\u003cscript setup>
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
        <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Print <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
        <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Cut <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
        <MenubarItem>Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
        <MenubarItem>Paste <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Zoom In</MenubarItem>
        <MenubarItem>Zoom Out</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut <MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
          <MenubarItem>Copy <MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
          <MenubarItem>Paste <MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </DemoBlock>
</template>
