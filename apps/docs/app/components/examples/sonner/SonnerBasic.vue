<script setup lang="ts">
import { Button, Toaster, toast } from '@meldui/vue'
</script>

<template>
  <Toaster />
  <div class="flex flex-wrap gap-3">
    <Button variant="outline" @click="toast('Event has been created.')"> Default </Button>
    <Button variant="outline" @click="toast.success('Changes saved successfully.')">
      Success
    </Button>
    <Button variant="outline" @click="toast.error('Something went wrong.')"> Error </Button>
    <Button variant="outline" @click="toast.warning('Please review before continuing.')">
      Warning
    </Button>
    <Button variant="outline" @click="toast.info('A new update is available.')"> Info </Button>
    <Button
      variant="outline"
      @click="
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
          loading: 'Loading...',
          success: 'Done!',
          error: 'Error!',
        })
      "
    >
      Promise
    </Button>
  </div>
</template>
