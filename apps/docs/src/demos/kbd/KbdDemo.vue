<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Kbd, KbdGroup } from '@meldui/vue'

const code = `\u003cscript setup>
import { Kbd, KbdGroup } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="flex items-center gap-4">
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
    <Kbd>Enter</Kbd>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <Kbd>Enter</Kbd>
    </div>
  </DemoBlock>
</template>
