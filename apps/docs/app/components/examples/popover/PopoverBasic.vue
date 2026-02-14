<script setup lang="ts">
import { Button, Popover, PopoverContent, PopoverTrigger } from '@meldui/vue'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline">Open Popover</Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Dimensions</h4>
          <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
        </div>
        <div class="grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <label class="text-sm">Width</label>
            <input class="col-span-2 rounded-md border px-3 py-1 text-sm" value="100%" />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <label class="text-sm">Height</label>
            <input class="col-span-2 rounded-md border px-3 py-1 text-sm" value="25px" />
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
