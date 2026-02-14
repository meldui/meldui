<script setup lang="ts">
import { Button } from '@meldui/vue'
import { IconMail, IconDownload } from '@meldui/tabler-vue'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Button>
      <IconMail />
      Login with Email
    </Button>
    <Button variant="outline">
      <IconDownload />
      Download
    </Button>
    <Button variant="ghost" size="icon">
      <IconMail />
    </Button>
  </div>
</template>
