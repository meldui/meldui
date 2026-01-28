<script setup lang="ts">
import { IconSearch } from '@meldui/tabler-vue'
import type { ComboboxInputProps } from 'reka-ui'
import { ComboboxInput } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<
  ComboboxInputProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = computed(() => {
  const { class: _, ...rest } = props
  return rest
})
</script>

<template>
  <div data-slot="command-input-wrapper" class="flex h-9 items-center gap-2 border-b px-3">
    <IconSearch class="size-4 shrink-0 opacity-50" />
    <ComboboxInput
      data-slot="command-input"
      :class="
        cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
        )
      "
      v-bind="{ ...delegatedProps, ...$attrs }"
    >
      <slot />
    </ComboboxInput>
  </div>
</template>
