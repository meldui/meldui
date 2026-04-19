<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { Kbd } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="space-y-2 text-sm">
    <div class="flex items-center justify-between">
      <span>Save</span>
      <span class="flex gap-1"><Kbd>⌘</Kbd><Kbd>S</Kbd></span>
    </div>
    <div class="flex items-center justify-between">
      <span>Copy</span>
      <span class="flex gap-1"><Kbd>⌘</Kbd><Kbd>C</Kbd></span>
    </div>
    <div class="flex items-center justify-between">
      <span>Paste</span>
      <span class="flex gap-1"><Kbd>⌘</Kbd><Kbd>V</Kbd></span>
    </div>
    <div class="flex items-center justify-between">
      <span>Search</span>
      <span class="flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
    </div>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full max-w-xs space-y-2 text-sm">
      <div class="flex items-center justify-between">
        <span>Save</span>
        <span class="flex gap-1"><Kbd>⌘</Kbd><Kbd>S</Kbd></span>
      </div>
      <div class="flex items-center justify-between">
        <span>Copy</span>
        <span class="flex gap-1"><Kbd>⌘</Kbd><Kbd>C</Kbd></span>
      </div>
      <div class="flex items-center justify-between">
        <span>Paste</span>
        <span class="flex gap-1"><Kbd>⌘</Kbd><Kbd>V</Kbd></span>
      </div>
      <div class="flex items-center justify-between">
        <span>Search</span>
        <span class="flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
      </div>
    </div>
  </DemoBlock>
</template>
