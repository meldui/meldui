<script setup lang="ts">
import { IconChecks, IconCopy } from '@meldui/tabler-vue'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import type { ClipboardCopyProps } from './ClipboardCopy.vue'
import ClipboardCopy from './ClipboardCopy.vue'
import CopyIdle from './CopyIdle.vue'
import CopySuccess from './CopySuccess.vue'

interface ButtonProps extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

export interface ClipboardCopyButtonProps
  extends Omit<ClipboardCopyProps, 'asChild' | 'as'>, Pick<ButtonProps, 'variant' | 'size'> {
  /**
   * Custom label for idle state
   * @default 'Copy'
   */
  label?: string
  /**
   * Custom label for success state
   * @default 'Copied!'
   */
  copiedLabel?: string
  /**
   * Variant to use when copied
   * Set to undefined to keep the same variant
   * @default 'success'
   */
  copiedVariant?: ButtonVariants['variant']
  /**
   * Show icons
   * @default true
   */
  showIcon?: boolean
}

const props = withDefaults(defineProps<ClipboardCopyButtonProps>(), {
  variant: 'outline',
  size: 'default',
  copiedDuration: 2000,
  label: 'Copy',
  copiedLabel: 'Copied!',
  copiedVariant: 'success',
  showIcon: true,
})

const emit = defineEmits<{
  success: []
  error: [error: Error]
}>()
</script>

<template>
  <ClipboardCopy
    as-child
    :text="props.text"
    :copied-duration="props.copiedDuration"
    @success="emit('success')"
    @error="emit('error', $event)"
    v-slot="{ isCopied }"
  >
    <Button
      :variant="isCopied && props.copiedVariant ? props.copiedVariant : props.variant"
      :size="props.size"
      :class="props.class"
    >
      <CopyIdle>
        <IconCopy v-if="props.showIcon" :size="16" :class="{ 'mr-2': props.label }" />
        {{ props.label }}
      </CopyIdle>
      <CopySuccess>
        <IconChecks v-if="props.showIcon" :size="16" :class="{ 'mr-2': props.copiedLabel }" />
        {{ props.copiedLabel }}
      </CopySuccess>
    </Button>
  </ClipboardCopy>
</template>
