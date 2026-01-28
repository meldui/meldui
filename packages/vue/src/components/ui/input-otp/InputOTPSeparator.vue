<script setup lang="ts">
import { IconMinus } from '@meldui/tabler-vue'
import { useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const forwarded = useForwardProps(props)
</script>

<template>
  <div data-slot="input-otp-separator" role="separator" v-bind="forwarded">
    <slot>
      <IconMinus />
    </slot>
  </div>
</template>
