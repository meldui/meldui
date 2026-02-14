<script setup lang="ts">
import { Button, ClipboardCopy } from '@meldui/vue'
import { IconCopy, IconCheck } from '@meldui/tabler-vue'
</script>

<template>
  <ClipboardCopy value="npm install @meldui/vue" v-slot="{ copied, copy }">
    <Button variant="outline" @click="copy">
      <IconCheck v-if="copied" class="mr-2" :size="16" />
      <IconCopy v-else class="mr-2" :size="16" />
      {{ copied ? 'Copied!' : 'Copy to clipboard' }}
    </Button>
  </ClipboardCopy>
</template>
